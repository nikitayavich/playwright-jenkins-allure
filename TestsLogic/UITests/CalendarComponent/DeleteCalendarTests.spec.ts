import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Delete Calendar', async () => {
  let dateTimePrefix;
  let calendarName;
  let calendarId;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.calendars();
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    calendarName = dateTimePrefix + ' Calendar';
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    calendarId = await apiManager.createCalendarAPI.CreateCalendarRequest(calendarName, BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC318. Delete calendar. Calendar should be moved to Trash', async ({pageManager, page}) => {
    BaseTest.doubleTimeout();
    await OpenCalendarTab({pageManager, page});
    await pageManager.sideSecondaryCalendarMenu.OpenCalendarContextMenuOption.DeleteCalendar(calendarName);
    await pageManager.deleteCalendarModal.Buttons.Delete.click();
    await pageManager.sideSecondaryCalendarMenu.OpenTrashChevron();
    await expect(pageManager.sideSecondaryCalendarMenu.Containers.MainContainer.locator(`:text("${calendarName}"):below(:text("Trash"))`),
      `Calendar ${calendarName} should be moved to trash`).toBeVisible();
  });

  test('TC319. Delete calendar permanently. Calendar should be disappear from Trash', async ({pageManager, apiManager, page}) => {
    await apiManager.deleteCalendarAPI.MoveToTrashCalendarFolderRequest(calendarId, BaseTest.userForLogin.login);
    await OpenCalendarTab({pageManager, page});
    await pageManager.sideSecondaryCalendarMenu.OpenTrashChevron();
    await pageManager.sideSecondaryCalendarMenu.OpenCalendarContextMenuOption.DeleteCalendar(calendarName);
    await pageManager.deleteCalendarModal.Buttons.Delete.click();
    await expect(pageManager.sideSecondaryCalendarMenu.Containers.MainContainer.locator(`"${calendarName}"`),
      `Calendar ${calendarName} should be delete permanently`).toHaveCount(0);
  });

  async function OpenCalendarTab({pageManager, page}) {
    await page.waitForLoadState('networkidle');
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.sideSecondaryCalendarMenu.Tabs.AllCalendars.waitFor();
  };
});
