import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Calendars view tests', async () => {
  const calendarView = {
    Day: "Day",
    Week: "Week",
    WorkWeek: "Work week",
    Month: "Month",
  };

  test.beforeEach(async ({apiManager, pageManager}) => {
    BaseTest.setFeatureSuite.calendars();
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.calendarAPI.DeleteCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC306. Calendar view: "Work week" is a default view', async ({pageManager}) => {
    await expect(await pageManager.calendar.Elements.ActiveViewButton, '"Work Week" button should be preselected by default').toBeVisible();
  });

  test('TC307. Calendar view: Current Date is selected on the Calendar', async ({pageManager}) => {
    await pageManager.calendar.SelectCalendarView(calendarView.Day);
    const currentMonthAndDateOnUI = await pageManager.calendar.Elements.CurrentDate.innerText().valueOf();
    const currentMonthAndDate = await pageManager.calendar.CalculateCurrentDate();
    await expect(currentMonthAndDateOnUI).toBe(currentMonthAndDate);
  });

  test('TC308. Calendar view: Day', async ({pageManager}) => {
    await pageManager.calendar.SelectCalendarView(calendarView.Day);
    await expect(pageManager.calendar.Elements.AllDayCell, 'Calendar have to contain 1 Cell').toHaveCount(1);
    await expect(pageManager.calendar.Elements.Column, 'Calendar have to consist of 2 Columns').toHaveCount(2);
  });

  test('TC309. Calendar view: Week', async ({pageManager}) => {
    await pageManager.calendar.SelectCalendarView(calendarView.Week);
    await expect(pageManager.calendar.Elements.AllDayCell, 'Calendar have to contain 7 Cell').toHaveCount(7);
    await expect(pageManager.calendar.Elements.Column, 'Calendar have to consist of 8 Columns').toHaveCount(8);
  });

  test('TC310. Calendar view: Work Week', async ({pageManager, page}) => {
    await pageManager.calendar.SelectCalendarView(calendarView.WorkWeek);
    await BaseTest.waitForLoaderSpinnerHidden(page);
    await expect(pageManager.calendar.Elements.AllDayCell, 'Calendar have to contain 5 Cell').toHaveCount(5);
    await expect(pageManager.calendar.Elements.Column, 'Calendar have to consist of 6 Columns').toHaveCount(6);
  });

  test('TC311. Calendar view: Month', async ({pageManager}) => {
    await pageManager.calendar.SelectCalendarView(calendarView.Month);
    await expect(pageManager.calendar.Elements.AllDayCell, 'Calendar have to contain 35 Cell').toHaveCount(35);
  });

  test('TC312. Calendar view: Current Day Schedule is displayed by "TODAY" button clicking', async ({pageManager}) => {
    BaseTest.doubleTimeout();
    const currentMonthAndDate = await pageManager.calendar.CalculateCurrentDate();
    await pageManager.calendar.SelectCalendarView(calendarView.Day);
    await pageManager.calendar.Elements.NextDateArrow.click({clickCount: 3});
    await pageManager.calendar.Elements.TodayButton.click();
    const currentMonthAndDateOnUI = await pageManager.calendar.Elements.CurrentDate.innerText().valueOf();
    await expect(currentMonthAndDateOnUI, 'Calendar Date must match the current date').toBe(currentMonthAndDate);
  });
});
