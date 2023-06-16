import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class SideSecondaryFilesMenu extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.SideSecondaryBarLocator),
  };

  Tabs = {
    Home: this.Containers.MainContainer.locator('"Home"'),
    SharedWithMe: this.Containers.MainContainer.locator('"Shared with me"'),
    Trash: this.Containers.MainContainer.locator('[data-testid*="ChevronDown"] >> nth=0'),
    Filters: this.Containers.MainContainer.locator('[data-testid*="ChevronDown"] >> nth=-1'),
    Uploads: this.Containers.MainContainer.locator('"Uploads"'),
    TrashElements: this.Containers.MainContainer.locator('"My elements"'),
    FiltersFlagged: this.Containers.MainContainer.locator('"Flagged"'),
    FiltersSharedByMe: this.Containers.MainContainer.locator('"Shared by me"'),
  };

  async OpenSecondaryMenuTab(tab) {
    await tab.click();
  };

  async OpenSubFolder(folderNumber, option) {
    await this.Containers.MainContainer.locator(`[data-testid*="ChevronDown"] >> nth=${folderNumber}`).click();
    await option.click();
  };

  Subfolders = {
    Trash: {
      TrashElements: this.Containers.MainContainer.locator('"My elements"'),
      SharedElements: this.Containers.MainContainer.locator('"Shared Elements"'),
    },
    Filters: {
      FiltersFlagged: this.Containers.MainContainer.locator('"Flagged"'),
      FiltersSharedByMe: this.Containers.MainContainer.locator('"Shared by me"'),
    },
  };

  SelectTrashSubfolder = {
    TrashElements: async () => await this.OpenSubFolder(0, this.Subfolders.Trash.TrashElements),
    SharedElements: async () => await this.OpenSubFolder(0, this.Subfolders.Trash.SharedElements),
  };

  SelectFilterSubfolder = {
    FiltersFlagged: async () => await this.OpenSubFolder(-1, this.Subfolders.Filters.FiltersFlagged),
    FiltersSharedByMe: async () => await this.OpenSubFolder(-1, this.Subfolders.Filters.FiltersSharedByMe),
  };
}


