import {BaseAPI} from '../BaseAPI';

export class DeleteContactsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async DeleteContactsById(id, user) {
    await this.page.request.post(`${this.soapServiceUrl}${this.contactActionRequest}`, {
      data: {
        Body: {ContactActionRequest: {_jsns: 'urn:zimbraMail', action: {id: id, op: 'move', l: '3'}}},
        Header: {
          context: {
            _jsns: 'urn:zimbra',
            session: {id: '1266', _content: '1266'},
            account: {by: 'name', _content: user},
            userAgent: {
              name: 'CarbonioWebClient - Chrome 104.0.0.0 (Windows)',
              version: '22.6.1_ZEXTRAS_202206 agent 20220621-1442 FOSS',
            },
          },
        },
      },
    });
  };

  async DeleteContactsPermanentlyById(id, user) {
    await this.page.request.post(`${this.soapServiceUrl}${this.contactActionRequest}`, {
      data: {
        Body: {ContactActionRequest: {_jsns: 'urn:zimbraMail', action: {id: id, op: 'delete'}}},
        Header: {
          context: {
            _jsns: 'urn:zimbra',
            session: {id: '1288', _content: '1288'},
            account: {by: 'name', _content: user},
            userAgent: {
              name: 'CarbonioWebClient - Chrome 104.0.0.0 (Windows)',
              version: '22.6.1_ZEXTRAS_202206 agent 20220621-1442 FOSS',
            },
          },
        },
      },
    });
  };
}
