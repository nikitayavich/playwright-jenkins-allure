import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Documents tests', async () => {
  let fileName;
  let newFileName;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.files();
    fileName = BaseTest.dateTimePrefix() + ' Autotest File Name';
    newFileName = BaseTest.dateTimePrefix() + ' Autotest New File Name';
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
  });

  test.afterEach(async ({apiManager, page}) => {
    await apiManager.filesAPI.DeleteFilesViaAPI(apiManager);
    await page.close();
  });

  async function SaveOldNameRenameFileAndExpectFileRename({pageManager}) {
    await pageManager.filesList.Elements.File.click();
    await pageManager.fileDetails.ClickDropdownOption.Rename();
    await pageManager.createNewItemModal.RenameItem(newFileName);
    await expect(pageManager.filesList.Elements.FileName).toHaveText(newFileName);
  };

  async function CreateNewFileAndGiveName({pageManager}, newItem, name) {
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    if (newItem === pageManager.headerMenu.NewItemMenu.NewDocument) {
      await pageManager.headerMenu.SelectOptionInNewItemMenu.OpenDocumentOdt();
      await pageManager.createNewItemModal.CreatedFilesName.CreateDocumentName(name);
    } else if (newItem === pageManager.headerMenu.NewItemMenu.NewPresentation) {
      await pageManager.headerMenu.SelectOptionInNewItemMenu.OpenDocumentOdp();
      await pageManager.createNewItemModal.CreatedFilesName.CreatePresentationName(name);
    } else if (newItem === pageManager.headerMenu.NewItemMenu.NewSpreadsheet) {
      await pageManager.headerMenu.SelectOptionInNewItemMenu.OpenDocumentOds();
      await pageManager.createNewItemModal.CreatedFilesName.CreateSpreadsheetName(name);
    };
  };

  async function SelectUnselectAllFIles({pageManager}, unselect?) {
    await pageManager.filesList.Elements.FileIcon.first().click();
    await pageManager.filesList.SelectionModeElements.SelectAllButton.waitFor();
    await pageManager.filesList.SelectionModeElements.SelectAllButton.click();
    if (unselect === pageManager.filesList.SelectionModeElements.DeselectAllButton) {
      await pageManager.filesList.SelectionModeElements.DeselectAllButton.click();
    };
  };

  test('TC512. Create document file. Document file should be in Home tab. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await CreateNewFileAndGiveName({pageManager}, pageManager.headerMenu.NewItemMenu.NewDocument, fileName);
    await expect(pageManager.filesList.Elements.File.locator(`"${fileName}"`)).toBeVisible();
  });

  test('TC513. Create spreadsheet file. Spreadsheet file should be in Home tab. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await CreateNewFileAndGiveName({pageManager}, pageManager.headerMenu.NewItemMenu.NewSpreadsheet, fileName);
    await expect(pageManager.filesList.Elements.File.locator(`"${fileName}"`)).toBeVisible();
  });

  test('TC514. Create presentation file. Presentation file should be in Home tab. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await CreateNewFileAndGiveName({pageManager}, pageManager.headerMenu.NewItemMenu.NewPresentation, fileName);
    await expect(pageManager.filesList.Elements.File.locator(`"${fileName}"`)).toBeVisible();
  });

  test('TC515. Change the name of a presentation. The presentation should be in a Home tab with a new name.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createFilesAPI.CreatePresentation(fileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await SaveOldNameRenameFileAndExpectFileRename({pageManager});
  });

  test('TC516. Change the name of a spreadsheet. The spreadsheet should be in a Home tab with a new name.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createFilesAPI.CreateSpreadsheet(fileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await SaveOldNameRenameFileAndExpectFileRename({pageManager});
  });

  test('TC517. Change the name of a document. The document should be in a Home tab with a new name.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createFilesAPI.CreateDocument(fileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await SaveOldNameRenameFileAndExpectFileRename({pageManager});
  });

  test('TC518. Select file. File should be selected in Home tab.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createFilesAPI.CreateDocument(fileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.filesList.Elements.FileIcon.click();
    await expect(pageManager.filesList.SelectionModeElements.CheckMark).toBeVisible();
  });

  test('TC519. Select all files. All files should be selected in Home tab.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createFilesAPI.CreateSpreadsheet(fileName);
    await apiManager.createFilesAPI.CreateDocument(newFileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await SelectUnselectAllFIles({pageManager});
    await expect(pageManager.filesList.Elements.UncheckMark).not.toBeTruthy();
  });

  test('TC520. Unselect all files. All files should be unselected in Home tab.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createFilesAPI.CreateDocument(fileName);
    await apiManager.createFilesAPI.CreateSpreadsheet(newFileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await SelectUnselectAllFIles({pageManager}, pageManager.filesList.SelectionModeElements.DeselectAllButton);
    await expect(pageManager.filesList.Elements.CheckMark).not.toBeTruthy();
  });

  test('TC521. Add a description to the file. The description should be in the Home tab of the file.', async ({pageManager, apiManager}) => {
    await apiManager.createFilesAPI.CreateDocument(fileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.filesList.Elements.File.click();
    await pageManager.fileDetails.WriteDescription(newFileName);
    await expect(pageManager.fileDetails.Elements.DescriptionText).toHaveText(newFileName);
  });

  test('TC522. Open Online Editor. Online Editor should be opened by clicking the “Edit” button.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await apiManager.createFilesAPI.CreateDocument(fileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.filesList.Elements.File.click();
    await pageManager.fileDetails.FileOptions.Edit.click();
    const editorPage = await pageManager.fileDetails.GetOnlineEditorPage();
    await expect(editorPage).toHaveTitle('Online Editor');
  });

  test('TC532. Upload and open a new document version. A document version should be opened', async ({pageManager, apiManager, page}) => {
    BaseTest.doubleTimeout();
    test.fail(true, 'Issue #38');
    await apiManager.createFilesAPI.CreateDocument(fileName);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.filesList.Elements.File.click();
    await pageManager.fileDetails.Tabs.Versioning.click();
    const [documentVersionPage] = await Promise.all([
      page.waitForEvent('popup'),
      pageManager.fileDetails.ClickVersioningDropdownOption.OpenDocumentVersion(1),
    ]);
    await expect(documentVersionPage).toHaveURL('https://qa-public1.demo.zextras.io/services/docs/files/open/72620f9e-6e88-4e6d-bf20-abf7b62c9db8?version=1');
  });

  test('TC533. Create Microsoft Word file via header menu. File with docx extension should appear in Home folder. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.headerMenu.SelectOptionInNewItemMenu.MicrosoftWordDocx();
    await pageManager.createNewItemModal.CreatedFilesName.CreateDocumentName(fileName);
    await expect(pageManager.filesList.Elements.FileExtensionFilteredByFileName(fileName)).toHaveText('docx');
  });

  test('TC534. Create Microsoft Excel file via header menu. File with xlsx extension should appear in Home folder. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.headerMenu.SelectOptionInNewItemMenu.MicrosoftExcelXlsx();
    await pageManager.createNewItemModal.CreatedFilesName.CreateSpreadsheetName(fileName);
    await expect(pageManager.filesList.Elements.FileExtensionFilteredByFileName(fileName)).toHaveText('xlsx');
  });

  test('TC535. Create Microsoft PowerPoint file via header menu. File with pptx extension should appear in Home folder. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Files);
    await pageManager.headerMenu.SelectOptionInNewItemMenu.MicrosoftPowerPointPptx();
    await pageManager.createNewItemModal.CreatedFilesName.CreatePresentationName(fileName);
    await expect(pageManager.filesList.Elements.FileExtensionFilteredByFileName(fileName)).toHaveText('pptx');
  });
});
