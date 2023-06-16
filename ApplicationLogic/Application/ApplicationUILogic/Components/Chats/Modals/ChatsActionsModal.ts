import {Page} from '@playwright/test';
import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class ChatsActionsModal extends ModalWindowBase {
  constructor(page: Page) {
    super(page);
  };

  Buttons = {
    ClearHistory: this.Containers.MainContainer.locator('button:has-text("Clear History")'),
    Leave: this.Containers.MainContainer.locator('"Leave"'),
    Delete: this.Containers.MainContainer.locator('"Delete"'),
    Remove: this.Containers.MainContainer.locator('"Remove"'),
  };
}
