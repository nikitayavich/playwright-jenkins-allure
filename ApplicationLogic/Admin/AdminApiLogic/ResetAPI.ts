import {BaseAdminAPI} from './BaseAdminAPI';

export class ResetAPI extends BaseAdminAPI {
  constructor(page) {
    super(page);
  };

  async ResetGlobalTheme() {
    await this.page.request.post(`${this.baseAdminUrl}${this.soapServiceUrl}${this.ModifyConfigRequest}`, {
      data: {"Body": {"ModifyConfigRequest": {"_jsns": "urn:zimbraAdmin", "a": [{"n": "carbonioWebUiDarkMode", "_content": "FALSE"}, {"n": "carbonioWebUiLoginLogo", "_content": ""}, {"n": "carbonioWebUiDarkLoginLogo", "_content": ""}, {"n": "carbonioWebUiLoginBackground", "_content": ""}, {"n": "carbonioWebUiDarkLoginBackground", "_content": ""}, {"n": "carbonioWebUiAppLogo", "_content": ""}, {"n": "carbonioWebUiDarkAppLogo", "_content": ""}, {"n": "carbonioWebUiFavicon", "_content": ""}, {"n": "carbonioWebUiTitle", "_content": ""}, {"n": "carbonioWebUiDescription", "_content": ""}, {"n": "carbonioAdminUiLoginLogo", "_content": ""}, {"n": "carbonioAdminUiDarkLoginLogo", "_content": ""}, {"n": "carbonioAdminUiAppLogo", "_content": ""}, {"n": "carbonioAdminUiDarkAppLogo", "_content": ""}, {"n": "carbonioAdminUiBackground", "_content": ""}, {"n": "carbonioAdminUiDarkBackground", "_content": ""}, {"n": "carbonioAdminUiFavicon", "_content": ""}, {"n": "carbonioAdminUiTitle", "_content": ""}, {"n": "carbonioAdminUiDescription", "_content": ""}]}}, "Header": {"context": {"_jsns": "urn:zimbra", "account": {"by": "name", "_content": "zextras@demo.zextras.io"}, "authToken": [{}]}}},
    });
  };

  async ResetDomainTheme() {
    await this.page.request.post(`${this.baseAdminUrl}${this.soapServiceUrl}${this.ModifyDomainRequest}`, {
      data: {"Body": {"ModifyDomainRequest": {"id": await this.GetDomainId(), "_jsns": "urn:zimbraAdmin", "a": [{"n": "carbonioWebUiDarkMode", "_content": "FALSE"}, {"n": "carbonioWebUiLoginLogo", "_content": ""}, {"n": "carbonioWebUiDarkLoginLogo", "_content": ""}, {"n": "carbonioWebUiLoginBackground", "_content": ""}, {"n": "carbonioWebUiDarkLoginBackground", "_content": ""}, {"n": "carbonioWebUiAppLogo", "_content": ""}, {"n": "carbonioWebUiDarkAppLogo", "_content": ""}, {"n": "carbonioWebUiFavicon", "_content": ""}, {"n": "carbonioWebUiTitle", "_content": ""}, {"n": "carbonioWebUiDescription", "_content": ""}, {"n": "carbonioAdminUiLoginLogo", "_content": ""}, {"n": "carbonioAdminUiDarkLoginLogo", "_content": ""}, {"n": "carbonioAdminUiAppLogo", "_content": ""}, {"n": "carbonioAdminUiDarkAppLogo", "_content": ""}, {"n": "carbonioAdminUiBackground", "_content": ""}, {"n": "carbonioAdminUiDarkBackground", "_content": ""}, {"n": "carbonioAdminUiFavicon", "_content": ""}, {"n": "carbonioAdminUiTitle", "_content": ""}, {"n": "carbonioAdminUiDescription", "_content": ""}]}}, "Header": {"context": {"_jsns": "urn:zimbra", "account": {"by": "name", "_content": "zextras@demo.zextras.io"}, "authToken": [{}]}}},
    });
  };
};
