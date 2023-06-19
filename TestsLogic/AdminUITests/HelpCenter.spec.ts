import {test, BaseTest} from '../BaseTest';
import {expect} from '@playwright/test';

test.describe('Admin. Help Center.', async () => {
  // Should be validated on the test agent. Could be differences in this URL. f.e.
  // https://docs.zextras.com/carbonio-ce/html/management.html
  const helpCenterURL = 'https://docs.zextras.com/carbonio/html/administration.html';

  test.afterEach(async ({adminPage}) => {
    await adminPage.close();
  });

  test(`Open help center. Open URL ${helpCenterURL}. @smoke`, async ({adminPage, adminPageManager}) => {
    BaseTest.setAdminSuite.helpCenter();
    BaseTest.setSuite.smoke();
    await adminPage.waitForLoadState('networkidle');
    const [newPage] = await Promise.all([
      adminPage.waitForEvent('popup'),
      adminPageManager.adminHeaderMenu.Links.HelpCenter.click(),
    ]);
    expect(newPage.url()).toBe(helpCenterURL);
  });
});
