import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class CreateNewItemModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Fields = {
    DocumentName: this.Containers.MainContainer.locator('"Document name"'),
    SpreadsheetName: this.Containers.MainContainer.locator('"Spreadsheet name"'),
    PresentationName: this.Containers.MainContainer.locator('"Presentation name"'),
    Rename: this.Containers.MainContainer.locator('"Item Name"'),
  };

  Buttons = {
    CreateButton: this.Containers.MainContainer.locator('"Create"'),
    RenameButton: this.Containers.MainContainer.locator('"Rename"'),
  };

  async CreateItem(option, name) {
    await option.selectText();
    await option.fill(name);
    await this.Buttons.CreateButton.click();
    await this.WaitForModalHiding();
  };

  async RenameItem(name) {
    await this.Fields.Rename.selectText();
    await this.Fields.Rename.fill(name);
    await this.Buttons.RenameButton.click();
    await this.WaitForModalHiding();
  };

  CreatedFilesName = {
    CreateDocumentName: async (name) => await this.CreateItem(this.Fields.DocumentName, name),
    CreateSpreadsheetName: async (name) => await this.CreateItem(this.Fields.SpreadsheetName, name),
    CreatePresentationName: async (name) => await this.CreateItem(this.Fields.PresentationName, name),
  };
};
