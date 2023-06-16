import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Space tests', async () => {
  let dateTimePrefix;
  let spaceTitle;
  let spaceTopic;
  let channelTitle;
  let channelTopic;
  let participant;
  const newSpaceName = 'Zextras Company 321';
  const newSpaceTopic = 'Work with playwright';
  const message = 'Hello! We are great team!';
  const titleName = 'Zextras Channel';
  const topicName = 'QA Team';
  const newChannelName = 'New Zextras Channel';
  const newChannelTopic = "About Zextras Automation";

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.chats();
    await CleanConversationsPanel({apiManager});
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    spaceTitle = dateTimePrefix + ' Autotest Space Title';
    spaceTopic = dateTimePrefix + ' Autotest Space Topic';
    channelTitle = dateTimePrefix + ' Autotest Channel Title';
    channelTopic = dateTimePrefix + ' Autotest Channel Topic';
    participant = BaseTest.thirdUser.login;
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Chats);
    await pageManager.sideSecondaryChatsMenu.OpenTab.Spaces();
  });

  test.afterEach(async ({apiManager, page}) => {
    await CleanConversationsPanel({apiManager});
    await page.close();
  });

  async function CleanConversationsPanel({apiManager}) {
    const conversations = await apiManager.chatsAPI.GetConversations();
    await Promise.all(conversations.map(async (conversation) => {
      return apiManager.deleteChatsAPI.DeleteConversation(conversation.id);
    }));
  };

  async function CreateSpace({apiManager}, membersUsernames: string[], title?) {
    const usersIds = await Promise.all(membersUsernames.map(async (username) => apiManager.usersAPI.GetUserId(username)));
    const spaceId = await apiManager.createChatsAPI.CreateSpace(spaceTitle, spaceTopic, usersIds);
    if (title === channelTitle) {
      await apiManager.createChatsAPI.CreateChannel(spaceId, channelTitle, channelTopic);
    };
  };

  async function CreateSpaceAndOpenDetails({pageManager, apiManager}, title) {
    await CreateSpace({apiManager}, [BaseTest.secondUser.login], title);
    if (title === channelTitle) {
      await pageManager.sideSecondaryChatsMenu.Buttons.OpenDropdown.click();
      title = '#' + title;
    };
    await pageManager.sideSecondaryChatsMenu.SelectConversationFromList(title);
  };

  async function MuteNotificationsAndActivate({pageManager, apiManager}, title) {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, title);
    await pageManager.chatsInfo.Buttons.MuteNotifications.click();
    await pageManager.sideSecondaryChatsMenu.ConversationItemDetails.BellOffIcon.waitFor();
    await pageManager.chatsInfo.Buttons.ActivateNotifications.click();
  };

  async function CreateSpaceAndSendMessage({pageManager, apiManager}, title) {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, title);
    await pageManager.chatField.SendCurrentMessage(message);
  };

  async function SendMessageAndClearHistory({pageManager, apiManager}, title) {
    await CreateSpaceAndSendMessage({pageManager, apiManager}, title);
    await pageManager.chatsInfo.Buttons.ClearHistory.click();
    await pageManager.chatsActionsModal.Buttons.ClearHistory.click();
    await pageManager.page.waitForLoadState();
  };

  async function CreateAndDeleteSpace({pageManager, apiManager}, title) {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, title);
    if (title === channelTitle) {
      await pageManager.chatsInfo.Buttons.DeleteChannel.click();
    } else {
      await pageManager.chatsInfo.Buttons.DeleteSpace.click();
    }
    await pageManager.chatsActionsModal.Buttons.Delete.click();
  };

  async function SendMessageAndOpenSpaceAsSecondUser({pageManager, secondPageManager, apiManager}, title) {
    await CreateSpaceAndSendMessage({pageManager, apiManager}, title);
    await secondPageManager.sideMenu.OpenMenuTab(secondPageManager.sideMenu.SideMenuTabs.Chats);
    await secondPageManager.sideSecondaryChatsMenu.OpenTab.Spaces();
    if (title === channelTitle) {
      await secondPageManager.sideSecondaryChatsMenu.Buttons.OpenDropdown.click();
      await secondPageManager.sideSecondaryChatsMenu.SelectConversationFromList('#' + title);
      await secondPageManager.chatField.Buttons.ReloadHistory.click();
    } else {
      await secondPageManager.sideSecondaryChatsMenu.SelectConversationFromList(title);
    };
  };

  test('TC401. Create space. Space should appear in spaces list. @smoke', async ({pageManager, browserName}) => {
    BaseTest.setSuite.smoke();
    test.slow(browserName === 'webkit', 'This feature is slow on Mac');
    await pageManager.headerMenu.SelectOptionInNewItemMenu.CreateNewSpace();
    await pageManager.newChatsModal.CreatedConversations.CreateSpace(BaseTest.secondUser.login, spaceTitle, spaceTopic);
    await expect(pageManager.sideSecondaryChatsMenu.Elements.ConversationItem.locator(`"${spaceTitle}"`)).toBeVisible();
  });

  test('TC402. Delete space. Space should be deleted.', async ({pageManager, apiManager}) => {
    test.slow();
    await CreateAndDeleteSpace({pageManager, apiManager}, spaceTitle);
    await expect(pageManager.sideSecondaryChatsMenu.Elements.ConversationItem).not.toBeVisible();
  });

  test('TC412. Rename space. Space should be renamed in spaces list.', async ({pageManager, apiManager}) => {
    test.slow();
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, spaceTitle);
    await pageManager.chatsInfo.Rename(newSpaceName);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.Name).toHaveText(newSpaceName);
  });

  test('TC413. Mute notifications in space. The space must to have a mute icon', async ({pageManager, apiManager}) => {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, spaceTitle);
    await pageManager.chatsInfo.Buttons.MuteNotifications.click();
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.BellOffIcon).toBeVisible();
  });

  test('TC414. Activate notifications in space. The space must not have a mute icon ', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await MuteNotificationsAndActivate({pageManager, apiManager}, spaceTitle);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.BellOffIcon).not.toBeVisible();
  });

  test('TC415. Clear history for current user in space. Chat field must be empty', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await SendMessageAndClearHistory({pageManager, apiManager}, spaceTitle);
    await expect(pageManager.chatField.Elements.MessageBubble).not.toBeVisible();
  });

  test('TC416. Add new member in space. New member must be visible in space info.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, spaceTitle);
    await pageManager.chatsInfo.Buttons.AddNewMembers.click();
    await pageManager.addNewMembersModal.AddNewMember(participant);
    await expect(pageManager.chatsInfo.Items.Member.locator(`"${participant}"`)).toHaveCount(1);
  });

  test('TC417. Change topic in space. Topic in space should be changed in spaces list.', async ({pageManager, apiManager}) => {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, spaceTitle);
    await pageManager.chatsInfo.ChangeTopic(newSpaceTopic);
    await expect(pageManager.chatsInfo.Items.TopicName.locator(`"${newSpaceTopic}"`).first()).toBeVisible();
  });

  test('TC418. Add channel in space. Channel should be visible in spaces list in space. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, spaceTitle);
    await pageManager.chatsInfo.Buttons.AddChannel.click();
    await pageManager.newChannelModal.CreateNewChannel(titleName, topicName);
    await pageManager.sideSecondaryChatsMenu.Buttons.OpenDropdown.click();
    await expect(pageManager.sideSecondaryChatsMenu.Elements.ConversationItem.locator(`"#${titleName}"`)).toBeVisible();
  });

  test('TC421. Mute notifications in channel. The channel must to have a mute icon', async ({pageManager, apiManager}) => {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, channelTitle);
    await pageManager.chatsInfo.Buttons.MuteNotifications.click();
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.BellOffIcon).toBeVisible();
  });

  test('TC422. Activate notifications in channel. The channel must not have a mute icon', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await MuteNotificationsAndActivate({pageManager, apiManager}, channelTitle);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.BellOffIcon).not.toBeVisible();
  });

  test('TC423. Change topic in channel. Topic in channel should be changed in spaces list.', async ({pageManager, apiManager}) => {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, channelTitle);
    await pageManager.chatsInfo.ChangeTopic(newChannelTopic);
    await expect(pageManager.chatsInfo.Items.TopicName.locator(`"${newChannelTopic}"`).first()).toBeVisible();
  });

  test('TC424. Rename channel. Channel should be renamed in spaces list.', async ({pageManager, apiManager}) => {
    await CreateSpaceAndOpenDetails({pageManager, apiManager}, channelTitle);
    await pageManager.chatsInfo.Rename(newChannelName);
    await expect(pageManager.sideSecondaryChatsMenu.Elements.ConversationItem.locator(`"#${newChannelName}"`)).toBeVisible();
  });

  test('TC425. Clear history for current user in channel. Chat field must be empty', async ({pageManager, apiManager}) => {
    await SendMessageAndClearHistory({pageManager, apiManager}, channelTitle);
    await expect(pageManager.chatField.Elements.MessageBubble).not.toBeVisible();
  });
  // Issue #44
  test.skip('TC426. Delete channel. Channel should be deleted from space tab.', async ({pageManager, apiManager}) => {
    await CreateAndDeleteSpace({pageManager, apiManager}, channelTitle);
    await expect(pageManager.sideSecondaryChatsMenu.Elements.ConversationItem.locator(`"#${channelTitle}"`)).not.toBeVisible();
  });

  test('TC434. Send a message in space. Sent message should be visible in Chat field. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    await CreateSpaceAndSendMessage({pageManager, apiManager}, spaceTitle);
    await expect(pageManager.chatField.Elements.MessageBubble).toContainText(message);
  });

  test('TC435. Get a message in space. Sent message should be visible in Chat field. @criticalPath', async ({pageManager, secondPageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await SendMessageAndOpenSpaceAsSecondUser({pageManager, secondPageManager, apiManager}, spaceTitle);
    await expect(secondPageManager.chatField.Elements.MessageBubble).toContainText(message);
  });

  test('TC436. Send a message in channel. Sent message should be visible in Chat field.', async ({pageManager, apiManager}) => {
    await CreateSpaceAndSendMessage({pageManager, apiManager}, channelTitle);
    await expect(pageManager.chatField.Elements.MessageBubble).toContainText(message);
  });

  test('TC437. Get a message in channel. Sent message should be visible in Chat field. @criticalPath', async ({pageManager, secondPageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await SendMessageAndOpenSpaceAsSecondUser({pageManager, secondPageManager, apiManager}, channelTitle);
    await expect(secondPageManager.chatField.Elements.MessageBubble).toContainText(message);
  });

  test('TC444. Remove member from space via "Remove Member" button. Removed member is not shown in members list in space.', async ({pageManager, apiManager}) => {
    await CreateSpace({apiManager}, [BaseTest.secondUser.login]);
    await pageManager.sideSecondaryChatsMenu.SelectConversationFromList(spaceTitle);
    await pageManager.chatsInfo.Buttons.RemoveMemberWithUsername(BaseTest.secondUser.login).click();
    await pageManager.chatsActionsModal.Buttons.Remove.click();
    await expect(pageManager.chatsInfo.Items.MemberCardWithUsername(BaseTest.secondUser.login)).not.toBeVisible();
  });
});
