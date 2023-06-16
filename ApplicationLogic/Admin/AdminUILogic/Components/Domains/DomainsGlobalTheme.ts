import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class DomainsGlobalTheme extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.DetailViewContainerLocator),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  Tabs = {
    EndUser: this.Containers.MainContainer.locator('_react=[key="end_user"]'),
    AdminPanel: this.Containers.MainContainer.locator('_react=[key="admin_panel"]'),
  };

  Textboxes = {
    Title: this.Containers.MainContainer.locator('[name="carbonioWebUiTitle"]'),
    CopyrightsInformation: this.Containers.MainContainer.locator('[name="carbonioWebUiDescription"]'),
    LightLoginLogo: this.Containers.MainContainer.locator('[name="carbonioWebUiLoginLogo"]'),
    LightWebAppLogo: this.Containers.MainContainer.locator('[name="carbonioWebUiAppLogo"]'),
    DarkLoginLogo: this.Containers.MainContainer.locator('[name="carbonioWebUiDarkLoginLogo"]'),
    DarkWebAppLogo: this.Containers.MainContainer.locator('[name="carbonioWebUiDarkAppLogo"]'),
    LightLoginBackground: this.Containers.MainContainer.locator('[name="carbonioWebUiLoginBackground"]'),
    DarkLoginBackground: this.Containers.MainContainer.locator('[name="carbonioWebUiDarkLoginBackground"]'),
  };

  Buttons = {
    Save: this.Containers.MainContainer.locator('"Save"'),
  };

  Dropdowns = {
    DarkMode: this.Containers.MainContainer.locator('[class^="Dropdown"]:has-text("Dark Mode")'),
  };

  DarkModeOptions = {
    Enabled: this.Containers.DropdownContainer.locator('"Enabled"'),
    Disabled: this.Containers.DropdownContainer.locator('"Disabled"'),
  };

  SetThemeOption = {
    DarkModeEnabled: async () => await this.SetTheme(this.DarkModeOptions.Enabled),
    DarkModeDisabled: async () => await this.SetTheme(this.DarkModeOptions.Disabled),
    Title: async (value) => await this.SetTheme(this.Textboxes.Title, value),
    CopyrightsInformation: async (value) => await this.SetTheme(this.Textboxes.CopyrightsInformation, value),
    LightLoginLogo: async (value) => await this.SetTheme(this.Textboxes.LightLoginLogo, value),
    LightWebAppLogo: async (value) => await this.SetTheme(this.Textboxes.LightWebAppLogo, value),
    DarkLoginLogo: async (value) => await this.SetTheme(this.Textboxes.DarkLoginLogo, value),
    DarkWebAppLogo: async (value) => await this.SetTheme(this.Textboxes.DarkWebAppLogo, value),
    LightLoginBackground: async (value) => await this.SetTheme(this.Textboxes.LightLoginBackground, value),
    DarkLoginBackground: async (value) => await this.SetTheme(this.Textboxes.DarkLoginBackground, value),
  };

  async SetTheme(option, value?) {
    if (!value) {
      await this.Dropdowns.DarkMode.click();
      if (option === this.DarkModeOptions.Disabled) {
        await this.DarkModeOptions.Enabled.click();
        await this.Buttons.Save.click();
        await this.WaitForNotificationHiding();
        await this.Dropdowns.DarkMode.click();
      };
      await option.click();
    } else {
      option.fill(value);
    };
    await this.Buttons.Save.click();
    await this.WaitForNotificationHiding();
  };
};
