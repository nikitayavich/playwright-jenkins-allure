import {BaseAdminPage} from '../Pages/BaseAdminPage';

export class AdminSideMenu extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('[class*="PrimaryBarContainer"]'),
  };

  SideMenuTabs = {
    Dashboard: this.Containers.MainContainer.locator('[data-testid$="HomeOutline"]'),
    Domains: this.Containers.MainContainer.locator('[data-testid$="AtOutline"]'),
    Storage: this.Containers.MainContainer.locator('[data-testid$="HardDriveOutline"]'),
  };

  async OpenMenuTab(tab) {
    await tab.click();
    await this.page.locator('[class*="BoardsRouterContainer"]').hover();
  };
};
