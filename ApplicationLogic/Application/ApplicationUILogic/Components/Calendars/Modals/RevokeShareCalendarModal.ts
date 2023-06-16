import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class RevokeShareCalendarModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    GoBack: this.Containers.MainContainer.locator('"Go back"'),
    Revoke: this.Containers.MainContainer.locator('"Revoke"'),
  };
}
