import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class DeleteFolderModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Cancel: this.Containers.MainContainer.locator('"Cancel"'),
    Ok: this.Containers.MainContainer.locator('"Ok"'),
  };

  async DeleteFolder() {
    await this.Buttons.Ok.click();
  };
}
