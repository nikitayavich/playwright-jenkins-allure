import {Page} from '@playwright/test';
import {BaseAdminPage} from './BaseAdminPage';
import {AdminHeaderMenu} from '../Components/AdminHeaderMenu';
import {AdminSideMenu} from '../Components/AdminSideMenu';
import {Dashboard} from '../Components/Dashboard/Dashboard';
import {Notifications} from '../Components/Notifications/Notifications';
import {DomainsSideMenu} from '../Components/Domains/DomainsSideMenu';
import {DomainsDetailsTheme} from '../Components/Domains/DomainsDetailsTheme';
import {DomainsGlobalTheme} from '../Components/Domains/DomainsGlobalTheme';
import {ServersList} from '../Components/Storage/ServersList';
import {StorageSideMenu} from '../Components/Storage/StorageSideMenu';
import {DataVolumes} from '../Components/Storage/DataVolumes';
import {ResetModal} from '../Components/Modals/ResetModal';

export class AdminPageManager {
  page: Page;
  baseAdminPage;
  adminHeaderMenu;
  adminSideMenu;
  dashboard;
  notifications;

  // #region Domains
  domainsSideMenu;
  domainsDetailsTheme;
  domainsGlobalTheme;
  resetModal;
  // #endregion

  // #region Storage
  storageSideMenu;
  serversList;
  dataVolumes;
  // #endregion

  constructor(page) {
    this.page = page;
    this.baseAdminPage = new BaseAdminPage(page);
    this.adminHeaderMenu = new AdminHeaderMenu(page);
    this.adminSideMenu = new AdminSideMenu(page);
    this.dashboard = new Dashboard(page);
    this.notifications = new Notifications(page);
    this.resetModal = new ResetModal(page);

    // #region Domains
    this.domainsSideMenu = new DomainsSideMenu(page);
    this.domainsDetailsTheme = new DomainsDetailsTheme(page);
    this.domainsGlobalTheme = new DomainsGlobalTheme(page);
    // #endregion

    // #region Storage
    this.storageSideMenu = new StorageSideMenu(page);
    this.serversList = new ServersList(page);
    this.dataVolumes = new DataVolumes(page);
    // #endregion
  };
};
