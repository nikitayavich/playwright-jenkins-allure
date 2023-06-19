import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Contacts tests', async () => {
  let mailSubject;
  let mailBody;
  let firstName;
  let newFirstName;
  let lastName;
  let email;
  let tagName;
  let firstInputBox;
  let secondInputBox;

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.contacts();
    firstName = BaseTest.dateTimePrefix();
    newFirstName = BaseTest.dateTimePrefix() + 'New';
    lastName = BaseTest.dateTimePrefix() + 'LName';
    email = BaseTest.dateTimePrefix() + '@test.com';
    mailSubject = BaseTest.dateTimePrefix() + ' Autotest Mail Subject';
    mailBody = BaseTest.dateTimePrefix() + ' Autotest Mail Body';
    tagName = BaseTest.dateTimePrefix() + 'Tag';
    firstInputBox = BaseTest.dateTimePrefix() + 'FirstField';
    secondInputBox = BaseTest.dateTimePrefix() + 'SecondField';
    await apiManager.contactsAPI.DeleteContactsViaAPI(BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Contacts);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.contactsAPI.DeleteContactsViaAPI(BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC601. Open contacts tab. Contacts folder options should be visible. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    await expect(pageManager.sideSecondaryContactsMenu.ContactAddressBooks.Contacts, 'Contacts tab should be presented').toBeVisible();
    await expect(pageManager.sideSecondaryContactsMenu.ContactAddressBooks.EmailedContacts, 'Emailed contacts tab should be presented').toBeVisible();
    await expect(pageManager.sideSecondaryContactsMenu.ContactAddressBooks.Trash, 'Trash tab should be presented').toBeVisible();
  });

  test('TC602. Add new contact. New contact appears in Contacts folder. @smoke', async ({page, pageManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await pageManager.headerMenu.Buttons.NewItem.click();
    await pageManager.newContact.CreateNewContact(firstName, lastName, email);
    const elementHandle = await page.$(pageManager.baseApplicationPage.InheritedFields.NewItemBoardLocator);
    await elementHandle?.waitForElementState('hidden');
    await expect(pageManager.contactsList.Containers.MainContainer.locator(`"${email}"`), 'The e-mail address of a new contact is visible in Contacts list').toBeVisible();
  });

  test('TC603. Emailed contact. New email reciever appears in emailed Contacts folder', async ({pageManager, apiManager}) => {
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [email]);
    await pageManager.sideSecondaryContactsMenu.ContactAddressBooks.EmailedContacts.click();
    await expect(pageManager.contactsList.Containers.MainContainer.locator(`"${email}"`), 'The e-mail address of a new contact is visible in Emailed contacts list').toBeVisible();
  });

  test('TC604. Delete contact. Contact appears in Trash folder', async ({page, pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await CreateContactAndOpenContactsBook({pageManager, apiManager});
    await pageManager.contactsList.SelectContactContextMenuOption.Delete(BaseTest.userForLogin.login);
    await page.reload();
    await pageManager.sideSecondaryContactsMenu.ContactAddressBooks.Trash.click();
    await expect(pageManager.contactsList.Containers.MainContainer.locator(`"${firstName}"`), 'The first name of a new contact is visible in Trash contacts list').toBeVisible();
  });

  test('TC605. Delete contact permanently. Contact disappears from Trash folder', async ({pageManager, apiManager}) => {
    await DeleteContactAndOpenTrashFolder({apiManager, pageManager});
    await pageManager.contactsList.SelectContactContextMenuOption.DeletePermanently(BaseTest.userForLogin.login);
    await pageManager.deleteContactPermanentlyModal.Buttons.DeletePermanently.click();
    await expect(pageManager.contactsList.Containers.MainContainer.locator(`"${firstName}"`), 'The first name of a new contact is not visible in Trash contacts list').not.toBeVisible();
  });

  test('TC606. Edit contact data. Edited contact data is visible in Contacts folder', async ({pageManager, apiManager}) => {
    await CreateContactAndOpenContactsBook({pageManager, apiManager});
    await pageManager.contactsList.Containers.MainContainer.locator(`"${BaseTest.userForLogin.login}"`).first().click();
    await pageManager.contactDetails.ContactOptions.Edit.click();
    await pageManager.contactDetails.EditContactView.FirstName.fill(newFirstName);
    await pageManager.contactDetails.EditContactView.Save.click();
    await expect(pageManager.contactsList.Containers.ListContainer.locator(`"${newFirstName}"`), 'The edited last name of contact is visible in Contacts list').toBeVisible();
  });

  test('TC607. Sent email to contact. New E-mail board is visible', async ({pageManager, apiManager}) => {
    await CreateContactAndOpenContactsBook({pageManager, apiManager});
    await pageManager.contactsList.SelectContactContextMenuOption.SendEmail(BaseTest.userForLogin.login);
    await expect(pageManager.newMail.Containers.MainContainer.locator(`//*[starts-with(text(),"${firstName}")]`), `New E-mail board with Contact's first name is visible`).toBeVisible();
  });

  test('TC608. Check the contact count is correct. The count matches Contact list length', async ({page, pageManager, apiManager}) => {
    const contactId = await EditContactListAndCheckCount({page, pageManager, apiManager});
    await EditContactListAndCheckCount({page, pageManager, apiManager}, contactId);
  });

  test('TC609. Move contact. Contact appears in Emailed contacts folder', async ({pageManager, apiManager}) => {
    await CreateContactAndOpenContactsBook({pageManager, apiManager});
    await MoveContactAndOpenDestinationFolder({pageManager}, pageManager.contactsList.SelectContactContextMenuOption.Move);
    await expect(pageManager.contactsList.Elements.Contact.locator(`"${firstName}"`)).toBeVisible();
  });

  test('TC610. Add tag to contact. Tag icon is visible in Contact list item', async ({pageManager, apiManager}) => {
    await CreateContactAndOpenContactsBook({pageManager, apiManager});
    await pageManager.contactsList.SelectContactContextMenuOption.NewTag(BaseTest.userForLogin.login);
    await pageManager.newTagModal.CreateTag(tagName);
    await expect(pageManager.contactsList.Elements.ContactTag).toBeVisible();
  });

  test('TC611. Restore contact from Trash. Contact appears in Emailed contacts folder', async ({pageManager, apiManager}) => {
    await DeleteContactAndOpenTrashFolder({apiManager, pageManager});
    await MoveContactAndOpenDestinationFolder({pageManager}, pageManager.contactsList.SelectContactContextMenuOption.Restore);
    await expect(pageManager.contactsList.Containers.MainContainer.locator(`"${firstName}"`)).toBeVisible();
  });

  test('TC612. Click Plus Email button. Second Email input field appears', async ({pageManager}) => {
    await ClickPlusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusEmail);
    await expect(pageManager.newContact.Inputs.Email.nth(1)).toBeVisible();
  });

  test('TC613. Click Plus Phone Number button. Second Number input field appears ', async ({pageManager}) => {
    await ClickPlusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusPhone);
    await expect(pageManager.newContact.Inputs.PhoneNumber.nth(1)).toBeVisible();
  });

  test('TC614. Click Plus Website button. Second Website input field appears ', async ({pageManager}) => {
    await ClickPlusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusWebsite);
    await expect(pageManager.newContact.Inputs.Website.nth(1)).toBeVisible();
  });

  test('TC615. Click Plus Address button. Second Address input field appears ', async ({pageManager}) => {
    await ClickPlusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusAddress);
    await expect(pageManager.newContact.Inputs.Address.nth(1)).toBeVisible();
  });

  test('TC616. Click Minus Email button. Second Email input field hides', async ({pageManager}) => {
    await ClickPlusAndMinusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusEmail, pageManager.newContact.Buttons.MinusEmail.first());
    await expect(pageManager.newContact.Inputs.Email.nth(1)).not.toBeVisible();
  });

  test('TC617. Click Minus Phone Number button. Second Phone Number input field hides', async ({pageManager}) => {
    await ClickPlusAndMinusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Buttons.MinusPhone.first());
    await expect(pageManager.newContact.Inputs.PhoneNumber.nth(1)).not.toBeVisible();
  });

  test('TC618. Click Minus Website button. Second Website input field hides', async ({pageManager}) => {
    await ClickPlusAndMinusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusWebsite, pageManager.newContact.Buttons.MinusWebsite.first());
    await expect(pageManager.newContact.Inputs.Website.nth(1)).not.toBeVisible();
  });

  test('TC619. Click Minus Address button. Second Address input field hides', async ({pageManager}) => {
    await ClickPlusAndMinusButtonInNewItemBoard({pageManager}, pageManager.newContact.Buttons.PlusAddress, pageManager.newContact.Buttons.MinusAddress.first());
    await expect(pageManager.newContact.Inputs.Address.nth(1)).not.toBeVisible();
  });

  test('TC620. Contact info view hides. Contact Details field hides', async ({pageManager, apiManager}) => {
    await CreateAndClickContactAndHideContactDetails({apiManager, pageManager});
    await expect(pageManager.contactDetails.Fields.FirstName).not.toBeVisible();
  });

  test('TC621. Contact info view expands. Contact Details field appears', async ({pageManager, apiManager}) => {
    await CreateAndClickContactAndHideContactDetails({apiManager, pageManager});
    await pageManager.contactDetails.Chevrons.DetailsChevronDown.click();
    await expect(pageManager.contactDetails.Fields.FirstName).toBeVisible();
  });

  test('TC622. Click Minus on filled Email button. The field should be empty', async ({pageManager}) => {
    await FillInputFieldAndClickMinusInNewItemBoard({pageManager}, pageManager.newContact.Inputs.Email, pageManager.newContact.Buttons.MinusEmail);
    await expect(pageManager.newContact.Inputs.Email).toBeEmpty();
  });

  test('TC623. Click Minus on filled Phone Number button. The field should be empty', async ({pageManager}) => {
    await FillInputFieldAndClickMinusInNewItemBoard({pageManager}, pageManager.newContact.Inputs.PhoneNumber, pageManager.newContact.Buttons.MinusPhone);
    await expect(pageManager.newContact.Inputs.PhoneNumber).toBeEmpty();
  });

  test('TC624. Click Minus on filled Website button. The field should be empty', async ({pageManager}) => {
    await FillInputFieldAndClickMinusInNewItemBoard({pageManager}, pageManager.newContact.Inputs.Website, pageManager.newContact.Buttons.MinusWebsite);
    await expect(pageManager.newContact.Inputs.Website).toBeEmpty();
  });

  test('TC625. Click Minus on filled Address button. The field should be empty', async ({pageManager}) => {
    await FillInputFieldAndClickMinusInNewItemBoard({pageManager}, pageManager.newContact.Inputs.Address, pageManager.newContact.Buttons.MinusAddress);
    await expect(pageManager.newContact.Inputs.Address).toBeEmpty();
  });

  test('TC626. Add 2 email in contact. Email field expandable in contact info, both emails are visible', async ({pageManager}) => {
    await CreateContactWithTwoFields({pageManager}, pageManager.newContact.Buttons.PlusEmail, pageManager.newContact.Inputs.Email);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.EmailChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${firstInputBox}"`)).toBeVisible();
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${secondInputBox}"`)).toBeVisible();
  });

  test('TC627. Add 2 phone numbers. Phone Contacts field expandable in contact info, both phone numbers are visible', async ({pageManager}) => {
    await CreateContactWithTwoFields({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.PhoneNumber);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.PhoneNumberChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${firstInputBox}"`)).toBeVisible();
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${secondInputBox}"`)).toBeVisible();
  });

  // Issue #46
  test.skip('TC628. Add 2 websites. Website field expandable in contact info, both websites are visible', async ({pageManager}) => {
    await CreateContactWithTwoFields({pageManager}, pageManager.newContact.Buttons.PlusWebsite, pageManager.newContact.Inputs.Website);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.WebsiteChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${firstInputBox}"`)).toBeVisible();
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${secondInputBox}"`)).toBeVisible();
  });

  // Issue #47
  test.skip('TC629. Add 2 addresses. Address field expandable in contact info, both addresses are visible', async ({pageManager}) => {
    await CreateContactWithTwoFields({pageManager}, pageManager.newContact.Buttons.PlusAddress, pageManager.newContact.Inputs.Address);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.AddressChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${firstInputBox}"`)).toBeVisible();
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`"${secondInputBox}"`)).toBeVisible();
  });

  test('TC630. Add Mobile Phone number. Mobile Phone number icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.PhoneNumber, pageManager.newContact.Buttons.SelectPhoneType, pageManager.newContact.TypeOptions.MobileType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.PhoneNumberChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Mobile}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  test('TC631. Add Work Phone number. Work Phone number icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.PhoneNumber, pageManager.newContact.Buttons.SelectPhoneType, pageManager.newContact.TypeOptions.WorkType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.PhoneNumberChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Work}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  test('TC632. Add Home Phone number. Home Phone number icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.PhoneNumber, pageManager.newContact.Buttons.SelectPhoneType, pageManager.newContact.TypeOptions.HomeType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.PhoneNumberChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Home}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  test('TC633. Add Other Phone number. Other Phone number icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.PhoneNumber, pageManager.newContact.Buttons.SelectPhoneType, pageManager.newContact.TypeOptions.OtherType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.PhoneNumberChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Other}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  // Issue #46
  test.skip('TC634. Add Work Website. Work Website icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.Website, pageManager.newContact.Buttons.SelectWebsiteType, pageManager.newContact.TypeOptions.WorkType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.WebsiteChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Work}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  // Issue #46
  test.skip('TC635. Add Home Website. Home Website icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.Website, pageManager.newContact.Buttons.SelectWebsiteType, pageManager.newContact.TypeOptions.HomeType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.WebsiteChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Home}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  // Issue #46
  test.skip('TC636. Add Other Website. Other Website icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.Website, pageManager.newContact.Buttons.SelectWebsiteType, pageManager.newContact.TypeOptions.OtherType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.WebsiteChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Other}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  // Issue #47
  test.skip('TC637. Add Work Address. Work Address icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.Address, pageManager.newContact.Buttons.SelectAddressType, pageManager.newContact.TypeOptions.WorkType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.AddressChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Work}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  // Issue #47
  test.skip('TC638. Add Home Address. Home Address icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.Address, pageManager.newContact.Buttons.SelectAddressType, pageManager.newContact.TypeOptions.HomeType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.AddressChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Home}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  // Issue #47
  test.skip('TC639. Add Other Address. Other Address icon is visible', async ({pageManager}) => {
    await CreateContactAndSelectFieldType({pageManager}, pageManager.newContact.Buttons.PlusPhone, pageManager.newContact.Inputs.Address, pageManager.newContact.Buttons.SelectAddressType, pageManager.newContact.TypeOptions.OtherType);
    await ClickContactAndExpandChevron({pageManager}, pageManager.contactDetails.Chevrons.AddressChevronDown);
    await expect(pageManager.newContact.Containers.DropdownContainer.locator(`${pageManager.contactDetails.TypeIcons.Other}[label="${firstInputBox}"]`).first()).toBeVisible();
  });

  test('TC640. Edit First name in Edit panel. New First name should be visible', async ({pageManager}) => {
    await CreateContactAndOpenEditPanel({pageManager});
    await FillFieldAndClickSave({pageManager}, pageManager.contactDetails.EditContactView.FirstName);
    await expect(pageManager.contactDetails.Fields.FirstName).toContainText(newFirstName);
  });

  test('TC641. Edit Last name in Edit panel. New Last name should be visible', async ({pageManager}) => {
    await CreateContactAndOpenEditPanel({pageManager});
    await FillFieldAndClickSave({pageManager}, pageManager.contactDetails.EditContactView.LastName);
    await expect(pageManager.contactDetails.Fields.LastName).toContainText(newFirstName);
  });

  test('TC642. Edit Email in Edit panel. New Email should be visible', async ({pageManager}) => {
    await CreateContactAndOpenEditPanel({pageManager});
    await FillFieldAndClickSave({pageManager}, pageManager.contactDetails.EditContactView.Email);
    await expect(pageManager.contactDetails.Fields.Email).toContainText(newFirstName);
  });

  test('TC643. Edit Phone number in Edit panel. New Phone number should be visible', async ({pageManager}) => {
    await CreateContactWithExtraFieldAndOpenEditPanel({pageManager}, pageManager.newContact.Inputs.PhoneNumber);
    await FillFieldAndClickSave({pageManager}, pageManager.contactDetails.EditContactView.PhoneNumber);
    await expect(pageManager.contactDetails.Fields.PhoneNumber).toContainText(newFirstName);
  });

  test('TC644. Edit Website in Edit panel. New Website should be visible', async ({pageManager}) => {
    test.fail(true, 'Issue #46');
    await CreateContactWithExtraFieldAndOpenEditPanel({pageManager}, pageManager.newContact.Inputs.Website);
    await FillFieldAndClickSave({pageManager}, pageManager.contactDetails.EditContactView.Website);
    await expect(pageManager.contactDetails.Fields.Website).toContainText(newFirstName);
  });

  test('TC645. Edit Address in Edit panel. New Address should be visible', async ({pageManager}) => {
    test.fail(true, 'Issue #47');
    await CreateContactWithExtraFieldAndOpenEditPanel({pageManager}, pageManager.newContact.Inputs.Address.first());
    await FillFieldAndClickSave({pageManager}, pageManager.contactDetails.EditContactView.Address.first());
    await expect(pageManager.contactDetails.Fields.Address.first()).toContainText(newFirstName);
  });

  async function DeleteContactAndOpenTrashFolder({apiManager, pageManager}) {
    const contactId = await CreateContactAndOpenContactsBook({pageManager, apiManager});
    await apiManager.deleteContactsAPI.DeleteContactsById(contactId, BaseTest.userForLogin.login);
    await pageManager.sideSecondaryContactsMenu.ContactAddressBooks.Trash.click();
  };

  async function MoveContactAndOpenDestinationFolder({pageManager}, option) {
    await option(BaseTest.userForLogin.login);
    await pageManager.moveAddressBookModal.DropDowns.EmailedContacts.click();
    if (option === pageManager.contactsList.SelectContactContextMenuOption.Move) {
      await pageManager.moveAddressBookModal.Buttons.Move.click();
    } else {
      await pageManager.moveAddressBookModal.Buttons.Restore.click();
    };
    await pageManager.sideSecondaryContactsMenu.ContactAddressBooks.EmailedContacts.click();
  };

  async function EditContactListAndCheckCount({page, pageManager, apiManager}, contactId?) {
    if (contactId) {
      await apiManager.deleteContactsAPI.DeleteContactsById(contactId, BaseTest.userForLogin.login);
    } else {
      contactId = await CreateContactAndOpenContactsBook({pageManager, apiManager});
    }
    await page.reload();
    const count = async () => +await pageManager.contactsList.Elements.Count.innerText();
    await expect(pageManager.contactsList.Elements.Contact, 'The count matches Contact list length').toHaveCount(await count());
    return contactId;
  };

  async function ClickPlusButtonInNewItemBoard({pageManager}, plusbutton) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await plusbutton.click();
  };

  async function ClickPlusAndMinusButtonInNewItemBoard({pageManager}, plusbutton, minusbutton) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await plusbutton.click();
    await minusbutton.click();
  };

  async function CreateAndClickContactAndHideContactDetails({apiManager, pageManager}) {
    await CreateContactAndOpenContactsBook({pageManager, apiManager});
    await pageManager.contactsList.Containers.MainContainer.locator(`"${BaseTest.userForLogin.login}"`).first().click();
    await pageManager.contactDetails.Chevrons.DetailsChevronUp.click();
  };

  async function FillInputFieldAndClickMinusInNewItemBoard({pageManager}, field, minusbutton) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await field.fill(`${firstName}`);
    await minusbutton.click();
  };

  async function CreateContactAndOpenContactsBook({pageManager, apiManager}) {
    const contactId = await apiManager.createContactsAPI.CreateContact(firstName, BaseTest.userForLogin.login);
    await pageManager.sideSecondaryContactsMenu.ContactAddressBooks.Contacts.click();
    return contactId;
  };

  async function FillTwoFields(field) {
    await field.nth(0).fill(firstInputBox);
    await field.nth(1).fill(secondInputBox);
  };

  async function CreateContactWithTwoFields({pageManager}, button, field) {
    await ClickPlusButtonInNewItemBoard({pageManager}, button);
    await FillTwoFields(field);
    await pageManager.newContact.Inputs.FirstName.fill(firstName);
    await pageManager.newContact.Buttons.Save.click();
  };

  async function CreateContactAndSelectFieldType({pageManager}, button, field, typebox, typeoption) {
    await ClickPlusButtonInNewItemBoard({pageManager}, button);
    await FillTwoFields(field);
    await typebox.first().click();
    await typeoption.click();
    await pageManager.newContact.Inputs.FirstName.fill(firstName);
    await pageManager.newContact.Buttons.Save.click();
  };

  async function ClickContactAndExpandChevron({pageManager}, chevron) {
    await pageManager.contactsList.Elements.ContactByFirstName(firstName).click();
    await chevron.click();
  };

  async function ClickContactAndClickEdit({pageManager}) {
    await pageManager.contactsList.Elements.ContactByFirstName(firstName).click();
    await pageManager.contactDetails.ContactOptions.Edit.click();
  }

  async function CreateContactAndOpenEditPanel({pageManager}) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await pageManager.newContact.CreateNewContact(firstName, lastName, email);
    await ClickContactAndClickEdit({pageManager});
  };

  async function CreateContactWithExtraFieldAndOpenEditPanel({pageManager}, field) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await field.fill(firstName);
    await pageManager.newContact.CreateNewContact(firstName, lastName, email);
    await ClickContactAndClickEdit({pageManager});
  };

  async function FillFieldAndClickSave({pageManager}, field) {
    await field.fill(newFirstName);
    await pageManager.contactDetails.EditContactView.Save.click();
  };
});
