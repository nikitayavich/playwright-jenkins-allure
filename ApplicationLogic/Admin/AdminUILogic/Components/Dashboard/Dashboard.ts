import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class Dashboard extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('_react=[key="dashboard"]'),
  };

  Fields = {
    WelcomeMessage: this.Containers.MainContainer.locator('_react=[userName="Carbonio Admin"]'),
    QuickAccess: this.Containers.MainContainer.locator('_react=[quickAccessItems]'),
    YourNotifications: this.Containers.MainContainer.locator('_react=[goToMailNotificationt]'),
    ServersList: this.Containers.MainContainer.locator('_react=[goToMailStoreServerList]'),
  };

  Buttons = {
    OpenAccounts: this.Fields.QuickAccess.locator('[class*="ActionContainer"]:has-text("Accounts") >> "Open"'),
    OpenMailingList: this.Fields.QuickAccess.locator('[class*="ActionContainer"]:has-text("Mailing List") >> "Open"'),
    GoToNotification: this.Containers.MainContainer.locator('"Go to notification"'),
    GoToMailstoresServersList: this.Containers.MainContainer.locator('"Go to mailstores servers list"'),
    Information: this.Fields.YourNotifications.locator('_react=[item.id="Information"]'),
    SelectedInformation: this.Fields.YourNotifications.locator('_react=[item.id="Information"][selected=true]'),
    Warning: this.Fields.YourNotifications.locator('_react=[item.id="Warning"]'),
    SelectedWarning: this.Fields.YourNotifications.locator('_react=[item.id="Warning"][selected=true]'),
    Error: this.Fields.YourNotifications.locator('_react=[item.id="Error"]'),
    SelectedError: this.Fields.YourNotifications.locator('_react=[item.id="Error"][selected=true]'),
    All: this.Fields.YourNotifications.locator('_react=[item.id="All"]'),
    SelectedAll: this.Fields.YourNotifications.locator('_react=[item.id="All"][selected=true]'),
  };
};
