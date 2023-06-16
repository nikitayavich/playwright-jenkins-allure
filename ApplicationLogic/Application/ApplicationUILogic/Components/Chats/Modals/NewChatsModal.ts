import {Page} from '@playwright/test';
import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class NewChatsModal extends ModalWindowBase {
  constructor(page: Page) {
    super(page);
  };

  Buttons = {
    Create: this.Containers.MainContainer.locator('"Create"'),
  };

  Textboxes = {
    NewChatUserListFilter: this.Containers.MainContainer.locator('[name="Type to filter the list"]'),
    UserListFilter: this.Containers.MainContainer.locator('[name="Start typing to pick an address"]'),
    Title: this.Containers.MainContainer.locator('[name="Title"]'),
    Topic: this.Containers.MainContainer.locator('[name="Topic"]'),
  };

  Elements = {
    NewChatFilteredListItem: this.Containers.MainContainer.locator('[class*="SearchCard"]'),
    FilteredListItem: this.page.locator(this.InheritedFields.SearchedContactLocator),
    SelectedUser: this.Containers.MainContainer.locator('[class*="CustomChip"]'),
  };

  async CreateItem(participant, participant2?, title?, topic?) {
    if (topic) {
      await this.Textboxes.Title.fill(title);
      await this.Textboxes.Topic.fill(topic);
      await this.Textboxes.UserListFilter.type(participant);
      await this.Elements.FilteredListItem.locator('nth=0').click();
      await this.Buttons.Create.click();
    } else if (title) {
      await this.Textboxes.Title.fill(title);
      await this.Textboxes.UserListFilter.type(participant);
      await this.Elements.FilteredListItem.locator('nth=0').click();
      await this.Elements.SelectedUser.waitFor();
      await this.Textboxes.UserListFilter.type(participant2);
      await this.Elements.FilteredListItem.locator('nth=0').click();
      await this.Buttons.Create.click();
    } else if (participant) {
      await this.Textboxes.NewChatUserListFilter.fill(participant);
      await this.Elements.NewChatFilteredListItem.locator('nth=-1').click();
      await this.Buttons.Create.click();
    } else {
      console.log('Incorrect option');
    };
  };

  CreatedConversations = {
    CreateChat: async (participant) => await this.CreateItem(participant),
    CreateGroup: async (participant, participant2, title) => await this.CreateItem(participant, participant2, title),
    CreateSpace: async (participant, title, topic) => await this.CreateItem(participant, undefined, title, topic),
  };
}
