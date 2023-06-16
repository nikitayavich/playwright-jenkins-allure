import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class ServersList extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.DetailViewContainerLocator),
  };
};
