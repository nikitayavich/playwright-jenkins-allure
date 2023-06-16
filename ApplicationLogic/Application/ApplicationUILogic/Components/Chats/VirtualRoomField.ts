import {Page} from '@playwright/test';
import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class VirtualRoomField extends BaseApplicationPage {
  constructor(page: Page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('[class*="PageContainer"]'),
    ModeratorListContainer: this.page.locator('[class*="ModeratorListContainer"]'),
  };

  Buttons = {
    VirtualRoomLink: this.Containers.MainContainer.locator(`text=Room's link`),
    JoinVirtualRoom: this.Containers.MainContainer.locator('"Join Room"'),
    DeleteVirtualRoom: this.Containers.MainContainer.locator('"Delete Room"'),
    AddModerator: this.Containers.MainContainer.locator('"Add moderator"'),
  };
};
