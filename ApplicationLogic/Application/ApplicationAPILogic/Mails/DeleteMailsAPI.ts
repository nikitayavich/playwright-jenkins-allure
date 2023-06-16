import {BaseAPI} from '../BaseAPI';

export class DeleteMailsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async MoveToTrash(id: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.msgActionRequest}`, {
      data: {
        Body: {MsgActionRequest: {_jsns: 'urn:zimbraMail', action: {id: id, op: 'trash'}}},
      },
    });
  };

  async MoveToTrashById(id: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.convActionRequest}`, {
      data: {
        Body: {ConvActionRequest: {_jsns: 'urn:zimbraMail', action: {id: id, op: 'trash'}}},
        Header: {
          context: {
            _jsns: 'urn:zimbra',
            notify: {seq: 4},
            session: {id: '1971', _content: '1971'},
            account: {by: 'name', _content: 'test0@testautomation.local'},
            userAgent: {
              name: 'CarbonioWebClient - Chrome 103.0.0.0 (Windows)',
              version: '22.6.1_ZEXTRAS_202206 agent 20220621-1442 FOSS',
            },
          },
        },
      },
    });
  };
}
