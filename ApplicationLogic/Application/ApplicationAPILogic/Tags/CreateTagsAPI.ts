import {BaseAPI} from '../BaseAPI';

export class CreateTagsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async CreateTagRequest(tagName, user) {
    let id = '';
    const response = await this.page.request.post(`${this.soapServiceUrl}${this.createTagRequest}`, {
      data: {
        "Body": {"CreateTagRequest": {"_jsns": "urn:zimbraMail", "tag": {"name": tagName, "color": "0"}}}, "Header": {"context": {"_jsns": "urn:zimbra", "notify": {"seq": 2}, "session": {"id": "11520", "_content": "11520"}, "account": {"by": "name", "_content": user}, "userAgent": {"name": "CarbonioWebClient - Chrome 107.0.0.0 (Windows)", "version": "22.11.0_ZEXTRAS_202211 carbonio 20221109-1143 FOSS"}}},
      },
    });

    const body = await this.GetResponseBody(response);
    if (body.Body.CreateTagResponse.tag[0]) {
      id = body.Body.CreateTagResponse.tag[0].id;
    }
    return id;
  };
}
