import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class DeleteContactPermanentlyModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    DeletePermanently: this.Containers.MainContainer.locator('"Delete Permanently"'),
  };
}
