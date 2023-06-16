import {expect} from '@playwright/test';
import {test, BaseTest} from '../BaseTest';
import {PageManager} from '../../ApplicationLogic/Application/ApplicationUILogic/Pages/PageManager';

// test.use({storageState: {cookies: [], origins: []}});

// Don't work in the headless mode
test.describe.skip('Login tests', async () => {
  let userForLogin;

  test.beforeEach(async () => {
    BaseTest.setFeatureSuite.login();
  });

  test('TC101. Success login. @smoke', async ({browser}) => {
    BaseTest.setSuite.smoke();
    const page = await browser.newPage();
    await page.goto('/');
    const pageManager = new PageManager(page);
    await pageManager.loginPage.Login(userForLogin.login, BaseTest.userForLogin.password);
    await expect(pageManager.headerMenu.Logos.MainLogo).toBeVisible();
  });

  test('TC102. Logout. @smoke', async ({browser}) => {
    BaseTest.setSuite.smoke();
    const page = await browser.newPage();
    await page.goto('/');
    const pageManager = new PageManager(page);
    await pageManager.loginPage.Login(userForLogin.login, BaseTest.userForLogin.password);
    await pageManager.headerMenu.OpenUserMenuSection(pageManager.headerMenu.UserMenu.Logout);
    await expect(pageManager.loginPage.TextBox.Login).toBeVisible();
  });
});
