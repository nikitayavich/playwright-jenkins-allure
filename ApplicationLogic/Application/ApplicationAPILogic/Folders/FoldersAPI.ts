import {BaseAPI} from "../BaseAPI";

export class FoldersAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async GetAllCustomFoldersId() {
    const response = await this.page.request.post(`${this.soapServiceUrl}${this.getInfoRequest}`, {
      data: {"Body": {"GetInfoRequest": {"_jsns": "urn:zimbraAccount", "rights": "sendAs,sendAsDistList,viewFreeBusy,sendOnBehalfOf,sendOnBehalfOfDistList"}}, "Header": {"context": {"_jsns": "urn:zimbra", "session": {}, "userAgent": {"name": "CarbonioWebClient - Chrome 104.0.5112.20 (Windows)"}}}},
    });
    const body = await this.GetResponseBody(response);
    if (body.Header.context.refresh.folder) {
      const folderObjects = body.Header.context.refresh.folder[0].folder;
      const newFoldersArray = await Promise.all(folderObjects.map(async (conversation) => {
        return conversation.folder;
      }));
      const existingFolders = (newFoldersArray.filter(Boolean)).flat();
      if (existingFolders.length !== 0) {
        const folderIds = await Promise.all(existingFolders.map(async (conversation) => {
          return conversation.id;
        }));
        return folderIds;
      };
      return [];
    };
  };

  async DeleteFoldersViaAPI(apiManager, user) {
    const folderIds = await this.GetAllCustomFoldersId();
    await apiManager.deleteFoldersAPI.DeleteFolderPermanentlyById(folderIds?.join(','), user);
  };
}
