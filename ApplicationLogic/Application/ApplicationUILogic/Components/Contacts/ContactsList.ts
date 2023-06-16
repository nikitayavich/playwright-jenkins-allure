import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class ContactsList extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.WorkspaceContainerLocator),
    ListContainer: this.page.locator(this.InheritedFields.ListContainerLocator),
    ContactContextMenu: this.page.locator(this.mainLocators.dropdownLocator),
  };

  Elements = {
    Count: this.Containers.MainContainer.locator('[data-testid*="BreadcrumbCount"]'),
    Contact: this.Containers.ListContainer.locator(this.InheritedFields.ListItemLocator),
    ContactTag: this.Containers.ListContainer.locator('[data-testid="TagIcon"]'),
    ContactByFirstName: (firstName) => this.Containers.ListContainer.locator(`${this.InheritedFields.ListItemLocator} >> _react=[key][item.firstName="${firstName}"]`),
  };

  ContactContextMenuOptions = {
    Delete: this.Containers.ContactContextMenu.locator('"Delete"'),
    SendEmail: this.Containers.ContactContextMenu.locator('"Send e-mail"'),
    Move: this.Containers.ContactContextMenu.locator('"Move"'),
    DeletePermanently: this.Containers.ContactContextMenu.locator('"Delete Permanently"'),
    Restore: this.Containers.ContactContextMenu.locator('"Restore"'),
    Tags: this.Containers.ContactContextMenu.locator('"Tags"'),
    TagMenu: {
      NewTag: this.Containers.ContactContextMenu.locator('"New Tag"'),
    },
  };

  SelectContactContextMenuOption = {
    Delete: async (userMail) => await this.OpenContextMenuAndSelectOption(userMail, this.ContactContextMenuOptions.Delete),
    SendEmail: async (userMail) => await this.OpenContextMenuAndSelectOption(userMail, this.ContactContextMenuOptions.SendEmail),
    Move: async (userMail) => await this.OpenContextMenuAndSelectOption(userMail, this.ContactContextMenuOptions.Move),
    DeletePermanently: async (userMail) => await this.OpenContextMenuAndSelectOption(userMail, this.ContactContextMenuOptions.DeletePermanently),
    Restore: async (userMail) => await this.OpenContextMenuAndSelectOption(userMail, this.ContactContextMenuOptions.Restore),
    NewTag: async (userMail) => await this.OpenContextMenuAndSelectOption(userMail, this.ContactContextMenuOptions.TagMenu.NewTag, this.ContactContextMenuOptions.Tags),
  };

  async OpenContextMenuAndSelectOption(userMail, option, tags?) {
    await this.Elements.Contact.locator(`"${userMail}"`).click({button: 'right'});
    await this.Containers.ContactContextMenu.hover();
    if (tags) {
      tags.hover();
    };
    await option.click();
  };
}

