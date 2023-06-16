import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class MoveAppointmentModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Move: this.Containers.MainContainer.locator('"Move"'),
    NewCalendar: this.Containers.MainContainer.locator('"New calendar"'),
  };

  Dropdowns = {
    Root: this.Containers.MainContainer.locator('"Root"'),
  };

  Elements = {
    Trash: this.Containers.MainContainer.locator('"Trash"'),
  };

  Textbox = {
    FilterCalendars: this.Containers.MainContainer.locator('[name="Filter calendars"]'),
  };
}
