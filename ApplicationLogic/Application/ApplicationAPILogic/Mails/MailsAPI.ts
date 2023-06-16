import {BaseAPI} from '../BaseAPI';

export class MailsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  MailFolderIds = {
    Inbox: '2',
    Junk: '4',
    Sent: '5',
    Draft: '6',
    Trash: '3',
  };

  async getMailIds(user: string) {
    const mailIds = [];
    // eslint-disable-next-line guard-for-in
    for (const folder in this.MailFolderIds) {
      const response = await this.page.request.post(`${this.soapServiceUrl}${this.searchRequest}`, {
        data: {
          Body: {
            SearchRequest: {
              query: `inId:"${this.MailFolderIds[folder]}"`,
              _jsns: 'urn:zimbraMail',
            },
          },
          Header: {
            context: {
              _jsns: 'urn:zimbra',
              account: {by: 'name', _content: user},
            },
          },
        },
      });
      const body = await this.GetResponseBody(response);
      if (body.Body.SearchResponse.c) {
        const mails = body.Body.SearchResponse.c;
        mailIds.push(...(mails.flatMap((mail) => mail.id)));
      };
    };
    return mailIds;
  };

  async MoveMailToFolder(mailId, user, folderId) {
    await this.page.request.post(`${this.soapServiceUrl}${this.msgActionRequest}`, {
      data: {
        Body: {MsgActionRequest: {_jsns: 'urn:zimbraMail', action: {id: mailId, op: 'move', l: folderId}}},
        Header: {
          context: {
            _jsns: 'urn:zimbra',
            notify: {seq: 2},
            session: {id: '163', _content: '163'},
            account: {by: 'name', _content: user},
            userAgent: {
              name: 'CarbonioWebClient - Chrome 105.0.0.0 (Windows)',
              version: '22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS',
            },
          },
        },
      },
    });
  };

  async DeleteMailsViaAPI(user) {
    const mailIds = await this.getMailIds(user);
    await Promise.all(mailIds.map(async (id) => await this.ItemActionRequest(id, user)));
  };
};
