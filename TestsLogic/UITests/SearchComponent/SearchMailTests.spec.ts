import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Search tests', async () => {
  let uniquePrefix;
  let mailSubject;
  let mailBody;
  let mailSize;
  let appointmentTitle;
  let appointmentBody;
  let secondMailSubject;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.search();
    uniquePrefix = BaseTest.dateTimePrefix();
    mailSubject = uniquePrefix + ' Autotest Mail Subject';
    mailBody = uniquePrefix + ' Autotest Mail Body';
    mailSize = '1';
    appointmentTitle = uniquePrefix + ' Autotest Appointment Title';
    appointmentBody = uniquePrefix + ' Autotest Appointment Body';
    secondMailSubject = uniquePrefix + ' Autotest Appointment  Second Title';
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
    await page.close();
  });

  async function OpenSearchTabAndOpenAdvancedFilters({pageManager}) {
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Search);
    await pageManager.searchResultsList.Buttons.AdvancedFilters.click();
  };

  async function CreateMessageAndOpenFiltersInSearch({pageManager, apiManager}) {
    await CreateMessageAndOpenInbox({pageManager, apiManager});
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
  };

  async function CreateMessageAndOpenInbox({pageManager, apiManager}) {
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Mail);
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox();
  };

  async function CreateMailFlaggedMailAndOpenAdvancedOptionsInSearch({pageManager, apiManager}) {
    await CreateMessageAndOpenInbox({pageManager, apiManager});
    await pageManager.mailsList.SelectMailContextMenuOption.AddFlag(mailSubject);
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
  };

  async function SendMailBySelectedMethodAndOpenFiltersInSearch({pageManager, apiManager}, msgType) {
    const origMsgId = await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login], [], [], origMsgId, msgType);
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
  };

  test('TC701. Search sent email. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    await CreateMessageAndOpenInbox({pageManager, apiManager});
    await pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).waitFor();
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Search);
    await pageManager.headerMenu.MakeSearch(uniquePrefix);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`)).toBeVisible();
    await expect(pageManager.searchStatisticsHeader.Elements.SearchSnippet.locator(`"${uniquePrefix}"`)).toBeVisible();
  });

  test('TC706. Search by “Unread” option found mail. The sent email should be found by unread', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.AdvancedFiltersOptions.EnableUnread();
    await pageManager.advancedFiltersModal.Buttons.Search.click();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC707. Search by “Flagged” option found mail. The sent email should be found by flagged', async ({apiManager, pageManager}) => {
    await CreateMailFlaggedMailAndOpenAdvancedOptionsInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.AdvancedFiltersOptions.EnableFlagged();
    await pageManager.advancedFiltersModal.Buttons.Search.click();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC708. Search by “Keywords” option found mail. The sent email should be found by Keywords', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.FillAdvancedFiltersFields.KeywordsField(mailBody);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC709. Search by “Subject” option found mail. The sent email should be found by Subject', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.FillAdvancedFiltersFields.SubjectField(mailBody);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC710. Search by "Received From" option found mail. The sent email should be found by "Received From"', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.FillAdvancedFiltersFields.FromField(BaseTest.userForLogin.login);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC711. Search by “Sent To” option found mail. The sent email should be found by "Sent To"', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.FillAdvancedFiltersFields.ToField(BaseTest.userForLogin.login);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC712. Search by “Size smaller then” option found mail. The sent email should be found by "Size smaller then"', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.FillAdvancedFiltersFields. SizeSmallerThanField(mailSize);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC704. Search by "unread" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.StatusMailItems.UnreadOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC714. Search by "read" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenInbox({pageManager, apiManager});
    await pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`).click();
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
    await pageManager.advancedFiltersModal.StatusMailItems.ReadOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC715. Search by "flagged" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await CreateMailFlaggedMailAndOpenAdvancedOptionsInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.StatusMailItems.FlaggedOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC716. Search by "not flagged" in Search status found mail. Flagged email should not be found in Search Tab', async ({apiManager, pageManager}) => {
    await CreateMailFlaggedMailAndOpenAdvancedOptionsInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.StatusMailItems.NotFlaggedOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).not.toBeVisible();
  });

  test('TC717. Search by "sent by me" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.StatusMailItems.SentByMeOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC718. Search by "answered by me" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await SendMailBySelectedMethodAndOpenFiltersInSearch({pageManager, apiManager}, apiManager.createMailsAPI.MsgType.Reply);
    await pageManager.advancedFiltersModal.StatusMailItems.AnsweredByMeOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC719. Search by "not answered by me" in Search status found mail. The email should not be found in Search Tab', async ({apiManager, pageManager}) => {
    test.fail(true, 'Issue #55');
    await SendMailBySelectedMethodAndOpenFiltersInSearch({pageManager, apiManager}, apiManager.createMailsAPI.MsgType.Reply);
    await pageManager.advancedFiltersModal.StatusMailItems.NotAnsweredByMeOption();
    await pageManager.searchResultsList.Elements.PromptText.waitFor();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`)).not.toBeVisible();
  });

  test('TC720. Search by "forwarded" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await SendMailBySelectedMethodAndOpenFiltersInSearch({pageManager, apiManager}, apiManager.createMailsAPI.MsgType.Forward);
    await pageManager.advancedFiltersModal.StatusMailItems.ForwardedOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC721. Search by "not forwarded" in Search status found mail. The email should not be found in Search Tab', async ({apiManager, pageManager}) => {
    test.fail(true, 'Issue #56');
    await SendMailBySelectedMethodAndOpenFiltersInSearch({pageManager, apiManager}, apiManager.createMailsAPI.MsgType.Forward);
    await pageManager.advancedFiltersModal.StatusMailItems.NotForwardedOption();
    await pageManager.searchResultsList.Elements.PromptText.waitFor();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`)).not.toBeVisible();
  });

  test('TC722. Search by "ivitations" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, BaseTest.secondUser.login, appointmentBody);
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
    await pageManager.advancedFiltersModal.StatusMailItems.InvitationsOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${appointmentTitle}"`).first()).toBeVisible();
  });

  test('TC723. Search by "conversations with a single message" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, BaseTest.secondUser.login, appointmentBody);
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await apiManager.createMailsAPI.SendMsgRequest(secondMailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.secondUser.login]);
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
    await pageManager.advancedFiltersModal.StatusMailItems.ConversationsWithASingleMessageOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${secondMailSubject}"`).first()).toBeVisible();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).not.toBeVisible();
  });

  test('TC724. Search by "From Me" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.StatusMailItems.FromMeOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });

  test('TC725. Search by "To Me" in Search status found mail. The email should be found in Search Tab', async ({apiManager, pageManager}) => {
    await CreateMessageAndOpenFiltersInSearch({pageManager, apiManager});
    await pageManager.advancedFiltersModal.StatusMailItems.ToMeOption();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${mailSubject}"`).first()).toBeVisible();
  });
});
