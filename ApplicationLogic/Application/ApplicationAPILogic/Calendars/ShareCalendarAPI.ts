import {BaseAPI} from '../BaseAPI';

export class ShareCalendarAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async RevokeSharingOfCalendar(user: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.folderActionRequest}`, {
      data: {
        "Body": {"FolderActionRequest": {"action": {"id": "10", "op": "update", "l": "1", "name": "Calendar", "color": "0", "f": "#"}, "_jsns": "urn:zimbraMail"}}, "Header": {"context": {"_jsns": "urn:zimbra", "notify": {"seq": 1}, "session": {"id": "110", "_content": "110"}, "account": {"by": "name", "_content": user}, "userAgent": {"name": "CarbonioWebClient - Chrome 104.0.0.0 (Windows)", "version": "22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS"}}},
      },
    });
  };

  async ShareCalendar(userOwner: string, userForShare: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.folderActionRequest}`, {
      headers: {['content-type']: 'application/soap+xml'},
      data: `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Header><context xmlns="urn:zimbra"><account by="name">${userOwner}</account><format type="js"/></context></soap:Header><soap:Body><BatchRequest xmlns="urn:zimbra" onerror="stop"><FolderActionRequest xmlns="urn:zimbraMail" requestId="0"><action op="grant" id="10"><grant gt="usr" inh="1" d="${userForShare}" perm="r" pw=""/></action></FolderActionRequest></BatchRequest></soap:Body></soap:Envelope>`,
    });
  };
}
