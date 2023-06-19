import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Search tests', async () => {
  let uniquePrefix;
  let mailBody;
  let subjectWithFile;
  let unicFileName;
  let fileNameFull;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.search();
    uniquePrefix = BaseTest.dateTimePrefix();
    mailBody = uniquePrefix + ' Autotest Mail Body';
    subjectWithFile = uniquePrefix + 'File in this mail';
    unicFileName = uniquePrefix + 'Zextras File';
    fileNameFull = 'testAPI.png';
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
  });

  test.afterEach(async ({apiManager, page}) => {
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
    await page.close();
  });

  async function OpenSearchTabAndOpenAdvancedFilters({pageManager}) {
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Search);
    await pageManager.searchResultsList.Buttons.AdvancedFilters.click();
  };

  test('TC705. Search by “Attachment” option found mail with attachment. The sent email should be found by attachments', async ({apiManager, pageManager}) => {
    const nodeId = await apiManager.createFilesAPI.CreateDocumentForUpload(unicFileName);
    const uploadId = await apiManager.filesAPI.UploadTo(nodeId);
    const draftId = await apiManager.createMailsAPI.SaveDraftRequest(subjectWithFile, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login], [], [], [], [], uploadId);
    await apiManager.createMailsAPI.SendMsgRequest(subjectWithFile, mailBody, BaseTest.userForLogin.login, [BaseTest.userForLogin.login], [], [], [], [], draftId);
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
    await pageManager.advancedFiltersModal.AdvancedFiltersOptions.EnableAttachment();
    await pageManager.advancedFiltersModal.Buttons.Search.click();
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${subjectWithFile}"`).first()).toBeVisible();
  });

  test('TC703. Search file. @criticalPath', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await apiManager.createFilesAPI.UploadFileViaAPI(fileNameFull, uniquePrefix);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.headerMenu.MakeSearch(uniquePrefix);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${uniquePrefix}testAPI"`)).toBeVisible();
  });
});
