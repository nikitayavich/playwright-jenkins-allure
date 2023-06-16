import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class CalendarAccessShareModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    IcsUrl: this.Containers.MainContainer.locator('"ICS URL"'),
    OutlookUrl: this.Containers.MainContainer.locator('"OUTLOOK URL"'),
    ViewUrl: this.Containers.MainContainer.locator('"VIEW URL"'),
  };
}
