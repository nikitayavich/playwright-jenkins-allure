import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class SideSecondaryCalendarMenu extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.SideSecondaryBarLocator),
    ContextMenuContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  ContextMenu = {
    NewCalendar: this.Containers.ContextMenuContainer.locator('"New calendar"'),
    MoveToRoot: this.Containers.ContextMenuContainer.locator('"Move to root"'),
    EditCalendarProperties: this.Containers.ContextMenuContainer.locator('"Edit calendar properties"'),
    DeleteCalendar: this.Containers.ContextMenuContainer.locator('"Delete calendar"'),
    ShareCalendar: this.Containers.ContextMenuContainer.locator('"Share Calendar"'),
    CalendarAccessShare: this.Containers.ContextMenuContainer.locator('"Calendar’s access share"'),
  };

  Tabs = {
    AllCalendars: this.Containers.MainContainer.locator('"All calendars"'),
    Calendar: this.Containers.MainContainer.locator('"Calendar"'),
    Trash: this.Containers.MainContainer.locator('"Trash"'),
    Tags: this.Containers.MainContainer.locator('"Tags"'),
    SharedCalendars: this.Containers.MainContainer.locator('"Shared Calendars"'),
    CalendarByName: (name) => this.Containers.MainContainer.locator(`[class^="MuiButton"]:has-text("${name}")`),
  };

  Icons = {
    CalendarUnchecked: this.Containers.MainContainer.locator('[data-name="calendar"] >> nth=0'),
    CalendarChecked: this.Containers.MainContainer.locator('[data-testid*="Calendar2"] >> nth=0'),
    TrashUnchecked: this.Containers.MainContainer.locator('[data-testid*="Trash2Outline"]'),
    SharedIcon: this.Containers.MainContainer.locator('[data-testid*="ArrowCircleRight"]'),
  };

  Hints = {
    SharedHint: this.page.locator('"Shared with 1 people"'),
  };

  Locators = {
    CalendarUnchecked: '[data-name="calendar"]',
    CalendarChecked: '[data-testid*="Calendar2"]',
    TrashUnchecked: '[data-name="trash-2"]',
  };

  Elements = {
    TrashChevron: this.Containers.MainContainer.locator(`id=3 >> ${this.InheritedFields.ExpandFoldersLocator}`),
    Item: this.Containers.MainContainer.locator('[class*="Text__Comp"]'),
  };

  async OpenTrashChevron() {
    const elementHandle = await this.page.$(this.Elements.TrashChevron._selector);
    await elementHandle?.waitForElementState('stable');
    await this.Elements.TrashChevron.click();
  };

  async OpenContextMenuForCalendar(name = '') {
    let calendar;
    await this.Tabs.AllCalendars.waitFor();
    if (name) {
      calendar = this.Tabs.CalendarByName(name);
    } else {
      calendar = this.Tabs.Calendar;
    }
    await calendar.click({button: 'right'});
  };

  OpenCalendarContextMenuOption = {
    ShareCalendar: async (name = '') => {
      await this.ClickContextMenuOption(this.ContextMenu.ShareCalendar, name);
    },
    NewCalendar: async (name = '') => {
      await this.ClickContextMenuOption(this.ContextMenu.NewCalendar, name);
    },
    MoveToRoot: async (name = '') => {
      await this.ClickContextMenuOption(this.ContextMenu.MoveToRoot, name);
    },
    EditCalendarProperties: async (name = '') => {
      await this.ClickContextMenuOption(this.ContextMenu.EditCalendarProperties, name);
    },
    DeleteCalendar: async (name = '') => {
      await this.ClickContextMenuOption(this.ContextMenu.DeleteCalendar, name);
    },
    CalendarAccessShare: async (name = '') => {
      await this.ClickContextMenuOption(this.ContextMenu.CalendarAccessShare, name);
    },
  };

  async ClickContextMenuOption(element, name = '') {
    await this.OpenContextMenuForCalendar(name);
    await element.click();
  };

  async ShareCalendar() {
    await this.OpenContextMenuForCalendar();
    await this.ContextMenu.ShareCalendar.click();
  };

  TrashSelecting = {
    Select: async () => {
      await this.Tabs.Trash.waitFor();
      if (await this.Icons.TrashUnchecked.isVisible()) {
        await this.Tabs.Trash.click();
      }
    },
    Unselect: async () => {
      await this.Tabs.Trash.waitFor();
      if (await this.Icons.TrashUnchecked.isHidden()) {
        await this.Tabs.Trash.click();
      }
    },
  };

  CalendarSelecting = {
    Select: async () => {
      await this.Tabs.Calendar.waitFor();
      if (await this.Icons.CalendarUnchecked.isVisible()) {
        await this.Tabs.Calendar.click();
      }
    },
    Unselect: async () => {
      await this.Tabs.Calendar.waitFor();
      if (await this.Icons.CalendarUnchecked.isHidden()) {
        await this.Tabs.Calendar.click();
      }
    },
  };

  async SelectOnlyCalendarWithName(calendarName) {
    await this.CalendarSelecting.Unselect();
    await this.TrashSelecting.Unselect();
    await this.page.locator(`${this.Locators.CalendarUnchecked}:near(:text("${calendarName}"))`).click();
  };

  async UnselectAllCalendars() {
    await this.Tabs.Calendar.waitFor();
    while (await this.Icons.CalendarChecked.isVisible()) {
      await this.Icons.CalendarChecked.click();
    }
  };

  async SelectOnlyTrash() {
    await this.CalendarSelecting.Unselect();
    await this.TrashSelecting.Select();
  };

  async SelectOnlyCalendar() {
    await this.TrashSelecting.Unselect();
    await this.CalendarSelecting.Select();
  };

  async OpenAllCalendars() {
    await this.Tabs.AllCalendars.click();
  };

  async OpenCalendar() {
    await this.Tabs.Calendar.click();
  };

  async OpenSharedCalendars() {
    await this.Tabs.SharedCalendars.click();
  };
}
