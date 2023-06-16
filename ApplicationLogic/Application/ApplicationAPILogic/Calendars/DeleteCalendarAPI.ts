import {BaseAPI} from '../BaseAPI';

export class DeleteCalendarAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async CancelAppointmentRequest(id: string, user: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.searchRequest}`, {
      data: {
        "Body": {"CancelAppointmentRequest": {"_jsns": "urn:zimbraMail", "id": id, "comp": "0", "m": {"e": [{"a": "2", "p": "2", "t": "t"}], "su": "Cancelled: 2", "mp": {"ct": "multipart/alternative", "mp": [{"ct": "text/plain", "content": "The following meeting has been cancelled:\n\n"}]}}}}, "Header": {"context": {"_jsns": "urn:zimbra", "notify": {"seq": 2}, "session": {"id": "13904", "_content": "13904"}, "account": {"by": "name", "_content": user}, "userAgent": {"name": "CarbonioWebClient - Chrome 103.0.0.0 (Windows)", "version": "22.6.1_ZEXTRAS_202206 agent 20220621-1442 FOSS"}}},
      },
    });
  };

  async DeleteCalendarFolderRequest(id: string, user: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.searchRequest}`, {
      data: {
        "Body": {"FolderActionRequest": {"action": {"id": id, "op": "delete", "f": ""}, "_jsns": "urn:zimbraMail"}}, "Header": {"context": {"_jsns": "urn:zimbra", "session": {"id": "13415", "_content": "13415"}, "account": {"by": "name", "_content": user}, "userAgent": {"name": "CarbonioWebClient - Chrome 104.0.0.0 (Windows)", "version": "22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS"}}},
      },
    });
  };

  async MoveToTrashCalendarFolderRequest(id: string, user: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.searchRequest}`, {
      data: {
        "Body": {"FolderActionRequest": {"action": {"id": id, "op": "trash", "f": ""}, "_jsns": "urn:zimbraMail"}}, "Header": {"context": {"_jsns": "urn:zimbra", "session": {"id": "13415", "_content": "13415"}, "account": {"by": "name", "_content": user}, "userAgent": {"name": "CarbonioWebClient - Chrome 104.0.0.0 (Windows)", "version": "22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS"}}},
      },
    });
  };

  async EmptyTrashRequest(user: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.searchRequest}`, {
      data: {
        "Body": {"FolderActionRequest": {"action": {"id": "3", "op": "empty", "recursive": true, "f": ""}, "_jsns": "urn:zimbraMail"}}, "Header": {"context": {"_jsns": "urn:zimbra", "notify": {"seq": 9}, "session": {"id": "123277", "_content": "123277"}, "account": {"by": "name", "_content": user}, "userAgent": {"name": "CarbonioWebClient - Chrome 106.0.0.0 (Windows)", "version": "22.10.0_ZEXTRAS_202210 agent 20220923-0902 FOSS"}}},
      },
    });
  };
}
