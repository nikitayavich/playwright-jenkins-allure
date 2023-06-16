import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class StorageSideMenu extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('_react=[path="/manage/storage"]'),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  List = {
    GlobalServers: {
      Header: this.Containers.MainContainer.locator('_react=[title="Global Servers"] >> nth=0'),
      ServersList: this.Containers.MainContainer.locator('_react=[key="servers_list"]'),
      BucketList: this.Containers.MainContainer.locator('_react=[key="bucket_list"]'),
    },
    ServerDetails: {
      Header: this.Containers.MainContainer.locator('_react=[title="Server Details"] >> nth=0'),
      DataVolumes: this.Containers.MainContainer.locator('_react=[key="data_volumes"][item.isSelected=true]'),
      HSMSettings: this.Containers.MainContainer.locator('_react=[key="hsm_settings"][item.isSelected=true]'),
    },
  };

  Elements = {
    ServerInDropdown: this.Containers.DropdownContainer.locator('[class*="bucket-list-panel"]'),
  };

  Textboxes = {
    SelectAServer: this.Containers.MainContainer.locator('[name="Select a Server"]'),
  };

  Buttons = {
    ShowServers: this.Containers.MainContainer.locator('[data-testid$="HardDriveOutline"]'),
  };

  async SelectServer(server) {
    await this.Buttons.ShowServers.click();
    await this.Elements.ServerInDropdown.locator(`"${server}"`).click();
  };
};
