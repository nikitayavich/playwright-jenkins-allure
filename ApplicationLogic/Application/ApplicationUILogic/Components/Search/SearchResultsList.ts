import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class SearchResultsList extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.WorkspaceContainerLocator),
    ListContainer: this.page.locator(this.InheritedFields.ListContainerLocator),
  };

  Buttons = {
    AdvancedFilters: this.Containers.MainContainer.locator('"Advanced Filters"'),
  };

  Elements = {
    SearchResult: this.Containers.ListContainer.locator(this.InheritedFields.ListItemLocator),
    PromptText: this.Containers.MainContainer.locator('"Select one or more results to perform actions or display details."'),
  };
};
