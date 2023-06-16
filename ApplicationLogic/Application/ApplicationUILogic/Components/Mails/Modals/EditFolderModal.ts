import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class EditFolderModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  TextBoxes = {
    FolderName: this.Containers.MainContainer.locator('[placeholder="Folder name"]'),
  };

  DropDowns = {
    SelectColor: this.Containers.MainContainer.locator('"Select Color"'),
    RetentionPolicy: this.Containers.MainContainer.locator('.imQMgX:has([data-testid*="ChevronDownOutline"])'),
  };

  Buttons = {
    AddShare: this.Containers.MainContainer.locator('"Add Share"'),
    Edit: this.Containers.MainContainer.locator('"Edit"'),
  };

  async EditFolder(newFolderName) {
    await this.TextBoxes.FolderName.fill(newFolderName);
    await this.Buttons.Edit.click();
  };
}
