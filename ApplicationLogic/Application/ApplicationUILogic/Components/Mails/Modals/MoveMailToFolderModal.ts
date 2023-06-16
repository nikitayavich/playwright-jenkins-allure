import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class MoveMailToFolderModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Folders = {
    FoldersListItem: this.Containers.MainContainer.locator(this.InheritedFields.DropdownItemReactLocator),
  };

  Buttons = {
    ExpandFoldersListButton: this.Containers.MainContainer.locator(this.InheritedFields.ExpandFoldersLocator),
    NewFolderButton: this.Containers.MainContainer.locator('"New Folder"'),
    MoveButton: this.Containers.MainContainer.locator('"Move"'),
    CancelButton: this.Containers.MainContainer.locator('"Cancel"'),
  };

  async MoveMailToFolder(folderName) {
    await this.Folders.FoldersListItem.locator(`"${folderName}"`).click();
    await this.Buttons.MoveButton.click();
  };
}
