import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class EditCalendarPropertyModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  SharingThisFolderButtonsText = {
    Edit: "Edit",
    Revoke: "Revoke",
    Resend: "Resend",
  };

  Locators = {
    SharingThisFolderRow: '_react=[key="0"]',
  };

  Buttons = {
    Ok: this.Containers.MainContainer.locator('"OK"'),
    AddShare: this.Containers.MainContainer.locator('"Add share"'),
  };

  Dropdowns = {
    Color: this.Containers.MainContainer.locator('"Calendar color"'),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  TextBoxes = {
    CalendarName: this.Containers.MainContainer.locator('[name="Calendar name"]'),
  };

  SharingThisFolderActions = {
    Edit: async (user) => {
      const btn = await this.GetSharingThisFolderActionsButton(user, this.SharingThisFolderButtonsText.Edit);
      await btn.click();
    },
    Revoke: async (user) => {
      const btn = await this.GetSharingThisFolderActionsButton(user, this.SharingThisFolderButtonsText.Revoke);
      await btn.click();
    },
    Resend: async (user) => {
      const btn = await this.GetSharingThisFolderActionsButton(user, this.SharingThisFolderButtonsText.Resend);
      await btn.click();
    },
  };

  async ChangeCalendarName(newName) {
    await this.TextBoxes.CalendarName.fill(newName);
  };

  async SelectCalendarColor(color) {
    await this.Dropdowns.Color.click();
    await this.Dropdowns.DropdownContainer.locator(`"${color}"`).click();
  };

  async GetSharingThisFolderActionsButton(user, button) {
    return await this.Containers.MainContainer.
      locator(`${this.Locators.SharingThisFolderRow}`, {hasText: `${user}`}).
      locator(`"${button}"`);
  };
};
