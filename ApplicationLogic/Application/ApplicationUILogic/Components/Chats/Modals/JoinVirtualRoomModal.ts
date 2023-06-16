import {Page} from '@playwright/test';
import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class JoinVirtualRoomModal extends ModalWindowBase {
  constructor(page: Page) {
    super(page);
  };

  VideoContainer = this.Containers.MainContainer.locator('[class^="ExternalMeetingStart"]');

  Buttons = {
    VideoOnButton: this.Containers.MainContainer.locator('[title="Enable Video"]'),
    VideoOffButton: this.Containers.MainContainer.locator('[title="Disable Video"]'),
    MicOnButton: this.Containers.MainContainer.locator('[title="Enable Audio"]'),
    MicOffButton: this.Containers.MainContainer.locator('[title="Disable Audio"]'),
    Enter: this.Containers.MainContainer.locator('"Enter"'),
    StartMicroTest: this.Containers.MainContainer.locator('[title="Start microphone test"]'),
  };

  Icons = {
    IconVideoOff: this.Containers.MainContainer.locator('[data-testid*="VideoOffOutline"]'),
    IconMicOff: this.Containers.MainContainer.locator('[data-testid*="MicOffOutline"]'),
  };

  States = {
    HasVideo: this.VideoContainer.locator('_react=[hasVideo=true]').first(),
    HasAudio: this.VideoContainer.locator('_react=[hasAudio=true]').first(),
  };
};
