import {ModalWindowBase} from '../Modals/ModalWindowBase';


export class ResetModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Cancel: this.Containers.MainContainer.locator('"CANCEL"'),
    Yes: this.Containers.MainContainer.locator('"YES"'),
  };
}
