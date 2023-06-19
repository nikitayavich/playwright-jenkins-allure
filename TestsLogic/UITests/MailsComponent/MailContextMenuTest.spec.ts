import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Mails context menu options tests', async () => {
  let mailSubject;
  let mailBody;

  test.beforeEach(async ({apiManager, pageManager}) => {
    BaseTest.setFeatureSuite.mails();
    mailSubject = BaseTest.dateTimePrefix() + ' Autotest Mail Subject';
    mailBody = BaseTest.dateTimePrefix() + ' Autotest Mail Body';
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login]);
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox();
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
    await page.close();
  });


  test('TC207. Mark mail as unread. Unread message icon should be visible', async ({pageManager}) => {
    await pageManager.mailsList.OpenMail(mailSubject);
    await pageManager.mailsList.SelectMailContextMenuOption.MarkAsUnread(mailSubject);
    await expect(pageManager.mailsList.MailConversationElements.UnreadMessageIcon(mailSubject), 'Unread message icon should be visible').toBeVisible();
  });

  test('TC208. Mark mails as read. Unread message icon should not be visible', async ({pageManager}) => {
    await pageManager.mailsList.SelectMailContextMenuOption.MarkAsRead(mailSubject);
    await expect(pageManager.mailsList.MailConversationElements.UnreadMessageIcon(mailSubject), 'Unread message icon should not be visible').not.toBeVisible();
  });

  test('TC209. Flag mail. Added flag should be visible', async ({pageManager}) => {
    await pageManager.mailsList.SelectMailContextMenuOption.AddFlag(mailSubject);
    await pageManager.mailsList.OpenMail(mailSubject);
    await expect(pageManager.mailDetails.Elements.FlagIcon.first(), 'Added flag should be visible').toBeVisible();
  });

  test('TC210. Mark mail as spam. Mark as spam notification should be visible', async ({pageManager}) => {
    await pageManager.mailsList.SelectMailContextMenuOption.MarkAsSpam(mailSubject);
    await expect(pageManager.mailDetails.Elements.ActionWithMailNotification, 'Mark as spam notification should be visible').toContainText('Spam');
  });

  test('TC211. Print mail. Mail subject should be in header of printed document', async ({page, pageManager}) => {
    const mailTitle = await getContentFromNewPage({page}, pageManager.mailsList.SelectMailContextMenuOption.Print, 'b >> nth=-1');
    expect(await mailTitle, 'Mail subject should be in header of printed document').toBe(mailSubject);
  });
  // Issue #58
  test.skip('TC212. Show original mail. Original document should contain mail body text', async ({page, pageManager}) => {
    const mailContent = await getContentFromNewPage({page}, pageManager.mailsList.SelectMailContextMenuOption.ShowOriginal, 'pre');
    expect(await mailContent, 'Original document should contain mail body text').toContain(mailBody);
  });

  async function getContentFromNewPage({page}, option, locator) {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      option(mailSubject),
    ]);
    await newPage.waitForLoadState();
    const content = await newPage.innerText(locator);
    return content;
  };
});
