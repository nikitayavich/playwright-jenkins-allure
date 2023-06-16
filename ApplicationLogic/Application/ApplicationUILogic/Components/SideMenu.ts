import {BaseApplicationPage} from '../Pages/BaseApplicationPage';

export class SideMenu extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('[data-testid="SideMenuContainer"]'),
  };

  Buttons = {
    HideBoard: this.Containers.MainContainer.locator('button:has([data-testid$="BoardCollapse"])'),
    OpenBoard: this.Containers.MainContainer.locator('button:has([data-testid$="BoardOpen"])'),
  };

  SideMenuTabs = {
    Mail: this.Containers.MainContainer.locator('[data-testid*="MailModOutline"]'),
    Calendar: this.Containers.MainContainer.locator('[data-testid*="CalendarModOutline"]'),
    Contacts: this.Containers.MainContainer.locator('[data-testid*="ContactsModOutline"]'),
    Chats: this.Containers.MainContainer.locator('[data-testid*="TeamOutline"]'),
    Files: this.Containers.MainContainer.locator('[data-testid*="DriveOutline"]'),
    Search: this.Containers.MainContainer.locator('[data-testid*="SearchModOutline"]'),
    Settings: this.Containers.MainContainer.locator('[data-testid*="SettingsModOutline"]'),
  };

  async OpenMenuTab(tab) {
    await tab.click();
    if (tab === this.SideMenuTabs.Calendar) {
      await this.page.locator(this.InheritedFields.ExpandFoldersLocator).click();
    };
  };
};
