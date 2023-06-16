import {chromium, FullConfig} from '@playwright/test';
import {BaseTest} from './TestsLogic/BaseTest';

async function globalSetup(config: FullConfig) {
  // Ability to logine once for all tests
  // const {baseURL} = config.projects[0].use;
  const browser = await chromium.launch({headless: false});
  const page = await browser.newPage({ignoreHTTPSErrors: true});
  await page.goto("https://qa-public1.demo.zextras.io/");
  await page.locator('#input-0').fill(BaseTest.userForLogin.login);
  await page.locator('#password-0').fill("812feee9-c08e-4ec5-9734-07f6e7a6b096");
  await page.locator('[role="button"]').click();
  await page.waitForLoadState('networkidle');
  await page.context().storageState({path: "./userForLoginStorageState.json" as string});
  await browser.close();
}

export default globalSetup;
