import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';
import Colors from '../../../TestData/IconColorList.json';

test.describe('Tags tests', async () => {
  let tagName;
  let appointmentTitle;
  let appointmentBody;
  const newTagName = 'New zextras tag';

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.calendars();
    appointmentTitle = BaseTest.dateTimePrefix() + ' Autotest Appointment Title';
    appointmentBody =BaseTest.dateTimePrefix() + ' Autotest Appointment Body';
    tagName = BaseTest.dateTimePrefix() + ' Autotest Tag';
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC1001. Create tag in appointment. Tag icon should be visible in appointment.', async ({pageManager, apiManager, page}) => {
    BaseTest.doubleTimeout();
    test.fail(true, 'Issue #37');
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, '3', appointmentBody);
    await page.waitForLoadState('networkidle');
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.sideSecondaryCalendarMenu.SelectOnlyCalendar();
    await pageManager.calendar.OpenModalForCreateTag(appointmentTitle);
    await pageManager.newTagModal.CreateTag(tagName);
    await pageManager.sideSecondaryCalendarMenu.OpenTagChevron();
    await expect(pageManager.calendar.Selectors.TagIconSelector).toBeVisible();
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
  });

  test('TC1002. Create tag in side calendar menu. Tag should be in Tags tab. @criticalPath', async ({pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.tagModals.OpenTagContextMenu.CreateTagModal();
    await pageManager.newTagModal.CreateTag(tagName);
    await pageManager.tagModals.ExpandTagsFolder();
    await expect(pageManager.sideSecondaryCalendarMenu.Elements.Item.locator(`"${tagName}"`)).toBeVisible();
  });

  test('TC1003. Delete tag in side calendar menu. Tag should not be in Tags tab.', async ({apiManager, pageManager}) => {
    await CreateTagViaApiAndOpenCalendarTab({apiManager, pageManager});
    await pageManager.tagModals.OpenTagContextMenu.DeleteTagModal(tagName);
    await pageManager.deleteCalendarModal.Buttons.Delete.click();
    await expect(pageManager.sideSecondaryCalendarMenu.Elements.Item.locator(`"${tagName}"`)).not.toBeVisible();
  });

  test('TC1004. Rename tag in side calendar menu. Tag should be renamed.', async ({apiManager, pageManager}) => {
    await CreateTagViaApiAndOpenCalendarTab({apiManager, pageManager});
    await pageManager.tagModals.OpenTagContextMenu.EditTagModal(tagName);
    await pageManager.editTagModal.EditNameTag(newTagName);
    await expect(pageManager.sideSecondaryCalendarMenu.Elements.Item.locator(`"${newTagName}"`)).toBeVisible();
  });

  for (const color of Colors) {
    test(`TC1011. Change tag color in side calendar menu. Tag color should change to ${color.ColorSet}`, async ({apiManager, pageManager}) => {
      BaseTest.doubleTimeout();
      await CreateTagViaApiAndOpenCalendarTab({apiManager, pageManager});
      await pageManager.editTagModal.ChooseColor({pageManager}, color.ColorSet, tagName);
      await expect(pageManager.sideSecondaryCalendarMenu.Containers.MainContainer.locator(`${color.ColorCheck}[icon="Tag"]`)).toBeVisible();
    });
  };

  async function CreateTagViaApiAndOpenCalendarTab({apiManager, pageManager}) {
    await apiManager.createTagsAPI.CreateTagRequest(tagName, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.tagModals.ExpandTagsFolder();
  };
});
