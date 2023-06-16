import {Page} from '@playwright/test';
import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class NewChannelModal extends ModalWindowBase {
  constructor(page: Page) {
    super(page);
  };

  Textboxes = {
    Title: this.Containers.MainContainer.locator('[name="Title"]'),
    Topic: this.Containers.MainContainer.locator('[name="Topic"]'),
  };

  Buttons = {
    CreateButton: this.Containers.MainContainer.locator('[title="Create"]'),
  };

  async CreateNewChannel(titleName, topicName) {
    await this.Textboxes.Title.fill(titleName);
    await this.Textboxes.Topic.fill(topicName);
    await this.Buttons.CreateButton.click();
  };
}
