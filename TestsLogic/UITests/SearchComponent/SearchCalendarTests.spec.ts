import {expect} from '@playwright/test';
import {test, BaseTest} from '../../BaseTest';

test.describe('Search tests', async () => {
  let uniquePrefix;
  let appointmentName;
  let tagName;

  test.beforeEach(async ({apiManager}) => {
    BaseTest.setFeatureSuite.search();
    uniquePrefix = BaseTest.dateTimePrefix();
    appointmentName = uniquePrefix + ' AppointmentName Name';
    tagName = uniquePrefix + ' Autotest Tag';
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
  });

  test.afterEach(async ({page, apiManager}) => {
    await apiManager.calendarAPI.DeleteAppointmentsViaAPI(BaseTest.userForLogin.login);
    await apiManager.tagsAPI.DeleteTagsViaAPI(apiManager, BaseTest.userForLogin.login);
    await page.close();
  });

  async function OpenSearchTabAndOpenAdvancedFilters({pageManager}) {
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Search);
    await pageManager.searchResultsList.Buttons.AdvancedFilters.click();
  };

  async function CreateAppointmentWithTag({pageManager, apiManager, page}) {
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentName, BaseTest.userForLogin.login, 2, 'appointmentName body');
    await apiManager.createTagsAPI.CreateTagRequest(tagName, BaseTest.userForLogin.login);
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await page.waitForLoadState('domcontentloaded');
    await pageManager.sideSecondaryCalendarMenu.SelectOnlyCalendar();
    await pageManager.calendar.ChooseTagForAppointment(appointmentName, tagName);
  };

  test('TC704. Search appointment while calendar is active. @criticalPath', async ({apiManager, pageManager}) => {
    BaseTest.setSuite.criticalPath();
    await apiManager.createCalendarAPI.CreateAppointmentRequest(appointmentName, BaseTest.userForLogin.login, 2, 'appointmentName body');
    await pageManager.sideMenu.OpenMenuTab(pageManager.sideMenu.SideMenuTabs.Calendar);
    await pageManager.sideSecondaryCalendarMenu.CalendarSelecting.Select();
    await pageManager.headerMenu.MakeSearch(uniquePrefix);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${appointmentName}"`)).toBeVisible();
  });

  test('TC726. Search by tag found appointment. The appointment should be found by tag', async ({apiManager, pageManager, page}) => {
    await CreateAppointmentWithTag({pageManager, apiManager, page});
    await pageManager.headerMenu.MakeSearch(`tag:"${tagName}"`);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${appointmentName}"`)).toBeVisible();
  });

  test('TC713. Search by tag in advanced option found appointment. The appointment should be found by tag', async ({apiManager, pageManager, page}) => {
    test.fail(true, 'Issue #44');
    await CreateAppointmentWithTag({pageManager, apiManager, page});
    await OpenSearchTabAndOpenAdvancedFilters({pageManager});
    await pageManager.advancedFiltersModal.ChooseTagInDropdown(tagName);
    await expect(pageManager.searchResultsList.Elements.SearchResult.locator(`"${appointmentName}"`)).toBeVisible();
  });
});
