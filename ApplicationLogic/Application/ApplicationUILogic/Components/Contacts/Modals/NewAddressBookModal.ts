import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class NewAddressBookModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Create: this.Containers.MainContainer.locator('"Create"'),
  };

  TextBoxes = {
    AddressBookName: this.Containers.MainContainer.locator('[name="Insert address book name"]'),
  };

  DropDowns = {
    Root: this.Containers.MainContainer.locator('"Root"'),
    Contacts: this.Containers.MainContainer.locator('"Contacts"'),
    EmailedContacts: this.Containers.MainContainer.locator('"Emailed Contacts"'),
  };

  async CreateNewAddressBook(addressBookName) {
    await this.TextBoxes.AddressBookName.fill(addressBookName);
    await this.Buttons.Create.click();
  };
}
