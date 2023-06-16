import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Folders tests', async () => {
  let folderName;
  let mailSubject;
  let mailBody;
  let folderId;
  let newFolderName;
  let folderNameViaAPI;

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.folders();
    folderName = BaseTest.dateTimePrefix() + ' New Folder';
    folderNameViaAPI = BaseTest.dateTimePrefix() + ' Folder';
    newFolderName = BaseTest.dateTimePrefix() + ' new Folder',
    mailSubject = BaseTest.dateTimePrefix() + ' Autotest Mail Subject';
    mailBody = BaseTest.dateTimePrefix() + ' Autotest Mail Body';
    await apiManager.foldersAPI.DeleteFoldersViaAPI(apiManager, BaseTest.userForLogin.login);
    await apiManager.createFoldersAPI.CreateFolder(folderNameViaAPI, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Mail);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.foldersAPI.DeleteFoldersViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  async function OpenSentSubFolderContextMenu({pageManager}) {
    await pageManager.sideSecondaryMailMenu.ExpandMailFolders.Sent();
    await pageManager.sideSecondaryMailMenu.OpenFolderContextMenu(pageManager.sideSecondaryMailMenu.MailFolders.SubFolder.locator(`"${folderNameViaAPI}"`));
  };

  async function ChooseNewFolderOptionAndCreateNewFoler({pageManager}) {
    await pageManager.sideSecondaryMailMenu.SelectMailFolderOption.NewFolder();
    await pageManager.sideSecondaryMailMenu.CreateNewFolder(folderName);
  };

  test('TC801. Create new folder. @criticalPath', async ({pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await pageManager.sideSecondaryMailMenu.ExpandFolders();
    await pageManager.sideSecondaryMailMenu.OpenFolderContextMenu(pageManager.sideSecondaryMailMenu.MailFolders.Sent);
    await ChooseNewFolderOptionAndCreateNewFoler({pageManager});
    await pageManager.sideSecondaryMailMenu.ExpandMailFolders.Sent();
    await expect(pageManager.sideSecondaryMailMenu.Containers.MainContainer.locator(`"${folderName}"`), "Created folder should be visible").toBeVisible();
  });

  test('TC802. Move mail to a new folder', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.secondUser.login]);
    await pageManager.sideSecondaryMailMenu.OpenMailFolder.Sent();
    await pageManager.mailsList.OpenMail(mailSubject);
    await pageManager.mailDetails.SelectMailOption.Move();
    await pageManager.moveMailToFolderModal.MoveMailToFolder(folderNameViaAPI);
    await pageManager.sideSecondaryMailMenu.ExpandMailFolders.Sent();
    await pageManager.sideSecondaryMailMenu.OpenSubFolder(folderNameViaAPI);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"${mailSubject}"`), "The mail placed in created folder should be visible").toBeVisible();
  });

  test('TC803. Share a new folder', async ({page, pageManager}) => {
    await OpenSentSubFolderContextMenu({pageManager});
    await pageManager.sideSecondaryMailMenu.SelectMailFolderOption.ShareFolder();
    await pageManager.shareFolderModal.Share(BaseTest.secondUser.login);
    await expect(pageManager.mailDetails.Elements.ActionWithMailNotification.locator('"Folder shared"'), '"Folder shared" action notification appears in right bottom corner').toBeVisible();
    await page.reload();
    await expect(pageManager.sideSecondaryMailMenu.Icons.SharedIcon, 'Share icon should be near folder name').toBeVisible();
  });

  test('TC804. Edit a new folder', async ({pageManager}) => {
    await OpenSentSubFolderContextMenu({pageManager});
    await pageManager.sideSecondaryMailMenu.SelectMailFolderOption.Edit();
    await pageManager.editFolderModal.EditFolder(newFolderName);
    await expect(pageManager.sideSecondaryMailMenu.Containers.MainContainer.locator(`"${newFolderName}"`), "New folder name should be visible").toBeVisible();
  });

  test('TC805. Move a new folder to another folder', async ({page, pageManager}) => {
    BaseTest.doubleTimeout();
    await OpenSentSubFolderContextMenu({pageManager});
    await pageManager.sideSecondaryMailMenu.SelectMailFolderOption.Move();
    await pageManager.moveFolderModal.MoveNewFolderToInbox();
    await pageManager.sideSecondaryMailMenu.ExpandMailFolders.Inbox();
    await expect(pageManager.sideSecondaryMailMenu.Containers.MainContainer.locator(`"${folderNameViaAPI}"`).first(), "Moved folder should be visible").toBeVisible();
  });

  test('TC806. Folder is wiped', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    const mailId = await apiManager.createMailsAPI.SendMsgRequest(mailSubject, mailBody, BaseTest.userForLogin.login, [BaseTest.secondUser.login]);
    await apiManager.mailsAPI.MoveMailToFolder(mailId, BaseTest.userForLogin.login, folderId);
    await OpenSentSubFolderContextMenu({pageManager});
    await ChooseNewFolderOptionAndCreateNewFoler({pageManager});
    await pageManager.sideSecondaryMailMenu.OpenFolderContextMenu(pageManager.sideSecondaryMailMenu.MailFolders.SubFolder.locator(`"${folderNameViaAPI}"`));
    await pageManager.sideSecondaryMailMenu.SelectMailFolderOption.WipeFolder();
    await pageManager.wipeFolderModal.WipeNewFolder();
    await pageManager.sideSecondaryMailMenu.OpenSubFolder(folderNameViaAPI);
    await expect(pageManager.mailsList.Elements.Letter, 'Mails list should be empty').toHaveCount(0);
  });

  test('TC807. Folder is deleted', async ({pageManager}) => {
    await OpenSentSubFolderContextMenu({pageManager});
    await pageManager.sideSecondaryMailMenu.SelectMailFolderOption.Delete();
    await pageManager.deleteFolderModal.DeleteFolder();
    await expect(pageManager.sideSecondaryMailMenu.Containers.MainContainer.locator(`"${folderNameViaAPI}"`), "Created folder should not be visible").not.toBeVisible();
  });
});
