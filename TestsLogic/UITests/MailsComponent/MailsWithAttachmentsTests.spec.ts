import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Mails with attachments tests', async () => {
  let mailSubject;
  let mailBody;
  let fileName;

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.mails();
    mailSubject = BaseTest.dateTimePrefix() + ' Autotest Mail Subject';
    mailBody = BaseTest.dateTimePrefix() + ' Autotest Mail Body';
    fileName = BaseTest.dateTimePrefix() + ' Autotest File';
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Mail);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.mailsAPI.DeleteMailsViaAPI(BaseTest.userForLogin.login);
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
    await page.close();
  });
  // Most often, the attachment is not visible until the filling of the textbox starts
  test.skip('TC259. Attach the file in New Email board. Attached file should be visible', async ({apiManager, pageManager, page}) => {
    await UploadFile({apiManager});
    await pageManager.headerMenu.Buttons.NewItem.click();
    await pageManager.newMail.SelectNewMailOption.AddFromFiles();
    await pageManager.fileChooserModal.Folders.Home.dblclick();
    await pageManager.fileChooserModal.Elements.File.locator(`"${fileName}"`).click();
    await page.waitForLoadState('networkidle');
    await pageManager.fileChooserModal.Buttons.Select.click();
    await expect(pageManager.newMail.Elements.AttachmentFile, 'Attached file should be visible').toContainText(fileName);
  });

  test('TC260. Open the sent mail with attached file. Attached file should be visible in mail details.', async ({apiManager, pageManager}) => {
    await SendAndOpenMailWithAttachedFile({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent);
    await expect(pageManager.mailDetails.Elements.AttachmentFile, 'Attached file should be visible in mail details').toContainText(fileName);
  });

  test('TC261. Open the received mail with attached file. Attached file should be visible in mail details. @criticalPath', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await SendAndOpenMailWithAttachedFile({apiManager, pageManager}, pageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox);
    await expect(pageManager.mailDetails.Elements.AttachmentFile, 'Attached file should be visible in mail details').toContainText(fileName);
  });

  async function UploadFile({apiManager}) {
    const nodeId = await apiManager.createFilesAPI.CreateDocumentForUpload(fileName);
    return await apiManager.filesAPI.UploadTo(nodeId);
  };

  async function SendAndOpenMailWithAttachedFile({apiManager, pageManager}, openFolder) {
    const uploadId = await UploadFile({apiManager});
    const draftId = await apiManager.createMailsAPI.SaveDraftRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login], [], [], [], [], uploadId);
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login], [], [], [], [], draftId);
    await openFolder();
    await pageManager.mailsList.OpenMail(mailSubject);
  };
});
