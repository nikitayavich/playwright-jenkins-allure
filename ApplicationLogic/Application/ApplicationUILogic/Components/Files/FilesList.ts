import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class FilesList extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.ListContainerLocator),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
    EmptyListContainer: this.page.locator('[data-testid="emptyFolder"]'),
  };

  Elements = {
    File: this.Containers.MainContainer.locator(this.InheritedFields.ListItemLocator),
    FileIcon: this.Containers.MainContainer.locator('[data-testid*="file"]'),
    Header: this.Containers.MainContainer.locator('[data-testid="list-header"]'),
    FileName: this.Containers.MainContainer.locator(`${this.InheritedFields.ListItemLocator} >> [class^="Text__Comp"][color="text"]`),
    FileExtension: this.Containers.MainContainer.locator(this.InheritedFields.ListItemLocator).locator('[class^="Container__ContainerEl"] > [class*="NodeListItem"]'),
    FileSize: this.Containers.MainContainer.locator(`${this.InheritedFields.ListItemLocator} >> [class^=Padding__Comp] [class*=NodeListItem]`),
    FlagIcon: this.Containers.MainContainer.locator('[data-testid="icon: Flag"]'),
    DefinedByNameFile: (unicFileName) => this.Containers.MainContainer.locator(this.InheritedFields.ListItemLocator, {hasText: `${unicFileName}`}),
    SelectOrder: this.Containers.MainContainer.locator('button:has(>[data-testid$="ListOutline"])'),
    CleanCompletedUploads: this.page.locator('button:has-text("Clean completed uploads")'),
    FileExtensionFilteredByFileName: (fileName) => this.Containers.MainContainer.locator(this.InheritedFields.ListItemLocator).filter({hasText: `${fileName}`}).locator('[class^="Container__ContainerEl"] > [class*="NodeListItem"]'),
  };

  SelectOrderDropdown = {
    AscendingOrder: this.Containers.DropdownContainer.locator('"Ascending Order"'),
    DescendingOrder: this.Containers.DropdownContainer.locator('"Descending Order"'),
    Name: this.Containers.DropdownContainer.locator('"Name"'),
    LastUpdate: this.Containers.DropdownContainer.locator('"Last Update"'),
    Size: this.Containers.DropdownContainer.locator('"Size"'),
  };

  SelectionModeElements = {
    CheckMark: this.Containers.MainContainer.locator('[data-testid*="Checkmark"]'),
    UncheckMark: this.Containers.MainContainer.locator('[data-testid*="unCheckedAvatar"]'),
    SelectAllButton: this.Containers.MainContainer.locator('"Select all"'),
    DeselectAllButton: this.Containers.MainContainer.locator('"Deselect all"'),
  };

  SelectListOrder = {
    NameAscending: async () => await this.SelectOrder(this.SelectOrderDropdown.Name, this.SelectOrderDropdown.AscendingOrder),
    LastUpdateAscending: async () => await this.SelectOrder(this.SelectOrderDropdown.LastUpdate, this.SelectOrderDropdown.AscendingOrder),
    SizeAscending: async () => await this.SelectOrder(this.SelectOrderDropdown.Size, this.SelectOrderDropdown.AscendingOrder),
    NameDescending: async () => await this.SelectOrder(this.SelectOrderDropdown.Name, this.SelectOrderDropdown.DescendingOrder),
    LastUpdateDescending: async () => await this.SelectOrder(this.SelectOrderDropdown.LastUpdate, this.SelectOrderDropdown.DescendingOrder),
    SizeDescending: async () => await this.SelectOrder(this.SelectOrderDropdown.Size, this.SelectOrderDropdown.DescendingOrder),
  };

  async SelectOrder(by, order) {
    await this.Elements.SelectOrder.click();
    if (await order.isVisible()) {
      await order.click();
    }
    await by.click();
    await this.Elements.SelectOrder.click();
  };

  async OpenFileDetails(unicFileName) {
    await this.Elements.DefinedByNameFile(unicFileName).click();
  };
}
