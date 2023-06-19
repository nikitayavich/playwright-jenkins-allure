import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Chats tests', async () => {
  let dateTimePrefix;
  let groupTitle;
  let firstParticipant;
  let secondParticipant;
  let thirdParticipant;
  const newGroupTitle = 'Zextras Company 321';
  const message = 'Hello! We are great team!';

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.chats();
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    groupTitle = dateTimePrefix + ' Autotest Group Topic';
    firstParticipant = BaseTest.secondUser.login;
    secondParticipant = BaseTest.thirdUser.login;
    thirdParticipant = BaseTest.fourthUser.login;
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Chats);
    await CleanConversationsPanel({apiManager});
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
    await Promise.all(conversations.map(async (conversation) => {
      const users = await apiManager.chatsAPI.GetUsers();
      return apiManager.deleteChatsAPI.KickMembers(conversation.id, users);
    }));
    await Promise.all(conversations.map(async (conversation) => {
      return apiManager.deleteChatsAPI.DeleteGroup(conversation.id);
    }));
    await Promise.all(conversations.map(async (conversation) => {
      return apiManager.deleteChatsAPI.ClearConversation(conversation.id);
    }));
  };

  async function DeleteAllMembers({pageManager}) {
    const neededRemoveMember = pageManager.chatsInfo.Buttons.RemoveMember.locator('nth=0');
    await neededRemoveMember.click();
    await pageManager.chatsActionsModal.Buttons.Remove.click();
    await pageManager.page.waitForLoadState();
    await expect(pageManager.chatsInfo.Items.Member).toHaveCount(2);
    await neededRemoveMember.click();
    await pageManager.chatsActionsModal.Buttons.Remove.click();
    await pageManager.chatsInfo.Buttons.DeleteGroup.click();
    await pageManager.chatsActionsModal.Buttons.Leave.click();
  };

  async function CreateConversation({pageManager, apiManager}, mark) {
    if (mark === groupTitle) {
      const userIds = [await apiManager.usersAPI.GetUserId(BaseTest.secondUser.login), await apiManager.usersAPI.GetUserId(BaseTest.thirdUser.login)];
      await apiManager.createChatsAPI.CreateGroup(groupTitle, userIds);
      await pageManager.page.waitForLoadState();
    } else {
      await pageManager.headerMenu.SelectOptionInNewItemMenu.CreateNewChat();
      await pageManager.newChatsModal.CreatedConversations.CreateChat(mark);
    };
  };

  async function CreateConversationAndOpenDetails({pageManager, apiManager}, mark) {
    await CreateConversation({pageManager, apiManager}, mark);
    await pageManager.sideSecondaryChatsMenu.SelectConversationFromList(mark);
  };

  async function CreateChats({pageManager}, participants) {
    for (const participant of participants) {
      await pageManager.headerMenu.SelectOptionInNewItemMenu.CreateNewChat();
      await pageManager.newChatsModal.CreatedConversations.CreateChat(participant);
      await pageManager.sideSecondaryChatsMenu.Elements.ConversationItem.locator(`"${participant}"`).waitFor();
    }
  };

  async function CreateConversationAndSendMessage({pageManager, apiManager}, mark) {
    await CreateConversationAndOpenDetails({pageManager, apiManager}, mark);
    await pageManager.chatField.SendCurrentMessage(message);
  };

  async function SendMessageAndClearHistory({pageManager, apiManager}, mark) {
    await CreateConversationAndSendMessage({pageManager, apiManager}, mark);
    await pageManager.chatsInfo.Buttons.ClearHistory.click();
    await pageManager.chatsActionsModal.Buttons.ClearHistory.click();
    await pageManager.page.waitForLoadState();
  };

  async function MuteNotificationAndActivate({pageManager, apiManager}, mark) {
    await CreateConversationAndOpenDetails({pageManager, apiManager}, mark);
    await pageManager.chatsInfo.Buttons.MuteNotifications.click();
    await pageManager.chatsInfo.Buttons.ActivateNotifications.click();
  };

  async function SendMessageAndOpenConversationAsSecondUser({pageManager, secondPageManager, apiManager}, mark, secondMark?) {
    await CreateConversationAndSendMessage({pageManager, apiManager}, mark);
    await secondPageManager.sideMenu.OpenMenuTab(secondPageManager.sideMenu.SideMenuTabs.Chats);
    if (secondMark) {
      await secondPageManager.sideSecondaryChatsMenu.SelectConversationFromList(secondMark);
    } else {
      await secondPageManager.sideSecondaryChatsMenu.SelectConversationFromList(mark);
    };
  };

  test('TC403. Create chat. Conversation should be in Chats Tab. @smoke', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await CreateConversation({pageManager, apiManager}, firstParticipant);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.Name.locator(`"${firstParticipant}"`)).toBeVisible();
  });

  test('TC404. Create group. Group should be in Chats Tab. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await pageManager.headerMenu.SelectOptionInNewItemMenu.CreateNewGroup();
    await pageManager.newChatsModal.CreatedConversations.CreateGroup(BaseTest.secondUser.login, BaseTest.thirdUser.login, groupTitle);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.Name.locator(`"${groupTitle}"`)).toBeVisible();
  });

  test('TC405. Delete group. Group should be removed from Chats Tab.', async ({pageManager, apiManager}) => {
    test.slow();
    await CreateConversationAndOpenDetails({pageManager, apiManager}, groupTitle);
    await DeleteAllMembers({pageManager});
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.Name.locator(`"${groupTitle}"`)).not.toBeVisible();
  });

  test('TC406. Change group topic. Group topic should be changed in Chats Tab.', async ({pageManager, apiManager}) => {
    await CreateConversationAndOpenDetails({pageManager, apiManager}, groupTitle);
    await pageManager.chatsInfo.ChangeTopic(newGroupTitle);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.Name.locator(`"${newGroupTitle}"`)).toBeVisible;
  });

  test('TC407. Mute notifications in group. The group should to have a mute icon', async ({pageManager, apiManager}) => {
    await CreateConversationAndOpenDetails({pageManager, apiManager}, groupTitle);
    await pageManager.chatsInfo.Buttons.MuteNotifications.click();
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.BellOffIcon).toBeVisible();
  });

  test('TC408. Activate notifications in group. The group should not have a mute icon ', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await MuteNotificationAndActivate({pageManager, apiManager}, groupTitle);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.BellOffIcon).not.toBeVisible();
  });

  test('TC409. Clear history for current user in group. Chat field must be empty', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await SendMessageAndClearHistory({pageManager, apiManager}, groupTitle);
    await expect(pageManager.chatField.Elements.MessageBubble).not.toBeVisible();
  });

  test('TC410. Add new member in group. New member should be visible in group info.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await CreateConversationAndOpenDetails({pageManager, apiManager}, groupTitle);
    await pageManager.chatsInfo.Buttons.AddNewMembers.click();
    await pageManager.addNewMembersModal.AddNewMember(thirdParticipant);
    await expect(pageManager.chatsInfo.Items.Member.locator(`"${thirdParticipant}"`)).toHaveCount(1);
  });

  test('TC411. Filter chats list. Only needed chat should be visible in Chats Tab.', async ({pageManager}) => {
    BaseTest.doubleTimeout();
    await CreateChats({pageManager}, [secondParticipant, thirdParticipant]);
    await pageManager.sideSecondaryChatsMenu.Textboxes.FilterChatsList.fill(thirdParticipant);
    await expect(pageManager.sideSecondaryChatsMenu.ConversationItemDetails.Name).toHaveText(thirdParticipant);
    await expect(pageManager.sideSecondaryChatsMenu.Elements.ConversationItem.locator(`"${secondParticipant}"`)).toHaveCount(0);
  });

  test('TC429. Send a message in chat. Sent message should be visible in Chat field. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await CreateConversationAndSendMessage({pageManager, apiManager}, BaseTest.secondUser.login);
    await expect(pageManager.chatField.Elements.MessageBubble.last()).toContainText(message);
  });

  test('TC430. Get a message in chat. Sent message should be visible in Chat field. @criticalPath', async ({pageManager, secondPageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await SendMessageAndOpenConversationAsSecondUser({pageManager, secondPageManager, apiManager}, BaseTest.secondUser.login, BaseTest.userForLogin.login);
    await expect(secondPageManager.chatField.Elements.MessageBubble.last()).toContainText(message);
  });

  test('TC438. Clear history for current user in chat. Chat field should be empty', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await SendMessageAndClearHistory({pageManager, apiManager}, firstParticipant);
    await expect(pageManager.chatField.Elements.MessageBubble).not.toBeVisible();
  });

  test('TC439. Send a message in group. Sent message should be visible in Chat field. @criticalPath', async ({pageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    await CreateConversationAndSendMessage({pageManager, apiManager}, groupTitle);
    await expect(pageManager.chatField.Elements.MessageBubble).toContainText(message);
  });

  test('TC440. Get a message in group. Sent message should be visible in Chat field. @criticalPath', async ({pageManager, secondPageManager, apiManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await SendMessageAndOpenConversationAsSecondUser({pageManager, secondPageManager, apiManager}, groupTitle);
    await expect(secondPageManager.chatField.Elements.MessageBubble).toContainText(message);
  });

  test('TC443. Remove member from group via “Remove Member“ button. Removed member is not shown in members list in group.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await CreateConversationAndOpenDetails({pageManager, apiManager}, groupTitle);
    await pageManager.chatsInfo.Buttons.RemoveMemberWithUsername(BaseTest.secondUser.login).click();
    await pageManager.chatsActionsModal.Buttons.Remove.click();
    await expect(pageManager.chatsInfo.Items.MemberCardWithUsername(BaseTest.secondUser.login)).not.toBeVisible();
  });

  test('TC445. Enter member username in search field in members list in group. Only member with matching username is shown in members list in group.', async ({pageManager, apiManager}) => {
    await CreateConversationAndOpenDetails({pageManager, apiManager}, groupTitle);
    BaseTest.doubleTimeout();
    await pageManager.chatsInfo.Buttons.SearchForParticipant.click();
    await pageManager.chatsInfo.TextBoxes.SearchForParticipantField.fill(BaseTest.secondUser.login);
    await expect(pageManager.chatsInfo.Items.UsernameInSearchResults).toHaveText(BaseTest.secondUser.login);
  });
});
