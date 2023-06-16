import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Mails tests', async () => {
  let mailSubject;
  let mailBody;
  const msgCount = '4';

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

  test('TC201. Open Mail tab. User`s login should be visible in the secondary sidebar. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Mail);
    await expect(pageManager.sideSecondaryMailMenu.Containers.MainContainer.locator(`"${BaseTest.userForLogin.login}"`), 'User`s login should be visible in the secondary sidebar').toBeVisible();
  });

  test('TC202. Send mail. Mail should be visible in the Sent folder list. @criticalPath', async ({pageManager, page}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await SendMailAndOpenFolder({pageManager, page}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should be visible in the Sent folder list').toBeVisible();
  });

  test('TC203. Mark mail as spam. Mail should be visible in the Junk folder list', async ({pageManager, apiManager}) => {
    await SendOpenMailMarkAsSpamAndMoveToJunk({pageManager, apiManager});
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).first(), 'Mail should be visible in the Junk folder list').toBeVisible();
  });

  test('TC204. Get mail. Mail should be visible in the Inbox folder list. @smoke', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.smoke();
    test.fail(true, 'Issue #44');
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox();
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should be visible in the Inbox folder list').toBeVisible();
  });
  // Issue #54
  test.skip('TC205. Save mail draft. Mail should be visible in the Drafts folder list. @criticalPath', async ({page, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await SendMailAndOpenFolder({pageManager, page}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts, pageManager.newMail.Buttons.Save);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should be visible in the Drafts folder list').toBeVisible();
  });

  test('TC206. Move mail to trash. Mail should be visible in the Trash folder list', async ({pageManager, apiManager}) => {
    await SendMailDeleteAndMoveToTrash({apiManager, pageManager});
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should be visible in the Trash folder list').toBeVisible();
  });

  test('TC213. Delete mail permanently. Mail should not be visible in the Trash folder list', async ({pageManager, apiManager}) => {
    const id = await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await apiManager.deleteMailsAPI.MoveToTrash(id);
    await OpenMailFolderAndOpenMail({pageManager}, mailSubject, pageManager.sideSecondaryMailMenu.OpenMailFolder.Trash);
    await pageManager.mailDetails.SelectMailOption.DeletePermanently();
    await pageManager.deleteMailModal.DeletePermanently();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should not be visible in the Trash folder list').not.toBeVisible();
  });

  test('TC214. Hide New Email board. New Email board should not be visible', async ({page, pageManager}) => {
    await OpenNewEmailBoardAndHideBoard({pageManager});
    await expect(page.locator(pageManager.baseApplicationPage.InheritedFields.NewItemBoardLocator), 'New Email board should not be visible').not.toBeVisible();
  });

  test('TC215. Expand New Email board. New Email board should be visible', async ({page, pageManager}) => {
    await OpenNewEmailBoardAndHideBoard({pageManager});
    await pageManager.sideMenu.Buttons.OpenBoard.click();
    await expect(page.locator(pageManager.baseApplicationPage.InheritedFields.NewItemBoardLocator), 'New Email board should be visible').toBeVisible();
  });

  test('TC216. Enlarge New Email board. New Email board should be enlarged', async ({pageManager}) => {
    await OpenNewEmailBoardAndExpandBoard({pageManager});
    await expect(pageManager.newMail.BoardProperties.ExpandedSize, 'New Email board should be enlarged').toBeVisible();
  });

  test('TC217. Reduce New Email board. New Email board should be reduced', async ({pageManager}) => {
    await OpenNewEmailBoardAndExpandBoard({pageManager});
    await pageManager.newMail.Buttons.ReduceBoard.click();
    await expect(pageManager.newMail.BoardProperties.NormalSize, 'New Email board should be reduced').toBeVisible();
  });

  test('TC218. Disable rich text editor in New Email board. Editor toolbar should not be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.DisableRichTextEditor);
    await expect(pageManager.newMail.Elements.EditorToolbar, 'Editor toolbar should not be visible').not.toBeVisible();
  });

  test('TC219. Enable rich text editor in New Email board. Editor toolbar should be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.DisableRichTextEditor);
    await pageManager.newMail.SelectNewMailOption.EnableRichTextEditor();
    await expect(pageManager.newMail.Elements.EditorToolbar, 'Editor toolbar should be visible').toBeVisible();
  });

  test('TC220. Mark mail in New Email board as important. "Mark as important" icon should be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.MarkAsImportant);
    await expect(pageManager.newMail.Elements.MarkAsImportantIcon, '"Mark as important" icon should be visible').toBeVisible();
  });

  test('TC221. Mark mail in New Email board as not important. "Mark as important" icon should not be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.MarkAsImportant);
    await pageManager.newMail.SelectNewMailOption.MarkAsNotImportant();
    await expect(pageManager.newMail.Elements.MarkAsImportantIcon, '"Mark as important" icon should not be visible').not.toBeVisible();
  });

  test('TC222. Request read receipt in New Email board. "Request read receipt" icon should be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.RequestReadReceipt);
    await expect(pageManager.newMail.Elements.RequestReadReceiptIcon, '"Request read receipt" icon should be visible').toBeVisible();
  });

  test('TC223. Remove read receipt request in New Email board. "Request read receipt" icon should not be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.RequestReadReceipt);
    await pageManager.newMail.SelectNewMailOption.RemoveReadReceiptRequest();
    await expect(pageManager.newMail.Elements.RequestReadReceiptIcon, '"Request read receipt" icon should not be visible').not.toBeVisible();
  });

  test('TC224. Open recieved mail with read receipt request. "Read receipt required" modal title should be visible', async ({pageManager}) => {
    await SendAndOpenMailWithSelectedOption({pageManager}, pageManager.newMail.SelectNewMailOption.RequestReadReceipt);
    await expect(pageManager.readReceiptRequiredModal.Elements.Title, '"Read receipt required" modal title should be visible').toBeVisible();
  });

  test("TC225. Notify sender when mail with read receipt request has been read. Read receipt should be visible in sender's Inbox list", async ({pageManager}) => {
    BaseTest.doubleTimeout();
    test.fail(true, 'Read receipt subject is visible only after page reload');
    await SendAndOpenMailWithSelectedOption({pageManager}, pageManager.newMail.SelectNewMailOption.RequestReadReceipt);
    await pageManager.readReceiptRequiredModal.Buttons.Notify.click();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"Read-Receipt: ${mailSubject}"`), "Read receipt should be visible in sender's Inbox list").toBeVisible();
  });

  test("TC226. Select Edit option in draft. Recipient's login, drafted mail body and subject should be visible", async ({pageManager, apiManager}) => {
    const mailBody = await OpenMailAndSelectOption({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Edit, pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts);
    await expect(pageManager.newMail.Elements.ContactBubble.locator(`"${BaseTest.userForLogin.login.replace('@' + BaseTest.domain, '')}"`), "Recipient's login should be visible").toBeVisible();
    await expect(pageManager.newMail.TextBox.Subject, 'Drafted mail subject should be visible').toHaveValue(`${mailSubject}`);
    await expect(pageManager.newMail.TextBox.Body, 'Drafted mail body should be visible').toContainText(mailBody);
  });

  test("TC227. Select Reply option in mail. Sender's login, keyword “RE”, received mail body should be visible", async ({pageManager, apiManager}) => {
    const mailBody = await OpenMailAndSelectOption({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply);
    await expect(pageManager.newMail.Elements.ContactBubble.locator(`"${BaseTest.userForLogin.login.replace('@' + BaseTest.domain, '')}"`), "Sender's login should be visible").toBeVisible();
    await expect(pageManager.newMail.TextBox.Subject, 'The mail subject should start with the keyword “RE”').toHaveValue(`RE: ${mailSubject}`);
    await expect(pageManager.newMail.TextBox.Body, 'Received mail body should be visible').toContainText(mailBody);
  });

  test("TC228. Select Forward option in mail. Keyword “FWD”, received mail body should be visible", async ({pageManager, apiManager}) => {
    const mailBody = await OpenMailAndSelectOption({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward);
    await expect(pageManager.newMail.TextBox.Subject, 'The mail subject should start with the keyword “FWD”').toHaveValue(`FWD: ${mailSubject}`);
    await expect(pageManager.newMail.TextBox.Body, 'Received e-mail body should be visible').toContainText(mailBody);
  });

  test('TC229. Open New Email board twice. Tab count should be 2', async ({pageManager}) => {
    await OpenNewEmailBoardTwice({pageManager});
    await expect(pageManager.newMail.Elements.BoardTab, 'Tab count should be 2').toHaveCount(2);
  });

  test('TC230. Close first of the two New Email boards. Tab count should be 1', async ({pageManager}) => {
    await OpenNewEmailBoardTwice({pageManager});
    await pageManager.newMail.Buttons.CloseTab.first().click();
    await expect(pageManager.newMail.Elements.BoardTab, 'Tab count should be 1').toHaveCount(1);
  });

  test('TC231. Open sent mail. Correct subject should be visible', async ({apiManager, pageManager}) => {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.Header.locator(`"${mailSubject}"`), 'Correct email subject is visible').toBeVisible();
  });

  test('TC232. Open sent mail. Correct body should be visible', async ({apiManager, pageManager}) => {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.Body, 'Correct body should be visible').toHaveText(mailBody);
  });

  test('TC233. Open received mail. Correct subject should be visible. @criticalPath', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await SendMailViaApiAndOpenMail({apiManager, pageManager});
    await expect(pageManager.mailDetails.Elements.Header.locator(`"${mailSubject}"`), 'Correct email subject is visible').toBeVisible();
  });

  test('TC234. Open received mail. Correct body should be visible. @criticalPath', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await SendMailViaApiAndOpenMail({apiManager, pageManager});
    await expect(pageManager.mailDetails.Elements.Body, 'Correct body should be visible').toHaveText(mailBody);
  });

  test('TC235. Send mail to multiple recipients. All recipient logins should be visible in the mail details', async ({apiManager, pageManager}) => {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent, [BaseTest.secondUser.login, BaseTest.thirdUser.login]);
    await expect(pageManager.mailDetails.Elements.Recipient.locator(`"${BaseTest.secondUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'First recipient login should be visible').toBeVisible();
    await expect(pageManager.mailDetails.Elements.Recipient.locator(`"${BaseTest.thirdUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'Second recipient login should be visible').toBeVisible();
  });

  test('TC236. Get mail sent to multiple recipients. All recipient logins should be visible in the mail details', async ({apiManager, pageManager}) => {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent, [BaseTest.secondUser.login, BaseTest.thirdUser.login]);
    await expect(pageManager.mailDetails.Elements.Recipient.locator(`"${BaseTest.secondUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'First recipient login should be visible').toBeVisible();
    await expect(pageManager.mailDetails.Elements.Recipient.locator(`"${BaseTest.thirdUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'Second recipient login should be visible').toBeVisible();
  });

  test('TC237. Reply to mail. Reply mail subject should be visible in the Sent folder', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenFolder({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"RE: ${mailSubject}"`), 'Reply mail should be visible in the Sent folder').toBeVisible();
  });
  // Sometimes new mail subject is visible in Inbox only after page reload
  test.skip('TC238. Get a reply mail. Reply mail subject should be visible in the Inbox folder', async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenFolder({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Reply);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"RE: ${mailSubject}"`), 'Reply mail should be visible in the Inbox folder').toBeVisible();
  });

  test('TC241. Select CC option in New Email board. CC textbox should be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.Cc);
    await expect(pageManager.newMail.TextBox.Cc, 'CC textbox should be visible').toBeVisible();
  });

  test('TC242. Select BCC option in New Email board. BCC textbox should be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.Bcc);
    await expect(pageManager.newMail.TextBox.Bcc, 'BCC textbox should be visible').toBeVisible();
  });

  test('TC243. Deselect CC option in New Email board. CC textbox should not be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.Cc);
    await pageManager.newMail.SelectNewMailOption.Cc();
    await expect(pageManager.newMail.TextBox.Cc, 'CC textbox should not be visible').not.toBeVisible();
  });

  test('TC244. Deselect BCC option in New Email board. BCC textbox should not be visible', async ({pageManager}) => {
    await OpenNewEmailBoardAndSelectOption({pageManager}, pageManager.newMail.SelectNewMailOption.Bcc);
    await pageManager.newMail.SelectNewMailOption.Bcc();
    await expect(pageManager.newMail.TextBox.Bcc, 'BCC textbox should not be visible').not.toBeVisible();
  });

  test('TC245. Send an mail to a CC recipient. CC recipient login should be visible in mail details.', async ({pageManager}) => {
    BaseTest.doubleTimeout();
    await SendAndOpenMailWithSelectedOption({pageManager}, pageManager.newMail.SelectNewMailOption.Cc, pageManager.newMail.TextBox.Cc, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.CcRecipient.locator(`"${BaseTest.secondUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'CC recipient login should be visible in mail details').toBeVisible();
  });

  test('TC246. Send an mail to a BCC recipient. BCC recipient login should be visible in mail details', async ({pageManager}) => {
    BaseTest.doubleTimeout();
    await SendAndOpenMailWithSelectedOption({pageManager}, pageManager.newMail.SelectNewMailOption.Bcc, pageManager.newMail.TextBox.Bcc, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.BccRecipient.locator(`"${BaseTest.secondUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'BCC recipient login should be visible in mail details').toBeVisible();
  });

  test('TC247. Receive the mail as a CC recipient. Mail should be visible in Inbox list. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.secondUser.login], [BaseTest.userForLogin.login]);
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should be visible in Inbox list').toBeVisible();
  });

  test('TC248. Receive the mail as a BCC recipient. Mail should be visible in Inbox list. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.secondUser.login], [], [BaseTest.userForLogin.login]);
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should be visible in Inbox list').toBeVisible();
  });

  test('TC249. Receive the mail with CC as main recipient. CC recipient login should be visible in mail details', async ({pageManager, apiManager}) => {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox, [BaseTest.userForLogin.login], [BaseTest.secondUser.login]);
    await expect(pageManager.mailDetails.Elements.CcRecipient.locator(`"${BaseTest.secondUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'CC recipient login should be visible in mail details').toBeVisible();
  });

  test('TC250. Receive the mail with BCC as main recipient. BCC recipient login should not be visible in mail details', async ({pageManager, apiManager}) => {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox, [BaseTest.userForLogin.login], [], [BaseTest.secondUser.login]);
    await expect(pageManager.mailDetails.Elements.BccRecipient.locator(`"${BaseTest.secondUser.login.replace('@' + BaseTest.domain, '').replace(/^\w/, (first) => first.toUpperCase())}"`), 'BCC recipient login should not be visible in mail details').not.toBeVisible();
  });

  test('TC251. Reply mail. Reply mail should be visible in the Sent folder', async ({pageManager, apiManager}) => {
    await SendReceivedMailBySelectedMsgTypeViaApiAndOpenFolder({apiManager, pageManager}, apiManager.createMailsAPI.MsgType.Reply, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailsList.MailConversationElements.UnreadMessageIcon(mailSubject).locator(`"${msgCount}"`), 'Reply mail should be visible in the Sent folder').toBeVisible();
  });

  test('TC252. Get a reply mail. Reply mail should be visible in the Inbox folder. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    await SendReceivedMailBySelectedMsgTypeViaApiAndOpenFolder({apiManager, pageManager}, apiManager.createMailsAPI.MsgType.Reply);
    await expect(pageManager.mailsList.MailConversationElements.UnreadMessageIcon(mailSubject).locator(`"${msgCount}"`), 'Reply mail should be visible in the Inbox folder').toBeVisible();
  });

  test("TC253. Forward mail. Forwarded mail should be visible in the Sent folder", async ({pageManager, apiManager}) => {
    await SendReceivedMailBySelectedMsgTypeViaApiAndOpenFolder({apiManager, pageManager}, apiManager.createMailsAPI.MsgType.Forward, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailsList.MailConversationElements.UnreadMessageIcon(mailSubject).locator(`"${msgCount}"`), 'Forwarded mail should be visible in the Sent folder').toBeVisible();
  });

  test('TC254. Get a forwarded mail. Forwarded mail should be visible in the Inbox folder. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    await SendReceivedMailBySelectedMsgTypeViaApiAndOpenFolder({apiManager, pageManager}, apiManager.createMailsAPI.MsgType.Forward);
    await expect(pageManager.mailsList.MailConversationElements.UnreadMessageIcon(mailSubject).locator(`"${msgCount}"`), 'Forwarded mail should be visible in the Inbox folder').toBeVisible();
  });

  test("TC255. Forward mail. Forwarded mail subject should be visible in the Sent folder", async ({apiManager, pageManager}) => {
    BaseTest.doubleTimeout();
    await SendReceivedMailBySelectedOptionAndOpenFolder({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"FWD: ${mailSubject}"`), 'Forwarded mail subject should be visible in the Sent folder').toBeVisible();
  });
  // Sometimes new mail subject is visible in Inbox only after page reload
  test.skip("TC256. Get a forwarded mail. Forwarded mail subject should be visible in the Inbox folder", async ({apiManager, pageManager}) => {
    await SendReceivedMailBySelectedOptionAndOpenFolder({apiManager, pageManager}, pageManager.mailDetails.SelectMailOption.Forward);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"FWD: ${mailSubject}"`), 'Forwarded mail subject should be visible in the Inbox folder').toBeVisible();
  });

  test("TC261. Click UNDO Button while you sending mail. Mail should be canceled and create page should return", async ({pageManager, page}) => {
    await ClickNewItemCreateMailAndSendMail({pageManager, page});
    await pageManager.mailDetails.Elements.UndoButton.click();
    await expect(pageManager.newMail.TextBox.Subject, 'Mail should be canceled and create page should return').toHaveValue(mailSubject);
  });

  test("TC262. Click UNDO Button while deleting mail in inbox tab. Mail should return in folder", async ({pageManager, apiManager}) => {
    test.fail(true, 'Issue #57');
    await SendMailViaApiAndOpenMail({pageManager, apiManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox);
    await DeleteMailAndClickUndo({pageManager});
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should return in folder').toBeVisible();
  });

  test("TC263. Click UNDO Button while deleting mail in Sent tab. Mail should return in folder", async ({pageManager, apiManager}) => {
    test.fail(true, 'Issue #57');
    await SendMailViaApiAndOpenMail({pageManager, apiManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await DeleteMailAndClickUndo({pageManager});
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should return in folder').toBeVisible();
  });

  test("TC264. Click UNDO Button while deleting mail in drafts tab. Mail should return in folder", async ({apiManager, pageManager}) => {
    test.fail(true, 'Issue #57');
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts);
    await pageManager.mailsList.OpenMail(mailSubject);
    await DeleteMailAndClickUndo({pageManager});
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), 'Mail should return in folder').toBeVisible();
  });

  test("TC265. Click UNDO Button while deleting mail in junk tab. Mail should return in folder", async ({pageManager, apiManager}) => {
    await SendOpenMailMarkAsSpamAndMoveToJunk({pageManager, apiManager});
    await pageManager.mailsList.OpenMail(mailSubject);
    await DeleteMailAndClickUndo({pageManager});
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).first(), 'Mail should return in folder').toBeVisible();
  });

  test('TC278. Check button "Expand" in mails list folder', async ({pageManager, apiManager}) => {
    await SendMailViaApiOpenInboxAndExpand({pageManager, apiManager});
    await expect(pageManager.mailsList.MailConversationElements.ListOfExpandedMessages, 'Mails should be visible under the expand button').toBeVisible();
  });

  test('TC279. Check icon “Sent“ in expanded mail-list folder', async ({pageManager, apiManager}) => {
    await SendMailViaApiOpenInboxAndExpand({pageManager, apiManager});
    await expect(pageManager.mailsList.MailConversationElements.SentIcon, 'Icon “Sent“ should be visible next to the message').toBeVisible();
  });

  test('TC280. Check icon “Draft“ in expanded mail-list folder', async ({pageManager, apiManager}) => {
    const origMsgId = await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await apiManager.createMailsAPI.SaveDraftRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login], [], [], origMsgId, apiManager.createMailsAPI.MsgType.Reply);
    await OpenInboxAndExpand({pageManager});
    await expect(pageManager.mailsList.MailConversationElements.DraftIcon, 'Icon “Draft“ should be visible next to the message').toBeVisible();
  });

  test("TC282. Click UNDO Button while moving to spam mail in inbox tab. Mail should return in folder", async ({pageManager, apiManager}) => {
    await SendMailAndMarkAsSpam({apiManager, pageManager});
    await pageManager.mailDetails.Elements.UndoButton.click();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).first(), 'Mail should return in folder').toBeVisible();
  });

  test("TC283. Click UNDO Button while moving to spam mail in sent tab. Mail should return in folder", async ({pageManager, apiManager}) => {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await pageManager.mailDetails.SelectMailOption.MarkAsSpam();
    await pageManager.mailDetails.Elements.UndoButton.click();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).first(), 'Mail should return in folder').toBeVisible();
  });

  test("TC284. Click UNDO Button while moving to spam mail in trash tab. Mail should return in folder", async ({pageManager, apiManager}) => {
    await SendMailDeleteAndMoveToTrash({apiManager, pageManager});
    await pageManager.mailsList.SelectMailContextMenuOption.MarkAsSpam(mailSubject);
    await pageManager.mailDetails.Elements.UndoButton.click();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).first(), 'Mail should return in folder').toBeVisible();
  });

  test("TC285. Click UNDO Button while clicking not a spam button in junk tab. Mail should present in folder", async ({pageManager, apiManager, page}) => {
    await SendOpenMailMarkAsSpamAndMoveToJunk({pageManager, apiManager});
    await pageManager.mailsList.OpenMail(mailSubject);
    await pageManager.mailDetails.MailOptions.NotSpam.click();
    await pageManager.mailDetails.Elements.UndoButton.click();
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).first(), 'Mail should return in folder').toBeVisible();
  });

  async function SendMailAndOpenFolder({pageManager, page}, openFolder, button?) {
    await ClickNewItemCreateMailAndSendMail({pageManager, page}, button);
    await pageManager.baseApplicationPage.WaitForNotificationHiding();
    await openFolder();
  };

  async function ClickNewItemCreateMailAndSendMail({pageManager, page}, button = pageManager.newMail.Buttons.Send) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await page.waitForLoadState('networkidle');
    await pageManager.newMail.CreateNewMail(BaseTest.userForLogin.login, mailSubject, mailBody);
    await pageManager.newMail.WaitForDraftSavedNotificationHiding();
    await button.click();
    if (button === pageManager.newMail.Buttons.Save) {
      await pageManager.newMail.Buttons.CloseCross.click();
      if (await pageManager.beforeYouLeaveModal.Containers.MainContainer.isVisible()) { // if block: workaround for Issue #28
        await pageManager.beforeYouLeaveModal.Buttons.SaveDraft.click();
      };
    };
  };

  async function SendMailViaApiAndOpenMail({apiManager, pageManager}, folder?, toArray = [BaseTest.userForLogin.login], ccArray?, bccArray?, origId?, msgType?) {
    if (folder !== pageManager.sideSecondaryMailMenu.OpenMailFolder.Drafts) {
      await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, toArray, ccArray, bccArray, origId, msgType);
    } else {
      await apiManager.createMailsAPI.SaveDraftRequest(mailSubject, mailBody, BaseTest.userForLogin.login, toArray, ccArray, bccArray, origId, msgType);
    };
    await OpenMailFolderAndOpenMail({pageManager}, mailSubject, folder);
  };

  async function OpenSpecificMailInConversation({pageManager}, mailSubject, folder = pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox) {
    await pageManager.mailsList.MailConversationElements.Buttons.ChevronDown(mailSubject).click();
    if (folder === pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox) {
      await pageManager.mailsList.MailConversationElements.UnreadMail.first().click();
    } else {
      await pageManager.mailsList.MailConversationElements.SentMail.first().click();
    };
  };

  async function OpenMailFolderAndOpenMail({pageManager}, mailSubject, openFolder = pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox) {
    await openFolder();
    await pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).waitFor();
    if (await pageManager.mailsList.MailConversationElements.Buttons.ChevronDown(mailSubject).isVisible()) {
      await OpenSpecificMailInConversation({pageManager}, mailSubject, openFolder);
    } else {
      await pageManager.mailsList.OpenMail(mailSubject);
    };
  };

  async function OpenNewEmailBoardAndHideBoard({pageManager}) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await pageManager.sideMenu.Buttons.HideBoard.click();
  };

  async function OpenNewEmailBoardAndExpandBoard({pageManager}) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await pageManager.newMail.Buttons.ExpandBoard.click();
  };

  async function OpenNewEmailBoardAndSelectOption({pageManager}, option) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await option();
  };

  async function SendMailWithSelectedOption({pageManager}, option, textbox?) {
    await OpenNewEmailBoardAndSelectOption({pageManager}, option);
    await pageManager.newMail.CreateNewMail(BaseTest.userForLogin.login, mailSubject, mailBody);
    if (textbox) {
      await textbox.fill(BaseTest.secondUser.login);
    };
    await pageManager.newMail.Buttons.Send.click();
    await pageManager.baseApplicationPage.WaitForNotificationHiding();
  };

  async function SendAndOpenMailWithSelectedOption({pageManager}, option, textbox?, folder?) {
    await SendMailWithSelectedOption({pageManager}, option, textbox);
    await OpenMailFolderAndOpenMail({pageManager}, mailSubject, folder);
  };

  async function OpenMailAndSelectOption({apiManager, pageManager}, option, folder?) {
    await SendMailViaApiAndOpenMail({apiManager, pageManager}, folder);
    const mailBody = await pageManager.mailDetails.Elements.Body.innerText();
    await option();
    return mailBody;
  };

  async function OpenNewEmailBoardTwice({pageManager}) {
    await pageManager.headerMenu.Buttons.NewItem.click();
    await pageManager.headerMenu.Buttons.NewItem.click();
  };

  async function SendReceivedMailBySelectedOptionAndOpenFolder({apiManager, pageManager}, option, openFolder = pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox) {
    await OpenMailAndSelectOption({apiManager, pageManager}, option);
    if (option === pageManager.mailDetails.SelectMailOption.Forward) {
      await pageManager.newMail.ClickOnToTexbox();
      await pageManager.newMail.TextBox.To.fill(BaseTest.userForLogin.login);
    };
    await pageManager.newMail.TextBox.Body.click();
    const mailQuote = (await pageManager.newMail.TextBox.Body.innerText()).trimStart();
    await pageManager.newMail.Buttons.Send.click();
    await pageManager.baseApplicationPage.WaitForNotificationHiding();
    await openFolder();
    return mailQuote;
  };

  async function SendReceivedMailBySelectedMsgTypeViaApiAndOpenFolder({apiManager, pageManager}, msgType, openFolder = pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox) {
    const origMsgId = await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login], [], [], origMsgId, msgType);
    openFolder();
  };

  async function DeleteMailAndClickUndo({pageManager}) {
    await pageManager.mailDetails.SelectMailOption.Delete();
    await pageManager.mailDetails.Elements.UndoButton.click();
  };

  async function SendOpenMailMarkAsSpamAndMoveToJunk({pageManager, apiManager}) {
    await SendMailViaApiAndOpenMail({apiManager, pageManager});
    await pageManager.mailDetails.SelectMailOption.MarkAsSpam();
    await pageManager.baseApplicationPage.WaitForNotificationHiding();
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Junk();
  };

  async function SendMailAndMarkAsSpam({apiManager, pageManager}) {
    await SendMailViaApiAndOpenMail({apiManager, pageManager});
    await pageManager.mailDetails.SelectMailOption.MarkAsSpam();
  };

  async function SendMailDeleteAndMoveToTrash({apiManager, pageManager}) {
    await SendMailViaApiAndOpenMail({pageManager, apiManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox);
    await pageManager.mailDetails.SelectMailOption.Delete();
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Trash();
  };

  async function SendMailViaApiOpenInboxAndExpand({pageManager, apiManager}) {
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await OpenInboxAndExpand({pageManager});
  };

  async function OpenInboxAndExpand({pageManager}) {
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox();
    await pageManager.mailsList.MailConversationElements.Buttons.ChevronDown(mailSubject).click();
  };
});
