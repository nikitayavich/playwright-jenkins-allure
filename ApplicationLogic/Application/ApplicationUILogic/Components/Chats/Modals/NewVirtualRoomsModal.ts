import {Page} from '@playwright/test';
import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class NewVirtualRoomsModal extends ModalWindowBase {
  constructor(page: Page) {
    super(page);
  };

  Buttons = {
    Create: this.Containers.MainContainer.locator('"Create"'),
  };

  NewVirtualRoomDialog = {
    NameTextbox: this.Containers.MainContainer.locator(`[name="Room's name*"]`),
  };

  async CreateVirtualRoom(title) {
    await this.NewVirtualRoomDialog.NameTextbox.fill(title);
    await this.Buttons.Create.click();
  };
};
