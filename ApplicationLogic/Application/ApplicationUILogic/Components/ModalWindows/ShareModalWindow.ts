import {ModalWindowBase} from './ModalWindowBase';

export class ShareModalWindow extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    ShareButton: this.Containers.MainContainer.locator('xpath=//button/*[contains(text(), "Share")]'),
  };

  ShareWithDropdown = {
    OpenClose: this.Containers.MainContainer.locator('"Share with"'),
    UsersDropdown: this.page.locator(this.mainLocators.dropdownLocator),
  };

  TextBoxes = {
    Recipients: this.Containers.MainContainer.locator('text=e-mail addresses'),
    NoteMessage: this.Containers.MainContainer.locator('[name="Add a note to the standard message"]'),
  };

  CheckBoxes = {
    NotificationAboutShare: this.Containers.MainContainer.locator('"Send notification about this share"'),
  };

  async Share(recipient) {
    await this.TextBoxes.Recipients.fill(recipient);
    await this.ShareWithDropdown.OpenClose.click();
    await this.Buttons.ShareButton.click();
  };
}
