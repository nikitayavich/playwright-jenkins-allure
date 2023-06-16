import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class DeleteCalendarModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  }

  Buttons = {
    Delete: this.Containers.MainContainer.locator('button >> "Delete"'),
  };
}
