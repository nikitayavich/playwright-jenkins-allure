import {test, BaseTest} from '../../BaseTest';
import {expect} from '@playwright/test';

test.describe('Admin. Server Details tests.', async () => {
  test.beforeEach(async ({adminPageManager, adminApiManager}) => {
    BaseTest.setAdminSuite.storage();
    await adminPageManager.adminSideMenu.OpenMenuTab(adminPageManager.adminSideMenu.SideMenuTabs.Storage);
    await adminPageManager.storageSideMenu.SelectServer(await adminApiManager.baseAdminAPI.GetServerName());
  });

  test.afterEach(async ({adminPage}) => {
    await adminPage.close();
  });

  test('ATC403. Select Server. Server details should be visible. @smoke', async ({adminPageManager}) => {
    BaseTest.setSuite.smoke();
    await expect(adminPageManager.storageSideMenu.List.ServerDetails.DataVolumes, 'Data Volumes chapter should be visible').toBeVisible();
    await expect(adminPageManager.storageSideMenu.List.ServerDetails.HSMSettings, 'HSM Settings chapter should be visible').toBeVisible();
  });

  test('ATC404. Open Data Volumes chapter. All volume tables should be visible. @smoke', async ({adminPageManager}) => {
    BaseTest.setSuite.smoke();
    adminPageManager.storageSideMenu.List.ServerDetails.DataVolumes.click();
    await expect(adminPageManager.dataVolumes.VolumeTables.Primary, 'Primary volume table should be visible').toBeVisible();
    await expect(adminPageManager.dataVolumes.VolumeTables.Secondary, 'Secondary volume table should be visible').toBeVisible();
    await expect(adminPageManager.dataVolumes.VolumeTables.Indexer, 'Indexer volume table should be visible').toBeVisible();
  });
});
