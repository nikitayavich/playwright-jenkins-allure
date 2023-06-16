import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Search tests', async () => {
  let uniquePrefix;
  let contactName;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.search();
    uniquePrefix = BaseTest.dateTimePrefix();
    contactName = uniquePrefix + ' First Contact Name';
    await apiManager.contactsAPI.DeleteContactsViaAPI(BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.contactsAPI.DeleteContactsViaAPI(BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC702. Search contact. @criticalPath', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await apiManager.createContactsAPI.CreateContact(contactName, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Contacts);
    await pageManager.headerMenu.MakeSearch(uniquePrefix);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${contactName}"`)).toBeVisible();
  });
});
