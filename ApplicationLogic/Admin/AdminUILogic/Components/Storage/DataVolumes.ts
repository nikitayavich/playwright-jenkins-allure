import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class DataVolumes extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.DetailViewContainerLocator),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  VolumeTables = {
    Primary: this.Containers.MainContainer.locator('_react=[volumes] >> nth=0'),
    Secondary: this.Containers.MainContainer.locator('_react=[volumes] >> nth=1'),
    Indexer: this.Containers.MainContainer.locator('_react=[volumes] >> nth=2'),
  };

  VolumeTableRows = {
    PrimaryRow: this.VolumeTables.Primary.locator('_react=[row]'),
    SecondaryRow: this.VolumeTables.Secondary.locator('_react=[row]'),
    IndexerRow: this.VolumeTables.Indexer.locator('_react=[row]'),
  };

  Buttons = {
    NewVolume: this.Containers.MainContainer.locator('_react=[label="NEW VOLUME"]'),
  };
};
