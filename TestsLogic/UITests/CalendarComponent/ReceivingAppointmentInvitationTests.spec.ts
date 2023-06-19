import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Calendars tests. Receiving invitation.', async () => {
  let dateTimePrefix;
  let appointmentTitle;
  let appointmentBody;

  test.beforeEach(async ({apiManager, secondApiManager}) => {
    BaseTest.setFeatureSuite.calendars();
    BaseTest.doubleTimeout();
    dateTimePrefix = new Date().getDate().toString() + new Date().getTime().toString();
    appointmentTitle = dateTimePrefix + ' Autotest Appointment Title';
    appointmentBody = dateTimePrefix + ' Autotest Appointment Body';
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
    await secondApiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.secondUser.login);
  });

  test.afterEach(async ({apiManager, secondApiManager, page}) => {
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
    await secondApiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.secondUser.login);
    await page.close();
  });

  test('TC1101. Create new appointment. Attendee receives invitation. @smoke', async ({secondPageManager, apiManager}) => {
    BaseTest.setSuite.smoke();
    BaseTest.doubleTimeout();
    await CreateAppointmentViaApiAndOpenInboxInSecondUser(secondPageManager, apiManager);
    await expect(secondPageManager.mailsList.Elements.Letter.locator(`"${appointmentTitle}"`), 'User receives invitation mail with appointment title in subject').toBeVisible();
  });

  test('TC1102. Create new appointment. Attendee receives invitation with options Yes, Maybe, No, Propose New Time.', async ({secondPageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await expect(secondPageManager.mailDetails.AppointmentInvitation.Options.Yes, 'Appointments invitation message has option Yes').toBeVisible();
    await expect(secondPageManager.mailDetails.AppointmentInvitation.Options.No, 'Appointments invitation message has option No').toBeVisible();
    await expect(secondPageManager.mailDetails.AppointmentInvitation.Options.Maybe, 'Appointments invitation message has option Maybe').toBeVisible();
    await expect(secondPageManager.mailDetails.AppointmentInvitation.Options.ProposeNewTime, 'Appointments invitation message has option Propose new time').toBeVisible();
  });

  test('TC1103. Create new appointment. Attendee receives invitation with Participants.', async ({secondPageManager, apiManager}) => {
    BaseTest.doubleTimeout();
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await expect(secondPageManager.mailDetails.AppointmentInvitation.Participant.nth(0), `Appointment has ${BaseTest.userForLogin.login} in participants`).toContainText(BaseTest.userForLogin.login);
    await expect(secondPageManager.mailDetails.AppointmentInvitation.Participant.nth(1), `Appointment has ${BaseTest.secondUser.login} in participants`).toContainText(BaseTest.secondUser.login);
  });

  test('TC1104. Create new appointment. Attendee receives invitation with Participants count.', async ({secondPageManager, apiManager}) => {
    test.fail(true, "Issue #19");
    const participantsCount = '2 Participants';
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await expect(secondPageManager.mailDetails.AppointmentInvitation.ParticipantCount, `Appointment has "${participantsCount}" count`).toHaveText(participantsCount);
  });

  test('TC1105. Create new appointment with Location. Attendee receives invitation with same Location.', async ({secondPageManager, apiManager}) => {
    const location = dateTimePrefix + ' Location';
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager, location);
    await expect(secondPageManager.mailDetails.AppointmentInvitationSections.FirstField, `Appointment has location ${location}`).toHaveText(location);
  });

  test('TC1106. Select the "No" option on the appointment invitation. The decline mail should be visible to the appointment organizer.', async ({secondPageManager, apiManager, pageManager}) => {
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await secondPageManager.mailDetails.AppointmentInvitation.Options.No.click();
    await OpenInboxInSpecificUser(pageManager);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"Decline: ${appointmentTitle}"`), 'The decline mail should be visible to the appointment organizer.').toBeVisible();
  });

  test('TC1107. Select the "Yes" option on the appointment invitation. The accept mail should be visible to the appointment organizer.', async ({secondPageManager, apiManager, pageManager}) => {
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await secondPageManager.mailDetails.AppointmentInvitation.Options.Yes.click();
    await OpenInboxInSpecificUser(pageManager);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"Accept: ${appointmentTitle}"`), 'The accept mail should be visible to the appointment organizer.').toBeVisible();
  });

  test('TC1108. Select the "Maybe" option on the appointment invitation. The tentative mail should be visible to the appointment organizer.', async ({secondPageManager, apiManager, pageManager}) => {
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await secondPageManager.mailDetails.AppointmentInvitation.Options.Maybe.click();
    await OpenInboxInSpecificUser(pageManager);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"Tentative: ${appointmentTitle}"`), 'The tentative mail should be visible to the appointment organizer.').toBeVisible();
  });

  test('TC1109. Select the "Propose new time" option on the appointment invitation. The mail with new time proposed should be visible to the appointment organizer.', async ({secondPageManager, apiManager, pageManager}) => {
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await secondPageManager.mailDetails.AppointmentInvitation.Options.ProposeNewTime.click();
    await secondPageManager.newAppointment.Buttons.StartDatePicker.click();
    await secondPageManager.newAppointment.DatePickerElements.TimeListItem.first().click();
    await secondPageManager.newAppointment.Buttons.Send.click();
    await OpenInboxInSpecificUser(pageManager);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"New Time Proposed: ${appointmentTitle}"`), 'The mail with new time proposed should be visible to the appointment organizer.').toBeVisible();
  });

  test('TC1110. Unselect "Notify organizer" checkbox. The accept mail should not be visible in organizer inbox.', async ({secondPageManager, apiManager, pageManager}) => {
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await secondPageManager.mailDetails.AppointmentInvitation.Options.Notify.click();
    await secondPageManager.mailDetails.AppointmentInvitation.Options.Yes.click();
    await OpenInboxInSpecificUser(pageManager);
    await expect(pageManager.mailsList.Elements.Letter.locator(`"Accept: ${appointmentTitle}"`), 'The accept mail should not be visible in organizer inbox.').not.toBeVisible();
  });

  test("TC1111. Create new appointment with Personal Room. Organizer's Personal Room option should be visible in invitation.", async ({apiManager, secondPageManager}) => {
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager, "", BaseTest.userForLogin.login, BaseTest.baseUrl);
    await expect(secondPageManager.mailDetails.AppointmentInvitationSections.FirstField.locator(`"${BaseTest.userForLogin.login}'s Personal Room"`), "Organizer's Personal Room option should be visible in invitation.").toBeVisible();
  });

  test("TC1112. Create new appointment with link to Personal Room. Organizer's Personal Room option in invitation should have correct link.", async ({apiManager, secondPageManager}) => {
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager, "", BaseTest.userForLogin.login, BaseTest.baseUrl);
    await expect(secondPageManager.mailDetails.AppointmentInvitationSections.FirstField.locator(`[href = "${BaseTest.baseUrl}"]`), "Organizer's Personal Room option in invitation should have correct link.").toBeVisible();
  });

  test('TC1113. Send an email to the participant from an appointment invitation. New email board should be visible.', async ({secondPageManager, apiManager}) => {
    test.fail(true, "Issue #60");
    await CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager);
    await secondPageManager.mailDetails.AppointmentInvitation.SendAnEmail.first().click();
    await expect(secondPageManager.newMail.Containers.MainContainer, 'New email board should be visible.').toBeVisible();
  });

  async function CreateAppointmentViaApiAndOpenInvitationInSecondUser(secondPageManager, apiManager, location?, roomName?, roomLink?) {
    await CreateAppointmentViaApiAndOpenInboxInSecondUser(secondPageManager, apiManager, location, roomName, roomLink);
    await secondPageManager.mailsList.OpenMail(appointmentTitle);
  };

  async function CreateAppointmentViaApiAndOpenInboxInSecondUser(secondPageManager, apiManager, location?, roomName?, roomLink?) {
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentTitle, BaseTest.userForLogin.login, BaseTest.secondUser.login, appointmentBody, location, roomName, roomLink);
    await OpenInboxInSpecificUser(secondPageManager);
  };

  async function OpenInboxInSpecificUser(specificPageManager) {
    await specificPageManager.sideMenu.OpenMenuTab(specificPageManager.sideMenu.SideMenuTabs.Mail);
    await specificPageManager.sideSecondaryMailMenu.OpenMailFolder.Inbox();
  };
});
