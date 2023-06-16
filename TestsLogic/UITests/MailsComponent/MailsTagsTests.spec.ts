import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Tags tests', async () => {
  let tagName;
  const newTagName = 'New zextras tag';

  test.beforeEach(async ({pageManager, apiManager}) => {
    BaseTest.setFeatureSuite.mails();
    tagName = BaseTest.dateTimePrefix() + ' Autotest Tag';
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
    await apiManager.createTagsAPI.CreateTagRequest(tagName, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Mail);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC1005. Create tag in side mail menu. Tag should be in Tags tab. @criticalPath', async ({pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await pageManager.tagModals.OpenTagContextMenu.CreateTagModal();
    await pageManager.newTagModal.CreateTag(tagName);
    await pageManager.tagModals.ExpandTagsFolderinMails();
    await expect(pageManager.sideSecondaryMailMenu.Elements.Item.locator(`"${tagName}"`)).toBeVisible();
  });

  test('TC1006. Delete tag in side mail menu. Tag should not be in Tags tab.', async ({pageManager}) => {
    await pageManager.tagModals.ExpandTagsFolderinMails();
    await pageManager.tagModals.OpenTagContextMenu.DeleteTagModal(tagName);
    await pageManager.deleteMailModal.Buttons.Delete.click();
    await expect(pageManager.sideSecondaryMailMenu.Elements.Item.locator(`"${tagName}"`)).not.toBeVisible();
  });

  test('TC1007. Rename tag in side mail menu. Tag should be renamed.', async ({pageManager}) => {
    await pageManager.tagModals.ExpandTagsFolderinMails();
    await pageManager.tagModals.OpenTagContextMenu.EditTagModal(tagName);
    await pageManager.editTagModal.EditNameTag(newTagName);
    await expect(pageManager.sideSecondaryMailMenu.Elements.Item.locator(`"${newTagName}"`)).toBeVisible();
  });
});
