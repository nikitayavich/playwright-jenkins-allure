import {BaseAPI} from "../BaseAPI";

export class DeleteFoldersAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async DeleteFolderById(id, user) {
    await this.page.request.post(`${this.soapServiceUrl}${this.folderActionRequest}`, {
      data: {
        Body: {
          FolderActionRequest: {
            action: {id: id, op: "move", l: "3"},
            _jsns: "urn:zimbraMail",
          },
        },
        Header: {
          context: {
            _jsns: "urn:zimbra",
            notify: {seq: 2},
            session: {id: "13024", _content: "13024"},
            account: {by: "name", _content: user},
            userAgent: {
              name: "CarbonioWebClient - Chrome 104.0.0.0 (Windows)",
              version: "22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS",
            },
          },
        },
      },
    });
  };

  async DeleteFolderPermanentlyById(id, user) {
    await this.page.request.post(`${this.soapServiceUrl}${this.folderActionRequest}`, {
      data: {
        Body: {
          FolderActionRequest: {
            action: {id: id, op: "delete", l: "3"},
            _jsns: "urn:zimbraMail",
          },
        },
        Header: {
          context: {
            _jsns: "urn:zimbra",
            session: {id: "119", _content: "119"},
            account: {by: "name", _content: user},
            userAgent: {
              name: "CarbonioWebClient - Chrome 104.0.0.0 (Windows)",
              version: "22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS",
            },
          },
        },
      },
    });
  };
}
