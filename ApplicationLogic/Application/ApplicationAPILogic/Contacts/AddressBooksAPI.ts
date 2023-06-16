import {BaseAPI} from "../BaseAPI";

export class AddressBookAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async CreateAddressBook(folderName: string, userMail: string) {
    let folderId = "";
    const response = await this.page.request.post(
      `${this.soapServiceUrl}${this.createFolderRequest}`,
      {
        data: {
          Body: {
            CreateFolderRequest: {
              _jsns: "urn:zimbraMail",
              folder: {view: "contact", l: "7", name: folderName},
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

  async DeleteAddressBookById(id: string, user: string) {
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
            account: {by: "name", _content: user},
          },
        },
      },
    });
  };

  async GetDeletableAddressBooks(user: string) {
    const deletableAddressBooks: any [] = [];
    const response = await this.page.request.post(`${this.soapServiceUrl}${this.getFolderRequest}`, {
      headers: {['content-type']: 'application/soap+xml'},
      data: `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Header><context xmlns="urn:zimbra"><account by="name">${user}</account><format type="js"/></context></soap:Header><soap:Body><BatchRequest xmlns="urn:zimbra" onerror="stop"> <GetFolderRequest xmlns="urn:zimbraMail" visible="1"></GetFolderRequest></BatchRequest></soap:Body></soap:Envelope>`,
    });
    const body = await this.GetResponseBody(response);
    const addressBooks = body.Body.BatchResponse.GetFolderResponse[0].folder[0].folder;
    deletableAddressBooks.push(...(addressBooks.filter((folder) => folder.deletable)));
    deletableAddressBooks.push(...((addressBooks.filter((folder) => folder.folder))).flatMap((folder) => folder.folder));
    return deletableAddressBooks;
  };

  async EmptyTrashRequest(user: string) {
    await this.page.request.post(`${this.soapServiceUrl}${this.searchRequest}`, {
      data: {
        "Body": {"FolderActionRequest": {"action": {"id": "3", "op": "empty", "recursive": true, "f": ""}, "_jsns": "urn:zimbraMail"}}, "Header": {"context": {"_jsns": "urn:zimbra", "account": {"by": "name", "_content": user}}},
      },
    });
  };

  async DeleteAddressBooksViaAPI(user) {
    await Promise.all((await this.GetDeletableAddressBooks(user)).map(async (addressBook) => await this.DeleteAddressBookById(addressBook.id, user)));
    await this.EmptyTrashRequest(user);
  };
};
