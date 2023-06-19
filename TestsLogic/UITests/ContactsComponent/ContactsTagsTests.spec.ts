import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Tags tests', async () => {
  let tagName;
  const newTagName = 'New zextras tag';

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.contacts();
    tagName = BaseTest.dateTimePrefix() + ' Autotest Tag';
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
    await apiManager.createTagsAPI.CreateTagRequest(tagName, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Contacts);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC1008. Create tag in side contacts menu. Tag should be in Tags tab. @criticalPath', async ({pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await pageManager.tagModals.OpenTagContextMenu.CreateTagModal();
    await pageManager.newTagModal.CreateTag(tagName);
    await pageManager.tagModals.ExpandTagsFolder();
    await expect(pageManager.sideSecondaryContactsMenu.Elements.Item.locator(`"${tagName}"`)).toBeVisible();
  });

  test('TC1009. Delete tag in side contacts menu. Tag should not be in Tags tab.', async ({pageManager}) => {
    await pageManager.tagModals.ExpandTagsFolder();
    await pageManager.tagModals.OpenTagContextMenu.DeleteTagModal(tagName);
    await pageManager.deleteCalendarModal.Buttons.Delete.click();
    await expect(pageManager.tagModals.Elements.Item.locator(`"${tagName}"`)).not.toBeVisible();
  });

  test('TC1010. Rename tag in side contacts menu. Tag should be renamed.', async ({pageManager}) => {
    await pageManager.tagModals.ExpandTagsFolder();
    await pageManager.tagModals.OpenTagContextMenu.EditTagModal(tagName);
    await pageManager.editTagModal.EditNameTag(newTagName);
    await expect(pageManager.tagModals.Elements.Item.locator(`"${newTagName}"`)).toBeVisible();
  });
});
