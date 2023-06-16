import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class DomainsSideMenu extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('_react=[path="/manage/domains"]'),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  List = {
    Global: {
      Header: this.Containers.MainContainer.locator('_react=[title="Global"] >> nth=0'),
      Theme: this.Containers.MainContainer.locator('_react=[key="global/theme"]'),
    },
    Details: {
      Header: this.Containers.MainContainer.locator('_react=[title="Details"] >> nth=0'),
      GeneralSettings: this.Containers.MainContainer.locator('"General Settings"'),
      GAL: this.Containers.MainContainer.locator('"GAL"'),
      Authentication: this.Containers.MainContainer.locator('"Authentication"'),
      VirtualHostsAndCertificate: this.Containers.MainContainer.locator('"Virtual Hosts & Certificate"'),
      MailboxQuota: this.Containers.MainContainer.locator('"Mailbox Quota"'),
      Theme: this.Containers.MainContainer.locator('_react=[key="theme"]'),
    },
    Manage: {
      Header: this.Containers.MainContainer.locator('_react=[title="Manage"] >> nth=0'),
      Accounts: this.Containers.MainContainer.locator('"Accounts"'),
      MailingList: this.Containers.MainContainer.locator('"Mailing List"'),
      Resources: this.Containers.MainContainer.locator('"Resources"'),
      ActiveSync: this.Containers.MainContainer.locator('"ActiveSync"'),
      RestoreAccount: this.Containers.MainContainer.locator('"Restore Account"'),
    },
  };

  Elements = {
    DomainInDropdown: this.Containers.DropdownContainer.locator('[class*="domain-list-panel"]'),
  };

  Textboxes = {
    TypeHereADomain: this.Containers.MainContainer.locator('[name="Type here a domain"]'),
  };

  Buttons = {
    ShowDomains: this.Containers.MainContainer.locator('[data-testid$="GlobeOutline"]'),
  };

  async SelectDomain(domain) {
    await this.Buttons.ShowDomains.click();
    await this.Elements.DomainInDropdown.locator(`"${domain}"`).click();
  };
};
