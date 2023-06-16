import {Page} from '@playwright/test';
import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class MeetingPage extends BaseApplicationPage {
  constructor(page: Page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('[class*="MeetingPageController"]'),
    InfoPageContainer: this.page.locator('[class*="ErrorWrapper"]'),
    MeetingParticipantsContainer: this.page.locator('[class*="WrapperContainer"]'),
    MeetingActions: this.page.locator('[class*="MeetingActions__CustomContainer"]'),
  };

  Buttons = {
    CloseCall: this.Containers.MeetingActions.locator('[title="Close this call"]'),
    DisableAudio: this.Containers.MeetingActions.locator('[title="Disable Audio"]'),
    EnableAudio: this.Containers.MeetingActions.locator('[title="Enable Audio"]'),
    DisableVideo: this.Containers.MeetingActions.locator('[title="Disable Video"]'),
    EnableVideo: this.Containers.MeetingActions.locator('[title="Enable Video"]'),
    EnableScreenSharing: this.Containers.MeetingActions.locator('[title="Enable Screen Sharing"]'),
    DisableScreenSharing: this.Containers.MeetingActions.locator('[title="Disable Screen Sharing"]'),
  };

  States = {
    MeetingActionsIsHovering: this.Containers.MeetingActions.locator('_react=[isHoovering=true]').first(),
    HasVideo: this.Containers.MeetingParticipantsContainer.locator('_react=[hasVideo=true]').first(),
    AudioMuted: this.Containers.MeetingParticipantsContainer.locator('_react=[audioMuted=true]').first(),
    ScreenShare: this.Containers.MeetingParticipantsContainer.locator('_react=[screenshare=true]').first(),
  };
};
