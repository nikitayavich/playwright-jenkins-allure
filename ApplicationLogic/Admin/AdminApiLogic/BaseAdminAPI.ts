import {Page, request, expect} from '@playwright/test';
import {BaseTest} from '../../../TestsLogic/BaseTest';

export async function AdminApiLoginMethod(login: string, password: string) {
  const apiContext = await request.newContext({baseURL: BaseTest.baseAdminUrl});
  const response = await apiContext.post('/service/admin/soap/AuthRequest', {
    data: {"Body": {"AuthRequest": {"_jsns": "urn:zimbraAdmin", "csrfTokenSecured": "1", "persistAuthTokenCookie": "1", "account": {"by": "name", "_content": login}, "password": {"_content": password}}},
    },
  });
  expect(response.ok(), 'API login request doesn`t bring success response').toBeTruthy();
  const body = await JSON.parse((await response.body()).toString());

  return body.Body.AuthResponse.authToken[0]._content;
};

export class BaseAdminAPI {
  readonly page: Page;
  readonly baseAdminUrl = BaseTest.baseAdminUrl;
  readonly soapServiceUrl = '/service/admin/soap/';
  // endpoints
  readonly ModifyConfigRequest = 'ModifyConfigRequest';
  readonly ModifyDomainRequest = 'ModifyDomainRequest';
  readonly GetDomainRequest = 'GetDomainRequest';
  readonly zextras = 'zextras';

  readonly domainNames = {
    demoZextrasIo: 'demo.zextras.io',
  };

  async GetResponseBody(response) {
    const body = await JSON.parse((await response.body()).toString());
    return body;
  };

  async GetDomainId(name = this.domainNames.demoZextrasIo) {
    const response = await this.page.request.post(`${this.baseAdminUrl}${this.soapServiceUrl}${this.GetDomainRequest}`, {
      data: {"Body": {"GetDomainRequest": {"_jsns": "urn:zimbraAdmin", "domain": {"by": "name", "_content": name}}}, "Header": {"context": {"_jsns": "urn:zimbra", "account": {"by": "name", "_content": "zextras@demo.zextras.io"}, "authToken": [{}]}}},
    });

    const body = await this.GetResponseBody(response);
    return body.Body.GetDomainResponse.domain[0].id;
  };

  async GetServerName() {
    const response = await this.page.request.post(`${this.baseAdminUrl}${this.soapServiceUrl}${this.zextras}`, {
      data: {"Body": {"zextras": {"_jsns": "urn:zimbraAdmin", "module": "ZxPowerstore", "action": "getAllVolumes", "targetServers": "all_servers"}}, "Header": {"context": {"_jsns": "urn:zimbra", "account": {"by": "name", "_content": "zextras@demo.zextras.io"}}}},
    });

    const body = await this.GetResponseBody(response);
    return Object.keys((JSON.parse(body.Body.response.content)).response)[0];
  };

  constructor(page: Page) {
    this.page = page;
  };
};
