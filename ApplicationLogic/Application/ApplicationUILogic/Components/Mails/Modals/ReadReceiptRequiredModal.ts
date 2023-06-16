import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class ReadReceiptRequiredModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Elements = {
    Title: this.Containers.MainContainer.locator('"Read receipt required"'),
  };

  Buttons = {
    DoNotNotify: this.Containers.MainContainer.locator('"Do not notify"'),
    Notify: this.Containers.MainContainer.locator('"Notify"'),
  };
}
