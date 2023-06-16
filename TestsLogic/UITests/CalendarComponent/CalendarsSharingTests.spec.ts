import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Sharing calendar tests', async () => {
  let dateTimePrefix;
  let appointmentTitle;
  let appointmentBody;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.calendars();
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    appointmentTitle = dateTimePrefix + ' Autotest Appointment Title';
    appointmentBody = dateTimePrefix + ' Autotest Appointment Body';
    await apiManager.calendarAPI.DeleteAppointmentsAndCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    await apiManager.shareCalendarAPI.RevokeSharingOfCalendar(BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.calendarAPI.DeleteAppointmentsAndCalendarsViaAPI(apiManager, BaseTest.userForLogin.login);
    await apiManager.shareCalendarAPI.RevokeSharingOfCalendar(BaseTest.userForLogin.login);
    await page.close();
  });

  test('TC313. Share Calendar. Calendar access share window has ICS OUTLOOK VIEW urls.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    test.fail(true, 'calendarAccessShareModal does not appear');
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, '3', appointmentBody);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.sideSecondaryCalendarMenu.OpenCalendarContextMenuOption.ShareCalendar();
    await pageManager.shareCalendarModal.ShareCalendar(BaseTest.secondUser.login);
    await expect(pageManager.calendarAccessShareModal.Buttons.IcsUrl, 'Calendar access share window should contain ICS URL button').toBeVisible();
    await expect(pageManager.calendarAccessShareModal.Buttons.OutlookUrl, 'Calendar access share window should contain OUTLOOK URL button').toBeVisible();
    await expect(pageManager.calendarAccessShareModal.Buttons.ViewUrl, 'Calendar access share window should contain VIEW URL button').toBeVisible();
  });

  test('TC314. Share Calendar. Check shared icon and notification.', async ({pageManager, apiManager}) => {
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, '3', appointmentBody);
    await apiManager.shareCalendarAPI.ShareCalendar(BaseTest.userForLogin.login, BaseTest.secondUser.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await expect(pageManager.sideSecondaryCalendarMenu.Icons.SharedIcon, 'Shared icon should be presented opposite calendar when it is shared').toBeVisible();
  });

  test('TC304. Revoke sharing. Sharing icon should disapear.', async ({pageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    const regexp = /@.+/gi;
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, '3', appointmentBody);
    await apiManager.shareCalendarAPI.ShareCalendar(BaseTest.userForLogin.login, BaseTest.secondUser.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.sideSecondaryCalendarMenu.Icons.SharedIcon.waitFor();
    await pageManager.sideSecondaryCalendarMenu.OpenCalendarContextMenuOption.EditCalendarProperties();
    const shredWithUserName = BaseTest.secondUser.login.replace(regexp, '');
    await pageManager.editCalendarPropertyModal.SharingThisFolderActions.Revoke(shredWithUserName);
    await pageManager.revokeShareCalendarModal.Buttons.Revoke.click();
    await pageManager.editCalendarPropertyModal.Buttons.Ok.click();
    await expect(pageManager.sideSecondaryCalendarMenu.Icons.SharedIcon, 'Shared icon should be not presented after revoke of sharing').toHaveCount(0);
  });
});

