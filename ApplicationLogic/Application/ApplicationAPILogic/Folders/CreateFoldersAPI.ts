import {BaseAPI} from "../BaseAPI";

export class CreateFoldersAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async CreateFolder(folderName: string, userMail: string) {
    let folderId = "";
    const response = await this.page.request.post(
      `${this.soapServiceUrl}${this.createFolderRequest}`,
      {
        data: {
          Body: {
            CreateFolderRequest: {
              _jsns: "urn:zimbraMail",
              folder: {view: "message", l: "5", name: folderName},
            },
          },
          Header: {
            context: {
              _jsns: "urn:zimbra",
              notify: {seq: 1},
              session: {id: "124", _content: "124"},
              account: {by: "name", _content: userMail},
              userAgent: {
                name: "CarbonioWebClient - Chrome 104.0.0.0 (Windows)",
                version: "22.7.2_ZEXTRAS_202207 agent 20220726-0959 FOSS",
              },
            },
          },
        },
      },
    );

    const body = await this.GetResponseBody(response);
    if (body.Body.CreateFolderResponse.folder) {
      folderId = body.Body.CreateFolderResponse.folder[0].id;
    }
    return folderId;
  };
}
