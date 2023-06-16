import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class EditAfterMoveAppointmentModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    EditMessage: this.Containers.MainContainer.locator('"Edit Message"'),
    SendEdit: this.Containers.MainContainer.locator('"Send Edit"'),
  };
}
