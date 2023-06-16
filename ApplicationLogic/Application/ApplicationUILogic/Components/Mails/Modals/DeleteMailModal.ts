import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class DeleteMailModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    DeletePermanently: this.Containers.MainContainer.locator('"Delete Permanently"'),
    Delete: this.Containers.MainContainer.locator('"Delete"'),
  };

  async DeletePermanently() {
    await this.Buttons.DeletePermanently.click();
  };
}
