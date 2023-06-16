import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class NewMail extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.NewItemBoardLocator),
    BeforeYouLeaveContainer: this.page.locator('[data-testid="modal"]'),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  bodyIframe = this.page.frameLocator(this.InheritedFields.NewItemBodyIframeLocator);

  BoardProperties = {
    NormalSize: this.Containers.MainContainer.locator('_react=[expanded=false]'),
    ExpandedSize: this.Containers.MainContainer.locator('_react=[expanded=true]'),
  };

  Buttons = {
    Send: this.Containers.MainContainer.locator('"Send"'),
    Save: this.Containers.MainContainer.locator('"Save"'),
    CloseCross: this.Containers.MainContainer.locator('[data-testid*="CloseOutline"]'),
    DeleteDraft: this.Containers.BeforeYouLeaveContainer.locator('"Delete Draft"'),
    ExpandBoard: this.Containers.MainContainer.locator('button:has([data-testid*="Expand"])'),
    ReduceBoard: this.Containers.MainContainer.locator('button:has([data-testid="icon: CollapseOutline"])'),
    Cc: this.Containers.MainContainer.locator('_react=[label="Cc"]'),
    Bcc: this.Containers.MainContainer.locator('_react=[label="Bcc"]'),
    MoreOptions: this.Containers.MainContainer.locator('button:has([data-testid$="MoreVertical"])'),
    CloseTab: this.Containers.MainContainer.locator('[data-testid$="Close"]'),
    AddAttachments: this.Containers.MainContainer.locator('[data-testid$="AttachOutline"]'),
  };

  TextBox = {
    To: this.Containers.MainContainer.locator('[name="To"]'),
    Cc: this.Containers.MainContainer.locator('[name="Cc"]'),
    Bcc: this.Containers.MainContainer.locator('[name="Bcc"]'),
    Subject: this.Containers.MainContainer.locator('[name="Subject"]'),
    Body: this.bodyIframe.locator(this.InheritedFields.NewItemBodyLocator),
  };

  BodyElements = {
    Quote: this.TextBox.Body.locator('div'),
  };

  Elements = {
    ContactBubble: this.Containers.MainContainer.locator(this.InheritedFields.ContactBubbleLocator),
    EditorToolbar: this.Containers.MainContainer.locator('.tox-editor-header'),
    MarkAsImportantIcon: this.Containers.MainContainer.locator('[data-testid$="ArrowUpward"]'),
    RequestReadReceiptIcon: this.Containers.MainContainer.locator('[data-testid$="CheckmarkSquare"]'),
    BoardTab: this.Containers.MainContainer.locator('[data-testid^="board-tab"]'),
    AttachmentFile: this.Containers.MainContainer.locator('_react=[att]'),
    DraftSavedNotification: this.Containers.MainContainer.locator('[class*="StickyTime"] >> nth=1'),
  };

  Dropdowns = {
    Contacts: {
      Item: this.Containers.DropdownContainer.locator('[value="[object Object]"]'),
    },
    MoreOptions: {
      DisableRichTextEditor: this.Containers.DropdownContainer.locator('"Disable rich text editor"'),
      EnableRichTextEditor: this.Containers.DropdownContainer.locator('"Enable rich text editor"'),
      MarkAsImportant: this.Containers.DropdownContainer.locator('"Mark as important"'),
      MarkAsNotImportant: this.Containers.DropdownContainer.locator('"Mark as not important"'),
      RequestReadReceipt: this.Containers.DropdownContainer.locator('"Request read receipt"'),
      RemoveReadReceiptRequest: this.Containers.DropdownContainer.locator('"Remove read receipt request"'),
    },
    AddAttachments: {
      AddFromLocal: this.Containers.DropdownContainer.locator('"Add from local"'),
      AddFromFiles: this.Containers.DropdownContainer.locator('"Add from Files"'),
      AddPublicLinkFromFiles: this.Containers.DropdownContainer.locator('"Add public link from Files"'),
      AddContactCard: this.Containers.DropdownContainer.locator('"Add Contact Card"'),
    },
  };

  SelectNewMailOption = {
    DisableRichTextEditor: async () => await this.SelectOption(this.Dropdowns.MoreOptions.DisableRichTextEditor, this.Buttons.MoreOptions),
    EnableRichTextEditor: async () => await this.SelectOption(this.Dropdowns.MoreOptions.EnableRichTextEditor, this.Buttons.MoreOptions),
    MarkAsImportant: async () => await this.SelectOption(this.Dropdowns.MoreOptions.MarkAsImportant, this.Buttons.MoreOptions),
    MarkAsNotImportant: async () => await this.SelectOption(this.Dropdowns.MoreOptions.MarkAsNotImportant, this.Buttons.MoreOptions),
    RequestReadReceipt: async () => await this.SelectOption(this.Dropdowns.MoreOptions.RequestReadReceipt, this.Buttons.MoreOptions),
    RemoveReadReceiptRequest: async () => await this.SelectOption(this.Dropdowns.MoreOptions.RemoveReadReceiptRequest, this.Buttons.MoreOptions),
    Cc: async () => await this.SelectOption(this.Buttons.Cc),
    Bcc: async () => await this.SelectOption(this.Buttons.Bcc),
    AddFromLocal: async () => await this.SelectOption(this.Dropdowns.AddAttachments.AddFromLocal, this.Buttons.AddAttachments),
    AddFromFiles: async () => await this.SelectOption(this.Dropdowns.AddAttachments.AddFromFiles, this.Buttons.AddAttachments),
    AddPublicLinkFromFiles: async () => await this.SelectOption(this.Dropdowns.AddAttachments.AddPublicLinkFromFiles, this.Buttons.AddAttachments),
    AddContactCard: async () => await this.SelectOption(this.Dropdowns.AddAttachments.AddContactCard, this.Buttons.AddAttachments),
  };

  async CreateNewMail(to, subject, body) {
    await this.ClickOnToTexbox();
    await this.TextBox.To.fill(to);
    await this.TextBox.Subject.click();
    await this.TextBox.Subject.fill(subject);
    await this.Containers.MainContainer.locator(`"${subject}"`).waitFor();
    await this.TextBox.Body.click();
    await this.TextBox.Body.fill(body);
  };

  async SelectOption(option, dropdown?) {
    await this.TextBox.Subject.waitFor();
    if (dropdown) {
      await dropdown.click();
    };
    await option.click();
  };

  async ClickOnToTexbox() {
    await this.Containers.MainContainer.locator('"To"').click();
  };

  async WaitForDraftSavedNotificationHiding() {
    await this.Elements.DraftSavedNotification.waitFor();
    const elementHandle = await this.page.$(this.Elements.DraftSavedNotification._selector);
    await elementHandle?.waitForElementState('hidden');
  };
};
