import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class DeleteAddressBookModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Delete: this.Containers.MainContainer.locator('"Delete"'),
  };
}
