import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class SearchStatisticsHeader extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('_react=[label*="Results"]'),
  };

  Buttons = {
    ClearSearch: this.Containers.MainContainer.locator('"CLEAR SEARCH"'),
  };

  Elements = {
    SearchSnippet: this.Containers.MainContainer.locator('_react=[key]'),
  };
}
