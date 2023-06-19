import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';
import {PageManager} from '../../../ApplicationLogic/Application/ApplicationUILogic/Pages/PageManager';

test.describe('Virtual Rooms tests', async () => {
  let dateTimePrefix;
  let virtualRoomTitle;

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.chats();
    await CleanConversationsPanel({apiManager});
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    virtualRoomTitle = dateTimePrefix + ' Autotest Group Topic';
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Chats);
  });

  test.afterEach(async ({apiManager, page}) => {
    await CleanConversationsPanel({apiManager});
    await page.close();
  });

  async function CleanConversationsPanel({apiManager}) {
    const conversations = await apiManager.chatsAPI.GetConversations();
    await Promise.all(conversations.map(async (conversation) => {
      return apiManager.deleteChatsAPI.DeleteGroup(conversation.id);
    }));
  };

  async function CreateVirtualRoom({pageManager}, title) {
    await pageManager.sideSecondaryChatsMenu.Buttons.CreateVirtualRoom.click();
    await pageManager.newVirtualRoomsModal.CreateVirtualRoom(title);
  };

  async function CreateVirtualRoomAndOpenDetails({apiManager, pageManager}) {
    await apiManager.createChatsAPI.CreateVirtualRoom(virtualRoomTitle);
    await pageManager.sideSecondaryChatsMenu.OpenTab.VirtualRooms();
    await pageManager.sideSecondaryChatsMenu.Elements.VirtualRoomItem.click();
  };

  async function CreateVirtualRoomAndClickAddModerator({pageManager, apiManager}) {
    await CreateVirtualRoomAndOpenDetails({apiManager, pageManager});
    await pageManager.virtualRoomField.Buttons.AddModerator.click();
  };

  async function JoinVirtualRoomAndGetMeetingPage({pageManager, page}) {
    const [meetingPage] = await Promise.all([
      page.context().waitForEvent('page'),
      pageManager.virtualRoomField.Buttons.JoinVirtualRoom.click(),
    ]);
    await meetingPage.waitForLoadState();
    return meetingPage;
  };

  async function CreateAndJoinVirtualRoom({pageManager, apiManager, page}) {
    await CreateVirtualRoomAndOpenDetails({apiManager, pageManager});
    const meetingPage = await JoinVirtualRoomAndGetMeetingPage({pageManager, page});
    return new PageManager(meetingPage);
  };

  async function EnterMeetingRoom({pageManager, apiManager, page}) {
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.Enter.click();
    return meetingPageManager;
  };
  // Virtual room does not appear in Virtual Rooms Tab,  Virtual room tab does not appear
  test('TC419. Create virtual room. Virtual room should be visible in Virtual Rooms Tab. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    test.fail(true, 'Virtual room does not appear in Virtual Rooms Tab,  Virtual room tab does not appear');
    await CreateVirtualRoom({pageManager}, virtualRoomTitle);
    await pageManager.sideSecondaryChatsMenu.OpenTab.VirtualRooms();
    await expect(pageManager.sideSecondaryChatsMenu.Elements.ConversationsItem.locator(`"${virtualRoomTitle}"`)).toBeVisible();
  });

  test('TC420. Copy Virtual room link. Virtual room link should be in clipboard.', async ({page, pageManager, apiManager, browserName}) => {
    test.skip(browserName === 'webkit' || browserName === 'firefox', 'A bug related to permissions.');
    await CreateVirtualRoomAndOpenDetails({apiManager, pageManager});
    await pageManager.virtualRoomField.Buttons.VirtualRoomLink.click();
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    const meetingPage = await JoinVirtualRoomAndGetMeetingPage({pageManager, page});
    expect(clipboardContent).toBe(meetingPage.url());
  });

  test('TC427. Delete Virtual room. Virtual room should not be visible in Virtual Rooms Tab.', async ({pageManager, apiManager}) => {
    await CreateVirtualRoomAndOpenDetails({apiManager, pageManager});
    await pageManager.virtualRoomField.Buttons.DeleteVirtualRoom.click();
    await pageManager.chatsActionsModal.Buttons.Delete.click();
    await expect(pageManager.sideSecondaryChatsMenu.Elements.VirtualRoomItem.locator(`"${virtualRoomTitle}"`)).not.toBeVisible();
  });
  // New moderator does not appear in Virtual Room
  test.skip('TC447. Add moderator in virtual room. Moderator should appear in moderators list', async ({pageManager, apiManager}) => {
    await CreateVirtualRoomAndClickAddModerator({pageManager, apiManager});
    await pageManager.addNewMembersModal.AddNewModerator(BaseTest.secondUser.login);
    await expect(await pageManager.virtualRoomField.Containers.ModeratorListContainer.locator(`"${BaseTest.secondUser.login}"`), 'Moderator should appear in moderators list').toBeVisible();
  });

  test('TC448. Enter mail in dropdown field in modal "Add moderators". Dropdown mail should equal to the entered mail.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await CreateVirtualRoomAndClickAddModerator({pageManager, apiManager});
    await pageManager.addNewMembersModal.Fields.AddModeratorField.type(BaseTest.secondUser.login);
    await expect(pageManager.addNewMembersModal.Participants.Moderator.locator(`"${BaseTest.secondUser.login}"`).first(), 'Dropdown mail should equal to the entered mail').toBeVisible();
  });

  test('TC449. Click on [Enable video] button in modal join virtual room. Icon [Disabled video] should disappear.', async ({pageManager, apiManager, page, browserName}) => {
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.VideoOnButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.Icons.IconVideoOff, 'Icon [Disabled video] should disappear.').not.toBeVisible();
  });

  test('TC450. Click on [Disable video] button in modal join virtual room. Icon [Disabled video] should be visible.', async ({pageManager, apiManager, page, browserName}) => {
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.VideoOnButton.click();
    await meetingPageManager.joinVirtualRoomModal.Buttons.VideoOffButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.Icons.IconVideoOff, 'Icon [Disabled video] should be visible.').toBeVisible();
  });

  test('TC451. Click on [Enable audio] button in modal join virtual room. Icon [Disabled audio] should disappear.', async ({pageManager, apiManager, page, browserName}) => {
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOnButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.Icons.IconMicOff, 'Icon [Disabled audio] should disappear.').not.toBeVisible();
  });

  test('TC452. Click on [Disable audio] button in modal join virtual room.  Icon [Disabled audio] should be visible.', async ({pageManager, apiManager, page, browserName}) => {
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOnButton.click();
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOffButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.Icons.IconMicOff, 'Icon [Disabled audio] should be visible.').toBeVisible();
  });

  test('TC453. Click on [Enable video] button in modal join virtual room. Video should be enabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.VideoOnButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.States.HasVideo, 'Video should be enabled.').toBeVisible();
  });

  test('TC454. Click on [Disable video] button in modal join virtual room. Video should be disabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.VideoOnButton.click();
    await meetingPageManager.joinVirtualRoomModal.Buttons.VideoOffButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.States.HasVideo, 'Video should be disable.').not.toBeVisible();
  });

  test('TC455. Click on [Enable audio] button in modal join virtual room. Audio should be enabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOnButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.States.HasAudio, 'Audio should be enabled.').toBeVisible();
  });

  test('TC456. Click on [Disable audio] button in modal join virtual room.  Audio should be disabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOnButton.click();
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOffButton.click();
    await expect(meetingPageManager.joinVirtualRoomModal.States.HasAudio, 'Audio should be disabled.').not.toBeVisible();
  });

  test('TC457. Click on [Enable audio] button in modal join virtual room. Button [start microphone test] should be enabled.', async ({pageManager, apiManager, page, browserName}) => {
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOnButton.click();
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOffButton.waitFor();
    await expect(meetingPageManager.joinVirtualRoomModal.Buttons.StartMicroTest, 'Button [start microphone test] should be enabled.').toBeEnabled();
  });

  test('TC458. Click on [Disable audio] button in modal join virtual room. Button [start microphone test] should be disabled.', async ({pageManager, apiManager, page, browserName}) => {
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await CreateAndJoinVirtualRoom({pageManager, apiManager, page});
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOnButton.click();
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOffButton.click();
    await meetingPageManager.joinVirtualRoomModal.Buttons.MicOnButton.waitFor();
    await expect(meetingPageManager.joinVirtualRoomModal.Buttons.StartMicroTest, 'Button [start microphone test] should be disabled.').toBeDisabled();
  });

  test('TC459. Click on [ENTER] button in modal join virtual room. New page with meeting should be opened. @smoke', async ({pageManager, apiManager, page}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await expect(meetingPageManager.meetingPage.Containers.MainContainer, "New page with meeting should be opened").toBeVisible();
  });

  test('TC460. Close new meeting. New page with information about the end of meeting should appear. @criticalPath', async ({pageManager, apiManager, page}) => {
    BaseTest.doubleTimeout();
    BaseTest.setSuite.criticalPath();
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await meetingPageManager.meetingPage.Buttons.CloseCall.click();
    await expect(meetingPageManager.meetingPage.Containers.InfoPageContainer, "New page with information about the end of meeting should appear.").toBeVisible();
  });

  test('TC461. Click on [Enable video] button in new meeting. Video should be enabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.doubleTimeout();
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await meetingPageManager.meetingPage.Buttons.EnableVideo.click();
    await expect(meetingPageManager.meetingPage.States.HasVideo, 'Video should be enabled.').toBeVisible();
  });

  test('TC462. Click on [Enable audio] button in new meeting. Audio should be enabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.doubleTimeout();
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await meetingPageManager.meetingPage.Buttons.EnableAudio.click();
    await expect(meetingPageManager.meetingPage.States.AudioMuted, 'Audio should be enabled.').not.toBeVisible();
  });

  test('TC463. Click on [Disable video] button in new meeting. Video should be disabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.doubleTimeout();
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await meetingPageManager.meetingPage.Buttons.EnableVideo.click();
    await meetingPageManager.meetingPage.Buttons.DisableVideo.click();
    await expect(meetingPageManager.meetingPage.States.HasVideo, 'Video should be disabled.').not.toBeVisible();
  });

  test('TC464. Click on [Disable audio] button in new meeting. Audio should be disabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.doubleTimeout();
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await meetingPageManager.meetingPage.Buttons.EnableAudio.click();
    await meetingPageManager.meetingPage.Buttons.DisableAudio.click();
    await expect(meetingPageManager.meetingPage.States.AudioMuted, 'Audio should be disabled.').toBeVisible();
  });

  test('TC465. Click on [Enable Screen Sharing] button in new meeting. Screen Sharing should be enabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.doubleTimeout();
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await meetingPageManager.meetingPage.Buttons.EnableScreenSharing.click();
    await expect(meetingPageManager.meetingPage.States.ScreenShare, 'Screen Sharing should be enabled.').toBeVisible();
  });

  test('TC466. Click on [Disable Screen Sharing] button in new meeting. Screen Sharing should be disabled. @criticalPath', async ({pageManager, apiManager, page, browserName}) => {
    BaseTest.doubleTimeout();
    BaseTest.setSuite.criticalPath();
    test.skip(browserName === 'webkit', 'A bug related to permissions.');
    const meetingPageManager = await EnterMeetingRoom({pageManager, apiManager, page});
    await meetingPageManager.meetingPage.Buttons.EnableScreenSharing.click();
    await meetingPageManager.meetingPage.Buttons.DisableScreenSharing.click();
    await expect(meetingPageManager.meetingPage.States.ScreenShare, 'Screen Sharing should be disabled.').not.toBeVisible();
  });
});
