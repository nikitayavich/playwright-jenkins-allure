import {ShareModalWindow} from '../../ModalWindows/ShareModalWindow';


export class ShareCalendarModal extends ShareModalWindow {
  constructor(page) {
    super(page);
    this.CheckBoxes.NotificationAboutShare = this.Containers.MainContainer.locator('"Allow user(s) to see my private appointments"');
    this.Buttons.ShareButton = this.Containers.MainContainer.locator('button >> "Share Calendar"');
  };

  Dropdowns = {
    OpenClose: this.Containers.MainContainer.locator('"share with"'),
  };

  async ShareCalendar(recipient) {
    await this.TextBoxes.Recipients.fill(recipient);
    await this.Containers.MainContainer.click();
    await this.Buttons.ShareButton.click();
  };
};
