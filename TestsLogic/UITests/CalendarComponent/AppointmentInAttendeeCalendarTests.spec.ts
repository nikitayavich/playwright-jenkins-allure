import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';


test.describe('Calendars tests. Appointment in attendee calendar.', async () => {
  let dateTimePrefix;
  let appointmentTitle;
  let appointmentBody;

  test.beforeEach(async ({apiManager, secondApiManager, secondPageManager}) => {
    BaseTest.setFeatureSuite.calendars();
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    appointmentTitle = dateTimePrefix + ' Autotest Appointment Title';
    appointmentBody = dateTimePrefix + ' Autotest Appointment Body';
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
    await secondApiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.secondUser.login);
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, BaseTest.secondUser.login, appointmentBody);
    await secondPageManager.page.waitForLoadState('networkidle');
    await secondPageManager.sideMenu.OpenMenuTab(secondPageManager.sideMenu.SideMenuTabs.Calendar);
    await secondPageManager.sideSecondaryCalendarMenu.SelectOnlyCalendar();
  });

  test.afterEach(async ({apiManager, secondApiManager, page}) => {
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
    await secondApiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.secondUser.login);
    await page.close();
  });

  test('TC303. Create new appointment. Attendee see appointment in own calendar. @cricitalPath', async ({secondPageManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await expect(secondPageManager.calendar.Elements.Appointment.locator(`"${appointmentTitle}"`)).toBeVisible();
  });

  test('TC316. Create new appointment. Attendee see appointment with need action icon. @cricitalPath', async ({secondPageManager}) => {
    BaseTest.setSuite.criticalPath();
    BaseTest.doubleTimeout();
    await expect(secondPageManager.calendar.Selectors.NeedActionsIconSelector.first()).toBeVisible();
  });
});
