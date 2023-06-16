import {Page} from '@playwright/test';
import {BaseAdminAPI} from './BaseAdminAPI';
import {ResetAPI} from './ResetAPI';

export class AdminAPIManager {
  page: Page;
  baseAdminAPI;
  resetAPI;

  constructor(page) {
    this.page = page;
    this.baseAdminAPI = new BaseAdminAPI(page);
    this.resetAPI = new ResetAPI(page);
  };
};
