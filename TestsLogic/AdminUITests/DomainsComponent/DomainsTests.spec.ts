import {test, BaseTest} from '../../BaseTest';
import {expect} from '@playwright/test';

test.describe('Admin. Domains tests.', async () => {
  test.beforeEach(async ({adminPageManager}) => {
    BaseTest.setAdminSuite.domains();
    await adminPageManager.adminSideMenu.OpenMenuTab(adminPageManager.adminSideMenu.SideMenuTabs.Domains);
  });

  test.afterEach(async ({adminPage}) => {
    await adminPage.close();
  });

  test('ATC301. Open Domains Tab. All lists should be visible. @smoke', async ({adminPageManager}) => {
    BaseTest.setSuite.smoke();
    await expect(adminPageManager.domainsSideMenu.List.Global.Header, 'Global list header should be visible').toBeVisible();
    await expect(adminPageManager.domainsSideMenu.Textboxes.TypeHereADomain, 'Domain textbox should be visible').toBeVisible();
    await expect(adminPageManager.domainsSideMenu.List.Details.Header, 'Details list header should be visible').toBeVisible();
    await expect(adminPageManager.domainsSideMenu.List.Manage.Header, 'Manage list header should be visible').toBeVisible();
  });

  test('ATC312. Click on Show Domains Button. Domains list dropdown should be visible', async ({adminPageManager}) => {
    await adminPageManager.domainsSideMenu.Buttons.ShowDomains.click();
    await expect(adminPageManager.domainsSideMenu.Elements.DomainInDropdown, 'Domains list dropdown should be visible').toBeVisible();
  });
});
