import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Mails with signatures tests', async () => {
  let mailSubject;
  let mailBody;

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.mails();
    mailSubject = BaseTest.dateTimePrefix() + ' Autotest Mail Subject';
    mailBody = BaseTest.dateTimePrefix() + ' Autotest Mail Body';
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Mail);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC239. Open the sent reply mail with signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    BaseTest.doubleTimeout();
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, undefined, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });
  // Skipped due to Inbox re-opening bug
  test.skip('TC240. Open the received reply mail with signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });

  test("TC257. Open the sent forwarded mail with signatures in the quote. Correct mail body should be visible in mail details", async ({apiManager, pageManager}) => {
    BaseTest.doubleTimeout();
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward, `FWD: ${mailSubject}`, undefined, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });
  // Skipped due to Inbox re-opening bug
  test.skip("TC258. Open the received forwarded mail with signatures in the quote. Correct mail body should be visible in mail details", async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward, `FWD: ${mailSubject}`);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });

  test('TC266. Open the sent reply mail without signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, FillWithCustomBody.WithoutSignatures, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });
  // Skipped due to Inbox re-opening bug
  test.skip('TC267. Open the received reply mail without signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, FillWithCustomBody.WithoutSignatures);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });

  test('TC268. Open the sent forwarded mail without signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward, `FWD: ${mailSubject}`, FillWithCustomBody.WithoutSignatures, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });
  // Skipped due to Inbox re-opening bug
  test.skip('TC269. Open the forwarded reply mail without signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward, `FWD: ${mailSubject}`, FillWithCustomBody.WithoutSignatures);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible').toHaveText(mailBody);
  });
  // Skipped due to Inbox re-opening bug
  test.skip('TC270. Edit as new a mail without signatures in the quote. Correct mail body should be visible', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, FillWithCustomBody.WithoutSignatures);
    await pageManager.mailDetails.SelectMailOption.EditAsNew();
    await expect(pageManager.newMail.TextBox.Body, 'Correct mail body should be visible').toHaveText(mailBody, {useInnerText: true});
  });
  // Skipped due to Inbox re-opening bug
  test.skip('TC271. Edit as new a mail with signatures only in the body. Correct mail body should be visible', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, FillWithCustomBody.SignaturesOnlyInTheBody);
    await pageManager.mailDetails.SelectMailOption.EditAsNew();
    await expect(pageManager.newMail.TextBox.Body, 'Correct mail body should be visible').toHaveText(mailBody, {useInnerText: true});
  });
  // Skipped due to Inbox re-opening bug
  test.skip('TC272. Edit as new a mail with signatures in the quote. Correct mail body should be visible', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`);
    await pageManager.mailDetails.SelectMailOption.EditAsNew();
    await expect(pageManager.newMail.TextBox.Body, 'Correct mail body should be visible').toHaveText(mailBody, {useInnerText: true});
  });
  // Skipped due to Inbox re-opening bug
  test.skip('TC273. Edit as new a mail with signatures both in the body and in the quote. Correct mail body should be visible', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, FillWithCustomBody.SignaturesBothInTheBodyAndInTheQuote);
    await pageManager.mailDetails.SelectMailOption.EditAsNew();
    await expect(pageManager.newMail.TextBox.Body, 'Correct mail body should be visible').toHaveText(mailBody, {useInnerText: true});
  });

  test('TC274. Draft reply to the mail without signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, FillWithCustomBody.WithoutSignatures, pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });

  test('TC275. Draft reply to the mail with signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`, undefined, pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });

  test('TC276. Draft forward of the mail without signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward, `FWD: ${mailSubject}`, FillWithCustomBody.WithoutSignatures, pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });

  test('TC277. Draft forward of the mail with signatures in the quote. Correct mail body should be visible in mail details', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward, `FWD: ${mailSubject}`, undefined, pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct mail body should be visible in mail details').toHaveText(mailBody);
  });

  test('TC286. Reply to the mail. Undefined value should not be visible in Signatures quote', async ({pageManager, apiManager}) => {
    test.fail(true, "Issue #53");
    await OpenMailAndSelectOption({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, `RE: ${mailSubject}`);
    await expect(pageManager.newMail.BodyElements.Quote, 'Undefined value should not be visible in Signatures quote').not.toContainText("undefined", {useInnerText: true});
  });

  async function OpenMailAndSelectOption({apiManager, pageManager}, option, mailSubject) {
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await OpenMailFolderAndOpenMail({pageManager}, mailSubject);
    await option();
  };

  async function OpenMailFolderAndOpenMail({pageManager}, mailSubject, openFolder = pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox) {
    await openFolder();
    await pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).first().waitFor(); // first(): workaround for duplicate draft bug
    if (await pageManager.mailsList.MailConversationElements.Buttons.ChevronDown(mailSubject).isVisible()) {
      await pageManager.mailsList.MailConversationElements.Buttons.ChevronDown(mailSubject).click();
      if (openFolder === pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox) {
        await pageManager.mailsList.MailConversationElements.UnreadMail.first().click();
      } else {
        await pageManager.mailsList.MailConversationElements.SentMail.first().click();
      };
    } else {
      await pageManager.mailsList.OpenMail(mailSubject);
    };
  };

  async function SendReceivedMailBySelectedOptionAndOpenMail({apiManager, pageManager}, option, mailSubject, customBody = FillWithCustomBody.SignaturesOnlyInTheQuote, folder?) {
    await OpenMailAndSelectOption({apiManager, pageManager}, option, mailSubject);
    if (option === pageManager.mailDetails.SelectMailOption.Forward) {
      await pageManager.newMail.ClickOnToTexbox();
      await pageManager.newMail.TextBox.To.fill(BaseTest.userForLogin.login);
    };
    await pageManager.newMail.TextBox.Body.click({position: {x: 5, y: 5}});
    mailBody = await customBody({pageManager});
    await pageManager.newMail.WaitForDraftSavedNotificationHiding();
    if (folder === pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts) {
      await pageManager.newMail.Buttons.Save.click();
      await pageManager.newMail.Buttons.CloseCross.click();
      if (await pageManager.beforeYouLeaveModal.Containers.MainContainer.isVisible()) { // if block: workaround for Issue #28
        await pageManager.beforeYouLeaveModal.Buttons.SaveDraft.click();
      };
    } else {
      await pageManager.newMail.Buttons.Send.click();
    };
    await pageManager.baseApplicationPage.WaitForNotificationHiding();
    await OpenMailFolderAndOpenMail({pageManager}, mailSubject, folder);
    await pageManager.mailDetails.SelectMailOption.ShowQuotedText();
  };

  const FillWithCustomBody = {
    SignaturesOnlyInTheQuote: async function({pageManager}) {
      await pageManager.newMail.TextBox.Body.type(mailBody);
      return await pageManager.newMail.TextBox.Body.innerText();
    },
    SignaturesOnlyInTheBody: async function({pageManager}) {
      await pageManager.newMail.TextBox.Body.type(await pageManager.newMail.BodyElements.Quote.innerText());
      await pageManager.newMail.BodyElements.Quote.fill(mailBody);
      return await pageManager.newMail.TextBox.Body.innerText();
    },
    SignaturesBothInTheBodyAndInTheQuote: async function({pageManager}) {
      await pageManager.newMail.TextBox.Body.type(await pageManager.newMail.BodyElements.Quote.innerText());
      return await pageManager.newMail.TextBox.Body.innerText();
    },
    WithoutSignatures: async function({pageManager}) {
      await pageManager.newMail.TextBox.Body.type(mailBody);
      await pageManager.newMail.BodyElements.Quote.fill(mailBody);
      return await pageManager.newMail.TextBox.Body.innerText();
    },
  };
});
