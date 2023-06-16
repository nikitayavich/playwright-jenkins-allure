import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('New calendar tests', async () => {
  let dateTimePrefix;
  let calendarName;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.calendars();
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    calendarName = dateTimePrefix + ' Calendar';
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  test('Create new Calendar. New calendar should be present in the secondary menu list. @smoke', async ({pageManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.sideSecondaryCalendarMenu.OpenCalendarContextMenuOption.NewCalendar();
    await pageManager.newCalendarModal.TextBoxes.CalendarName.fill(calendarName);
    await pageManager.newCalendarModal.Buttons.Create.click();
    await expect(pageManager.sideSecondaryCalendarMenu.Containers.MainContainer.locator(`"${calendarName}"`), 'New custom calendar should be visible on the side secondary menu').toBeVisible();
  });
});

