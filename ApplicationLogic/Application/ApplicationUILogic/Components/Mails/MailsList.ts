import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class MailsList extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.ListContainerLocator),
    MailContextMenuContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  Elements = {
    Letter: this.Containers.MainContainer.locator(this.InheritedFields.ListItemLocator),
  };

  MailConversationElements = {
    Buttons: {
      ChevronDown: (mail) => this.Elements.Letter.locator(`_react=[item.subject="${mail}"] >> [data-testid="ToggleExpand"]`),
    },
    UnreadMessageIcon: (mail) => this.Containers.MainContainer.locator(`_react=[item.subject="${mail}"] >> _react=[isRead=false]`),
    SentMail: this.Elements.Letter.locator('[data-testid="SentIcon"]'),
    UnreadMail: this.Elements.Letter.locator('[data-testid="UnreadIcon"]'),
    ReadMail: this.Elements.Letter.locator('[data-testid="ReadIcon"]'),
    ReplyMail: this.Elements.Letter.locator('[data-testid="RepliedIcon"]'),
    ForwardedMail: this.Elements.Letter.locator('[data-testid="ForwardedIcon"]'),
    ListOfExpandedMessages: this.Elements.Letter.locator('[data-testid*="ConversationExpander"]'),
    SentIcon: this.Elements.Letter.locator('"Sent"'),
    DraftIcon: this.Elements.Letter.locator('"Drafts"'),
    MessageListItem: this.Elements.Letter.locator('[data-testid*="MessageListItem"]'),
    ReplyButton: this.Elements.Letter.locator('[data-testid*="UndoOutline"]'),
  };

  async OpenMail(mailSubject) {
    await this.Elements.Letter.locator(`"${mailSubject}"`).first().click();
  };

  async OpenContextMenuAndSelectOption(mailSubject, option) {
    await this.Elements.Letter.locator(`"${mailSubject}"`).click({button: 'right'});
    await option.click();
  };

  MailContextMenuOptions = {
    MarkAsUnread: this.Containers.MailContextMenuContainer.locator('"Mark as unread"'),
    MarkAsRead: this.Containers.MailContextMenuContainer.locator('"Mark as read"'),
    AddFlag: this.Containers.MailContextMenuContainer.locator('"Add flag"'),
    RemoveFlag: this.Containers.MailContextMenuContainer.locator('"Remove flag"'),
    Tags: this.Containers.MailContextMenuContainer.locator('"Tags"'),
    MarkAsSpam: this.Containers.MailContextMenuContainer.locator('"Mark as spam"'),
    Print: this.Containers.MailContextMenuContainer.locator('"Print"'),
    ShowOriginal: this.Containers.MailContextMenuContainer.locator('"Show original"'),
    Reply: this.Containers.MailContextMenuContainer.locator('"Reply"'),
    ReplyAll: this.Containers.MailContextMenuContainer.locator('"Reply all"'),
    Forward: this.Containers.MailContextMenuContainer.locator('"Forward"'),
    EditAsNew: this.Containers.MailContextMenuContainer.locator('"Edit as new"'),
    Send: this.Containers.MailContextMenuContainer.locator('"Send"'),
    Redirect: this.Containers.MailContextMenuContainer.locator('"Redirect"'),
  };

  SelectMailContextMenuOption = {
    MarkAsUnread: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.MarkAsUnread),
    MarkAsRead: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.MarkAsRead),
    AddFlag: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.AddFlag),
    RemoveFlag: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.RemoveFlag),
    Tags: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.Tags),
    MarkAsSpam: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.MarkAsSpam),
    Print: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.Print),
    ShowOriginal: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.ShowOriginal),
    Reply: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.Reply),
    ReplyAll: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.ReplyAll),
    Forward: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.Forward),
    EditAsNew: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.EditAsNew),
    Send: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.Send),
    Redirect: async (mailSubject) => await this.OpenContextMenuAndSelectOption(mailSubject, this.MailContextMenuOptions.Redirect),
  };
};
