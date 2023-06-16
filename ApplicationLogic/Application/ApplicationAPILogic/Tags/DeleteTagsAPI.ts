import {BaseAPI} from '../BaseAPI';

export class DeleteTagsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async DeleteTagRequest(id: string, user: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.tagActionRequest}`, {
      data: {
        "Body": {"TagActionRequest": {"_jsns": "urn:zimbraMail", "action": {"op": "delete", "id": id}}}, "Header": {"context": {"_jsns": "urn:zimbra", "notify": {"seq": 3}, "session": {"id": "11520", "_content": "11520"}, "account": {"by": "name", "_content": user}, "userAgent": {"name": "CarbonioWebClient - Chrome 107.0.0.0 (Windows)", "version": "22.11.0_ZEXTRAS_202211 carbonio 20221109-1143 FOSS"}}},
      },
    });
  };
}
