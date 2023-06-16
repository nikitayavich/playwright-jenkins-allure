import {test, BaseTest} from '../../BaseTest';
import {expect} from '@playwright/test';

test.describe('Admin. Storage tests.', async () => {
  test.beforeEach(async ({adminPageManager}) => {
    BaseTest.setAdminSuite.storage();
    await adminPageManager.adminSideMenu.OpenMenuTab(adminPageManager.adminSideMenu.SideMenuTabs.Storage);
  });

  test.afterEach(async ({adminPage}) => {
    await adminPage.close();
  });

  test('ATC401. Open Storage Tab. All lists should be visible. @smoke', async ({adminPageManager}) => {
    BaseTest.setSuite.smoke();
    await expect(adminPageManager.storageSideMenu.List.GlobalServers.Header, 'Global Servers list header should be visible').toBeVisible();
    await expect(adminPageManager.storageSideMenu.Textboxes.SelectAServer, 'Server textbox should be visible').toBeVisible();
    await expect(adminPageManager.storageSideMenu.List.ServerDetails.Header, 'Server Details list header should be visible').toBeVisible();
  });

  test('ATC402. Click on Show Servers Button. Server list dropdown should be visible', async ({adminPageManager}) => {
    await adminPageManager.storageSideMenu.Buttons.ShowServers.click();
    await expect(adminPageManager.storageSideMenu.Elements.ServerInDropdown, 'Server list dropdown should be visible').toBeVisible();
  });
});
