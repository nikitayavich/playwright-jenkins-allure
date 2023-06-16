import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';
import fs from "fs";

test.describe('Files tests', async () => {
  // Components
  const pngFileName = 'testFile';
  const jpgFileName = 'testFile2';
  const pngFile = 'testFile.png';
  const jpgFile = 'testFile2.jpg';
  const pngFile2 = 'testAPI.png';
  const filePath = './TestData/Files/';
  let unicFilePrefix;
  let unicFileName;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.files();
    unicFilePrefix = BaseTest.dateTimePrefix();
    unicFileName = unicFilePrefix + 'testAPI';
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
  });

  test.afterEach(async ({apiManager, page}) => {
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
    await page.close();
  });

  async function UploadFileAndOpenDetails({apiManager, pageManager}) {
    await apiManager.createFilesAPI.UploadFileViaAPI(pngFile2, unicFilePrefix);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(pageManager.sideSecondaryFilesMenu.Tabs.Home);
    await pageManager.filesList.OpenFileDetails(unicFileName);
  };

  async function UploadFileAndMoveToTrash({apiManager, pageManager}) {
    await UploadFileAndOpenDetails({apiManager, pageManager});
    await pageManager.fileDetails.ClickDropdownOption.MoveToTrash();
    await pageManager.sideSecondaryFilesMenu.SelectTrashSubfolder.TrashElements();
  };

  async function UploadFilesAndSortList({pageManager, apiManager}, sort) {
    await apiManager.createFilesAPI.UploadFileViaAPI(pngFile);
    await apiManager.createFilesAPI.UploadFileViaAPI(jpgFile);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await sort();
  };

  async function UploadFileAndOpenUploads({pageManager}) {
    await pageManager.headerMenu.UploadNewFile('./TestData/Files/testFile2.jpg');
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(pageManager.sideSecondaryFilesMenu.Tabs.Uploads);
  };

  async function UploadNewFileVersions({apiManager, pageManager, page}, versionsCount = 1) {
    await UploadFileAndOpenDetails({apiManager, pageManager});
    await pageManager.fileDetails.Tabs.Versioning.click();
    let i = 1;
    do {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        pageManager.fileDetails.Buttons.UploadVersion.click(),
      ]);
      await fileChooser.setFiles(`${filePath}${jpgFile}`);
      await pageManager.fileDetails.Elements.FileVersionNumber(i + 1).waitFor();
      i++;
    } while (i <= versionsCount);
  };

  async function MarkFileVersionAsKeptForever({apiManager, pageManager}) {
    await UploadFileAndOpenDetails({apiManager, pageManager});
    await pageManager.fileDetails.Tabs.Versioning.click();
    await pageManager.fileDetails.ClickVersioningDropdownOption.KeepVersionForever(1);
  };

  test('TC501. File with JPG extension can be uploaded. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    await pageManager.headerMenu.UploadNewFile('./TestData/Files/testFile2.jpg');
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await expect(pageManager.filesList.Elements.File.locator(`"${jpgFileName}"`)).toBeVisible();
  });

  test('TC502. File Preview is displayed by List File clicking', async ({pageManager, apiManager}) => {
    await apiManager.createFilesAPI.UploadFileViaAPI(pngFile2, unicFilePrefix);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(pageManager.sideSecondaryFilesMenu.Tabs.Home);
    await pageManager.filesList.OpenFileDetails(unicFileName);
    await expect((pageManager.fileDetails.Elements.FilePreview)).toBeVisible();
  });

  test('TC503. File can be downloaded. @criticalPath', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    try {
      await apiManager.createFilesAPI.UploadFileViaAPI(pngFile2, unicFilePrefix);
      await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
      await pageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(pageManager.sideSecondaryFilesMenu.Tabs.Home);
      await expect((pageManager.filesList.Elements.File.locator(`"${unicFileName}"`))).toBeVisible();
      await pageManager.filesList.OpenFileDetails(unicFileName);
      expect(fs.existsSync(await pageManager.fileDetails.DownloadFile())).toBeTruthy();
    } catch (e) {
      throw e;
    }
  });

  test('TC507. File must be moved to trash', async ({apiManager, pageManager}) => {
    await UploadFileAndMoveToTrash({apiManager, pageManager});
    await expect(pageManager.filesList.Elements.File.locator(`"${unicFileName}"`)).toBeVisible();
  });

  test('TC504. File can be permanently removed', async ({apiManager, pageManager}) => {
    BaseTest.doubleTimeout();
    await UploadFileAndMoveToTrash({apiManager, pageManager});
    await pageManager.filesList.OpenFileDetails(unicFileName);
    await pageManager.fileDetails.FileOptions.DeletePermanently.click();
    await pageManager.fileDetails.Modal.DeletePermanentlyButton.click();
    await pageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(pageManager.sideSecondaryFilesMenu.Tabs.Home);
    await expect(pageManager.filesList.Elements.File.locator(`"${unicFileName}"`)).not.toBeVisible();
  });

  test('TC505. File can be restored from trash', async ({apiManager, pageManager}) => {
    BaseTest.doubleTimeout();
    await UploadFileAndMoveToTrash({apiManager, pageManager});
    await pageManager.filesList.OpenFileDetails(unicFileName);
    await pageManager.fileDetails.FileOptions.RestoreButton.click();
    await pageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(pageManager.sideSecondaryFilesMenu.Tabs.Home);
    await expect(pageManager.filesList.Elements.File.locator(`"${unicFileName}"`)).toBeVisible();
  });

  test('TC506. File must be flagged and unflagged', async ({apiManager, pageManager}) => {
    BaseTest.doubleTimeout();
    await UploadFileAndOpenDetails({apiManager, pageManager});
    await pageManager.fileDetails.ClickDropdownOption.Flag();
    await expect(pageManager.filesList.Elements.FlagIcon).toBeVisible();
    await pageManager.sideSecondaryFilesMenu.SelectFilterSubfolder.FiltersFlagged();
    await pageManager.filesList.OpenFileDetails(unicFileName);
    await pageManager.fileDetails.ClickDropdownOption.UnFlag();
    await pageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(pageManager.sideSecondaryFilesMenu.Tabs.Home);
    await expect(pageManager.filesList.Elements.File.locator(`"${unicFileName}"`)).toBeVisible();
    await expect(pageManager.filesList.Elements.FlagIcon).not.toBeVisible();
  });

  test('TC508. Share file', async ({apiManager, pageManager, secondPageManager}) => {
    BaseTest.doubleTimeout();
    await UploadFileAndOpenDetails({apiManager, pageManager});
    await pageManager.fileDetails.SharingFile(BaseTest.secondUser.login);
    await secondPageManager.sideMenu.SideMenuTabs.Files.click();
    await secondPageManager.sideSecondaryFilesMenu.OpenSecondaryMenuTab(secondPageManager.sideSecondaryFilesMenu.Tabs.SharedWithMe);
    await expect(secondPageManager.filesList.Elements.DefinedByNameFile(unicFileName)).toBeVisible();
  });

  test('TC509. Sort file list by last update. The last updated file should be first in the list', async ({pageManager, apiManager}) => {
    await UploadFilesAndSortList({pageManager, apiManager}, pageManager.filesList.SelectListOrder.LastUpdateDescending);
    await expect(pageManager.filesList.Elements.FileName.nth(0)).toHaveText(jpgFileName);
    await expect(pageManager.filesList.Elements.FileName.nth(1)).toHaveText(pngFileName);
  });

  test('TC510. Sort file list by size. The larger file should be first in the list', async ({pageManager, apiManager}) => {
    await UploadFilesAndSortList({pageManager, apiManager}, pageManager.filesList.SelectListOrder.SizeDescending);
    const firstFileSize = parseFloat(await pageManager.filesList.Elements.FileSize.nth(0).innerText());
    const secondFileSize = parseFloat(await pageManager.filesList.Elements.FileSize.nth(1).innerText());
    expect(firstFileSize).toBeGreaterThan(secondFileSize);
  });

  test('TC523. Upload file and check it exists in the “Uploads”. The downloaded file should be displayed in the “Uploads”', async ({pageManager}) => {
    await UploadFileAndOpenUploads({pageManager});
    await expect(pageManager.filesList.Containers.MainContainer.locator(`"${jpgFile}"`)).toBeVisible();
  });

  test('TC524. Clean up the “Uploads” list. The “Uploads” list should be empty', async ({pageManager}) => {
    await UploadFileAndOpenUploads({pageManager});
    await pageManager.filesList.Elements.CleanCompletedUploads.click();
    await expect(pageManager.filesList.Containers.EmptyListContainer).toBeVisible();
  });

  test('TC525. Upload a new file version. The current file version should be changed to the uploaded one', async ({pageManager, apiManager, page}) => {
    await UploadNewFileVersions({apiManager, pageManager, page});
    await expect(pageManager.fileDetails.Elements.FileVersionNumber(2)).toBeVisible();
  });

  test('TC526. Mark a file version as “Kept forever”. The infinity icon should appear to the left of the dropdown', async ({pageManager, apiManager}) => {
    await MarkFileVersionAsKeptForever({pageManager, apiManager});
    await expect(pageManager.fileDetails.Elements.KeptForeverIcon).toBeVisible();
  });

  test('TC527. Remove tag “Keep forever” for a file version. The infinity icon should disappear to the left of the dropdown', async ({pageManager, apiManager}) => {
    await MarkFileVersionAsKeptForever({pageManager, apiManager});
    await pageManager.fileDetails.ClickVersioningDropdownOption.RemoveKeepForever(1);
    await expect(pageManager.fileDetails.Elements.KeptForeverIcon).toBeHidden();
  });

  test('TC528. Delete the file version. The deleted version should disappear from the list', async ({pageManager, apiManager, page}) => {
    await UploadNewFileVersions({apiManager, pageManager, page});
    await pageManager.fileDetails.Elements.FileVersionNumber(2).waitFor();
    await pageManager.fileDetails.ClickVersioningDropdownOption.DeleteVersion(1);
    await expect(pageManager.fileDetails.Elements.FileVersionNumber(1)).toBeHidden();
  });

  test('TC529. Purge all versions except the current one. Only current version should remain in the list', async ({pageManager, apiManager, page}) => {
    await UploadNewFileVersions({apiManager, pageManager, page}, 2);
    await pageManager.fileDetails.Buttons.PurgeAllVersions.click();
    await pageManager.fileDetails.Modal.PurgeAllVersionsButton.click();
    await expect(pageManager.fileDetails.Elements.FileVersionNumber(1)).toBeHidden();
    await expect(pageManager.fileDetails.Elements.FileVersionNumber(2)).toBeHidden();
  });

  test('TC530. Purge all versions except the version marked as kept forever. Version marked as kept forever should remain in the list', async ({pageManager, apiManager, page}) => {
    await UploadNewFileVersions({apiManager, pageManager, page}, 2);
    await pageManager.fileDetails.ClickVersioningDropdownOption.KeepVersionForever(2);
    await pageManager.fileDetails.Elements.KeptForeverIcon.waitFor();
    await pageManager.fileDetails.Buttons.PurgeAllVersions.click();
    await pageManager.fileDetails.Modal.PurgeAllVersionsButton.click();
    await expect(pageManager.fileDetails.Elements.KeptForeverIcon).toBeVisible();
  });

  test('TC531. Clone the file version. A new Current version appears in the list with the clone icon to the left of the dropdown', async ({pageManager, apiManager}) => {
    await UploadFileAndOpenDetails({apiManager, pageManager});
    await pageManager.fileDetails.Tabs.Versioning.click();
    await pageManager.fileDetails.ClickVersioningDropdownOption.CloneAsCurrent(1);
    await expect(pageManager.fileDetails.Elements.FileVersionNumber(2)).toBeVisible();
    await expect(pageManager.fileDetails.Elements.ClonedVersionIcon).toBeVisible();
  });
});
