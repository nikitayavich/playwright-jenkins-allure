import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class SideSecondaryMailMenu extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.SideSecondaryBarLocator),
    MailOptionsContainer: this.page.locator(this.mainLocators.dropdownLocator),
    CreateNewFolderPopupContainer: this.page.locator('[data-testid="modal"]'),
    ContextMenuContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  Buttons = {
    ExpandFolder: this.Containers.MainContainer.locator(this.InheritedFields.ExpandFoldersLocator),
  };

  Icons = {
    SharedIcon: this.Containers.MainContainer.locator('[data-testid*="Shared"]'),
  };

  MailFolders = {
    Inbox: this.Containers.MainContainer.locator('"Inbox"'),
    Junk: this.Containers.MainContainer.locator('"Junk"'),
    Sent: this.Containers.MainContainer.locator('"Sent"'),
    Drafts: this.Containers.MainContainer.locator('"Drafts"'),
    Trash: this.Containers.MainContainer.locator('"Trash"'),
    Tags: this.Containers.MainContainer.locator('"Tags"'),
    SubFolder: this.Containers.MainContainer.locator('_react=[item.depth=2] >> nth=0'),
  };

  MailFolderOptions = {
    NewFolder: this.Containers.MailOptionsContainer.locator('"New Folder"'),
    Move: this.Containers.MailOptionsContainer.locator('"Move"'),
    WipeFolder: this.Containers.MailOptionsContainer.locator('"Wipe Folder"'),
    Edit: this.Containers.MailOptionsContainer.locator('"Edit"'),
    Delete: this.Containers.MailOptionsContainer.locator('"Delete"'),
    ShareFolder: this.Containers.MailOptionsContainer.locator('"Share folder"'),
  };

  CreateNewFolderPopup = {
    FolderName: this.Containers.CreateNewFolderPopupContainer.locator('[placeholder="Enter Folder Name"]'),
    FilterFolders: this.Containers.CreateNewFolderPopupContainer.locator('[placeholder="Enter Folder Name"]'),
    CancelButton: this.Containers.CreateNewFolderPopupContainer.locator('"Cancel"'),
    CreateButton: this.Containers.CreateNewFolderPopupContainer.locator('"Create"'),
  };

  Elements = {
    Item: this.Containers.MainContainer.locator('[class*="Text__Comp"]'),
  };

  async OpenFolder(folder) {
    await this.MailFolders.Tags.waitFor();
    if (await this.MailFolders.Inbox.isHidden()) {
      await this.Buttons.ExpandFolder.first().click();
    };
    await folder.click();
  };

  OpenMailFolder = {
    Inbox: async () => await this.OpenFolder(this.MailFolders.Inbox),
    Junk: async () => await this.OpenFolder(this.MailFolders.Junk),
    Sent: async () => await this.OpenFolder(this.MailFolders.Sent),
    Drafts: async () => await this.OpenFolder(this.MailFolders.Drafts),
    Trash: async () => await this.OpenFolder(this.MailFolders.Trash),
  };

  async OpenFolderContextMenu(folder) {
    await folder.first().click({button: "right"});
  };

  SelectMailFolderOption = {
    NewFolder: async () => await this.MailFolderOptions.NewFolder.click(),
    Move: async () => await this.MailFolderOptions.Move.click(),
    WipeFolder: async () => await this.MailFolderOptions.WipeFolder.click(),
    Edit: async () => await this.MailFolderOptions.Edit.click(),
    Delete: async () => await this.MailFolderOptions.Delete.click(),
    ShareFolder: async () => await this.MailFolderOptions.ShareFolder.click(),
  };

  async CreateNewFolder(folderName) {
    await this.CreateNewFolderPopup.FolderName.fill(folderName);
    await this.CreateNewFolderPopup.CreateButton.click();
  };

  async ExpandFolders(folder) {
    if (folder !== 'Tags') {
      if (await this.page.isHidden(`${this.InheritedFields.SideSecondaryBarLocator} >> text=Inbox`)) {
        await this.Buttons.ExpandFolder.first().click();
        await this.MailFolders.Inbox.click();
      };
      if (folder === 'Inbox') {
        await this.Buttons.ExpandFolder.locator('nth=1').click();
      } else if (folder) {
        await this.page.click(`${this.InheritedFields.ExpandFoldersLocator}:near(:text("${folder}"))`);
      };
    } else {
      await this.page.click(`[data-testid*="ChevronDown"]:near(:text("${folder}"))`);
    };
  };

  ExpandMailFolders = {
    Inbox: async () => await this.ExpandFolders('Inbox'),
    Junk: async () => await this.ExpandFolders('Junk'),
    Sent: async () => await this.ExpandFolders('Sent'),
    Drafts: async () => await this.ExpandFolders('Drafts'),
    Trash: async () => await this.ExpandFolders('Trash'),
    Tags: async () => await this.ExpandFolders('Tags'),
  };

  async OpenSubFolder(folderName) {
    await this.MailFolders.SubFolder.locator(`"${folderName}"`).click();
  };
}
