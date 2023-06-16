import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';
import Colors from '../../../TestData/IconColorList.json';

test.describe('Edit Calendars Properties', async () => {
  let dateTimePrefix;
  let calendarName;
  let calendarNewName;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.calendars();
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    calendarName = dateTimePrefix + ' Calendar';
    calendarNewName = 'New' + calendarName;
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  async function CreateCalendarAndOpenEditProperties({pageManager, apiManager}) {
    await apiManager.createCalendarAPI.CreateCalendarRequest(calendarName, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.sideSecondaryCalendarMenu.OpenCalendarContextMenuOption.EditCalendarProperties(calendarName);
  };

  for (const color of Colors) {
    let colorSet = color.ColorSet;
    let colorCheck = color.ColorCheck;
    if (color.CalendarColorSet) {
      colorSet = color.CalendarColorSet;
      colorCheck = color.CalendarColorCheck;
    };
    test(`TC315. Edit calendar color. Calendar icon color ${colorSet} should be visible`, async ({pageManager, apiManager}) => {
      BaseTest.doubleTimeout();
      await CreateCalendarAndOpenEditProperties({pageManager, apiManager});
      if (color === Colors[2]) {
        await pageManager.editCalendarPropertyModal.SelectCalendarColor(Colors[0].ColorSet);
        await pageManager.editCalendarPropertyModal.Buttons.Ok.click();
        await pageManager.sideSecondaryCalendarMenu.OpenCalendarContextMenuOption.EditCalendarProperties(calendarName);
      };
      await pageManager.editCalendarPropertyModal.SelectCalendarColor(colorSet);
      await pageManager.editCalendarPropertyModal.Buttons.Ok.click();
      await expect((pageManager.sideSecondaryCalendarMenu.Tabs.CalendarByName(calendarName)).locator(`${colorCheck}`), 'Calendar icon color should be visible').toBeVisible();
    });
  };

  test('TC317. Edit calendar name. New name should be applyed', async ({pageManager, apiManager}) => {
    await CreateCalendarAndOpenEditProperties({pageManager, apiManager});
    await pageManager.editCalendarPropertyModal.ChangeCalendarName(calendarNewName);
    await pageManager.editCalendarPropertyModal.Buttons.Ok.click();
    await pageManager.baseApplicationPage.WaitForNotificationHiding();
    await expect(pageManager.sideSecondaryCalendarMenu.Containers.MainContainer.locator(`"${calendarNewName}"`),
      `Calendar should change name to ${calendarNewName}`).toBeVisible();
  });
});
