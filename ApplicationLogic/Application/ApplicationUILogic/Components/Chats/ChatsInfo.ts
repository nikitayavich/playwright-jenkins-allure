import {Page} from '@playwright/test';
import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class ChatsInfo extends BaseApplicationPage {
  constructor(page: Page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.ChatInfoContainerLocator),
    MembersContainer: this.page.locator(this.InheritedFields.ChatMembersContainerLocator),
  };

  Buttons = {
    DeleteSpace: this.Containers.MainContainer.locator('"Delete Space"'),
    DeleteChannel: this.Containers.MainContainer.locator('"Delete Channel"'),
    RemoveMember: this.Containers.MainContainer.locator('[data-testid*="Trash2Outline"]'),
    RemoveMemberWithUsername: (memberUsername) => this.Items.MemberCardWithUsername(memberUsername).locator('[data-testid*="Trash2Outline"]'),
    DeleteGroup: this.Containers.MainContainer.locator('"Delete Group"'),
    EditButton: this.Containers.MainContainer.locator('[title="Edit info"]'),
    AddNewMembers: this.Containers.MainContainer.locator('"Add new members"'),
    MuteNotifications: this.Containers.MainContainer.locator('"Mute notifications"'),
    ActivateNotifications: this.Containers.MainContainer.locator('"Activate notifications"'),
    ClearHistory: this.Containers.MainContainer.locator('"Clear History"'),
    LeaveGroup: this.Containers.MainContainer.locator('"Leave Group"'),
    SaveNewName: this.Containers.MainContainer.locator('[data-testid*="SaveOutline"]'),
    AddChannel: this.Containers.MainContainer.locator('"Add Channel"'),
    SearchForParticipant: this.Containers.MainContainer.locator('[data-testid*="Search"]'),
  };

  TextBoxes = {
    EditNameField: this.Containers.MainContainer.locator('[name="Name"]'),
    EditTopicField: this.Containers.MainContainer.locator('[name="Topic"]'),
    SearchForParticipantField: this.Containers.MainContainer.locator('[class^="ParticipantListFilter"]'),
  };

  Items = {
    Member: this.Containers.MembersContainer.locator('_react=[key^="participantListCardItem"]'),
    MemberCardWithUsername: (memberUsername) => this.Items.Member.filter({has: this.page.locator(`"${memberUsername}"`)}),
    TopicName: this.page.locator('[overflow="ellipsis"]+[overflow="break-word"]'),
    UsernameInSearchResults: this.Containers.MembersContainer.locator('_react=[key^="filteredListCardItem"]').locator('[color="text"]'),
  };

  async Rename(newName) {
    await this.Buttons.EditButton.click();
    await this.TextBoxes.EditNameField.fill(newName);
    await this.Buttons.SaveNewName.click();
  };

  async ChangeTopic(newName) {
    await this.Buttons.EditButton.click();
    await this.TextBoxes.EditTopicField.fill(newName);
    await this.Buttons.SaveNewName.click();
  };
}
