import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class FileDetails extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('[data-testid="displayer"]'),
    HeaderContainer: this.page.locator('[data-testid="DisplayerHeader"]'),
    FileOptionsContainer: this.page.locator('[data-testid="displayer-actions-header"]'),
    ModalContainer: this.page.locator(this.mainLocators.modalWindowLocator),
    InformationContainer: this.page.locator('[data-testid="node-details"]>>[class*="Components"]'),
    TabsBarContainer: this.page.locator('div:has(>[class*="TabBar"])'),
    TabDetailsContainer: this.page.locator('[data-testid="node-details"]'),
    TabSharingContainer: this.page.locator('[data-testid="node-sharing-collaborators"]'),
    TabVersioningContainer: this.page.locator('[class*="Versioning"]'),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  Elements = {
    FileName: this.Containers.HeaderContainer.locator('[class*="Text__Comp"]'),
    FilePreview: this.page.locator('[class*="DisplayerPreview"]'),
    Description: this.Containers.InformationContainer.locator('_react=[key*="Description"]'),
    DescriptionText: this.Containers.InformationContainer.locator('_react=[key*="Description"]>>[color="text"]'),
    DescriptionInput: this.Containers.InformationContainer.locator('input'),
    FileVersionNumber: (versionNumber) => this.Containers.TabVersioningContainer.locator(`"Version ${versionNumber}"`),
    KeptForeverIcon: this.Containers.TabVersioningContainer.locator('[data-testid="icon: InfinityOutline"]'),
    ClonedVersionIcon: this.Containers.TabVersioningContainer.locator('[data-testid="icon: Copy"]'),
  };

  Modal = {
    DocumentNameTextbox: this.Containers.ModalContainer.locator('[name="Document name"]'),
    ClosePopupButton: this.Containers.ModalContainer.locator('button:has([data-testid*="Close"])'),
    CreateButton: this.Containers.ModalContainer.locator('"CREATE"'),
    DeletePermanentlyButton: this.Containers.ModalContainer.locator('button:has-text("Delete permanently")'),
    PurgeAllVersionsButton: this.Containers.ModalContainer.locator('button:has-text("Purge all versions")'),
  };

  Buttons = {
    CloseDetails: this.Containers.HeaderContainer.locator('[data-testid*="Close"]'),
    Download: this.Containers.HeaderContainer.locator('g[data-name="download"]'),
    EditDescriptionButton: this.Containers.InformationContainer.locator('[data-testid*="Edit2Outline"]'),
    SaveEditsButton: this.Containers.InformationContainer.locator('[data-testid*="SaveOutline"]'),
    Share: this.Containers.TabSharingContainer.locator('button:has-text("Share")'),
    UploadVersion: this.Containers.TabVersioningContainer.locator('button:has-text("Upload version")'),
    PurgeAllVersions: this.Containers.TabVersioningContainer.locator('button:has-text("Purge all versions")'),
    MoreOptionsVersioningDropdown: (versionNumber) => this.Containers.TabVersioningContainer.locator(`[data-testid="version${versionNumber}-icons"] button`),
  };

  FileOptions = {
    Download: this.Containers.FileOptionsContainer.locator('[data-testid*="Download"]'),
    MaximizeOutline: this.Containers.FileOptionsContainer.locator('[data-testid*="MaximizeOutline"]'),
    SendViaMail: this.Containers.FileOptionsContainer.locator('[data-testid*="EmailOutline"]'),
    Edit: this.Containers.FileOptionsContainer.locator('[data-testid*="Edit2Outline"]'),
    MoreOptions: this.Containers.FileOptionsContainer.locator('[data-testid*="MoreVertical"]'),
    Flag: this.Containers.DropdownContainer.locator('"Flag"'),
    UnFlag: this.Containers.DropdownContainer.locator('"Unflag"'),
    MoveToTrash: this.Containers.DropdownContainer.locator('"Delete"'),
    DeletePermanently: this.Containers.FileOptionsContainer.locator('[data-testid*="DeletePermanentlyOutline"]'),
    RestoreButton: this.Containers.FileOptionsContainer.locator('[data-testid*="RestoreOutline"]'),
    Rename: this.Containers.DropdownContainer.locator('"Rename"'),
  };

  Tabs = {
    Sharing: this.Containers.TabsBarContainer.locator('"Sharing"'),
    Versioning: this.Containers.TabsBarContainer.locator('"Versioning"'),
    Details: this.Containers.TabsBarContainer.locator('"Details"'),
  };

  InputFields = {
    AddNewPeopleField: this.Containers.TabSharingContainer.locator('[data-testid="add-sharing-chip-input"]'),
  };

  AddNewPeopleDropDown = {
    Item: (userMail) => this.Containers.DropdownContainer.locator(`"${userMail}"`),
  };

  ShareFile = {
    TypeIntoAddNewPeopleField: async (person: string) => await this.InputFields.AddNewPeopleField.type(person),
    ClickOnItem: async (userMail) => await this.AddNewPeopleDropDown.Item(userMail).click(),
  };

  ClickDropdownOption = {
    MoveToTrash: async () => await this.OpenDropdown(this.Containers.DropdownContainer.locator('"Delete"')),
    Flag: async () => await this.OpenDropdown(this.Containers.DropdownContainer.locator('"Flag"')),
    UnFlag: async () => await this.OpenDropdown(this.Containers.DropdownContainer.locator('"Unflag"')),
    Rename: async () => await this.OpenDropdown(this.FileOptions.Rename),
  };

  ClickVersioningDropdownOption = {
    OpenDocumentVersion: async (versionNumber) => await this.OpenVersioningDropdown(this.Containers.DropdownContainer.locator('"Open document version"'), versionNumber),
    KeepVersionForever: async (versionNumber) => await this.OpenVersioningDropdown(this.Containers.DropdownContainer.locator('"Keep this version forever"'), versionNumber),
    RemoveKeepForever: async (versionNumber) => await this.OpenVersioningDropdown(this.Containers.DropdownContainer.locator('"Remove keep forever"'), versionNumber),
    CloneAsCurrent: async (versionNumber) => await this.OpenVersioningDropdown(this.Containers.DropdownContainer.locator('"Clone as current"'), versionNumber),
    DeleteVersion: async (versionNumber) => await this.OpenVersioningDropdown(this.Containers.DropdownContainer.locator('"Delete version"'), versionNumber),
  };

  async DownloadFile() {
    const [download] = await Promise.all([this.page.waitForEvent('download'), this.FileOptions.Download.click()]);
    const suggestedFileName = download.suggestedFilename();
    const downloadedfilePath = './download/' + suggestedFileName;
    await download.saveAs(downloadedfilePath);
    return downloadedfilePath;
  };

  async CreateNewDocument(documentName) {
    documentName = documentName + Date.now();
    await this.Modal.DocumentNameTextbox.click();
    await this.Modal.DocumentNameTextbox.fill(documentName);
    await this.Modal.CreateButton.click();
  };

  async OpenDropdown(option) {
    await this.FileOptions.MoreOptions.click();
    await option.click();
  };

  async OpenVersioningDropdown(option, versionNumber) {
    await this.Buttons.MoreOptionsVersioningDropdown(versionNumber).click();
    await option.click();
  };

  async WriteDescription(text) {
    await this.Buttons.EditDescriptionButton.locator('nth=-1').waitFor();
    await this.Buttons.EditDescriptionButton.locator('nth=-1').click();
    await this.Elements.DescriptionInput.type(text);
    await this.Buttons.SaveEditsButton.click();
  };

  async SharingFile(userMail) {
    await this.Tabs.Sharing.click();
    await this.InputFields.AddNewPeopleField.click();
    await this.ShareFile.TypeIntoAddNewPeopleField(userMail);
    await this.ShareFile.ClickOnItem(userMail);
    await this.Buttons.Share.click();
  };

  async GetOnlineEditorPage() {
    const [editorPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.Containers.FileOptionsContainer.first().click(),
    ]);
    await editorPage.waitForLoadState();
    return editorPage;
  };
}
