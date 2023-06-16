import {Page, request, expect} from '@playwright/test';
import {BaseTest} from '../../../TestsLogic/BaseTest';

// eslint-disable-next-line no-unused-vars
type ActionRequestTypes = {
    delete: 'delete';
};

export async function ApiLoginMethod(login: string, password: string) {
  const authTokens: string[] = [];
  const baseUrl = BaseTest.baseUrl;
  const apiContext = await request.newContext({baseURL: baseUrl});
  const response = await apiContext.post('/zx/auth/v2/login', {
    data: {
      "auth_method": "password", "user": login, "password": password,
    },
  });
  expect(response.ok(), 'API login request doesn`t bring success response').toBeTruthy();
  const headersArray = response.headersArray();
  const rx = /(ZX_AUTH_TOKEN|ZM_AUTH_TOKEN)=[^;]*/g;
  let token;
  headersArray.forEach((header) => {
    if (header.name == 'set-cookie') {
      token = header.value.match(rx)[0];
      authTokens.push(token.replace('ZX_AUTH_TOKEN=', '').replace('ZM_AUTH_TOKEN=', ''));
    }
  });
  return authTokens;
};

export class BaseAPI {
  readonly page: Page;
  readonly soapServiceUrl = 'service/soap/';
  readonly restServiceUrl = 'zx/team/v21/';
  readonly graphqlServiceUrl = 'services/files/graphql';

  // Endpoints
  readonly searchRequest = 'SearchRequest';
  readonly itemActionRequest = 'ItemActionRequest';
  readonly tagActionRequest = 'TagActionRequest';
  readonly getInfoRequest = 'GetInfoRequest';
  // Mails
  readonly convActionRequest = 'ConvActionRequest';
  readonly saveDraftRequest = 'SaveDraftRequest';
  readonly sendMsgRequest = 'SendMsgRequest';
  readonly msgActionRequest = 'MsgActionRequest';
  // Calendar
  readonly createAppointmentRequest = 'CreateAppointmentRequest';
  readonly cancelAppointmentRequest = 'CancelAppointmentRequest';
  readonly createTagRequest = 'CreateTagRequest';
  // Chats
  readonly getConversationsRequest = 'getConversations';
  readonly getConversationRequest = 'getConversation';
  readonly createSpaceRequest = 'createSpace';
  readonly createGroupRequest = 'createGroup';
  readonly createChannelRequest = 'createChannel';
  readonly deleteConversationRequest = 'deleteConversation';
  readonly leaveConversationRequest = 'leaveConversation';
  readonly kickFromConversationRequest = 'kickFromConversation';
  readonly clearConversationRequest = 'clearConversation';
  readonly createInstantMeetingRequest = 'createInstantMeeting';
  readonly createMeetingRequest = 'createMeeting';
  // Files
  readonly uploadFileRequest = 'services/files/upload';
  readonly createDocumentRequest = 'services/docs/files/create';
  readonly uploadToRequest = 'services/files/upload-to';
  // Contacts
  readonly contactActionRequest = 'ContactActionRequest';
  readonly createContactRequest = 'CreateContactRequest';
  // Users
  readonly getUserDetailsRequest = 'getUserDetails';
  // Folders
  readonly createFolderRequest = 'CreateFolderRequest';
  readonly folderActionRequest = 'FolderActionRequest';
  readonly getFolderRequest = 'GetFolderRequest';

  readonly ActionRequestTypes = {
    delete: 'delete',
  };

  constructor(page: Page) {
    this.page = page;
  };

  async GetResponseBody(response) {
    const body = await JSON.parse((await response.body()).toString());
    return body;
  };

  async ItemActionRequest(id: string, user: string, action = this.ActionRequestTypes.delete) {
    await this.page.request.post(`${this.soapServiceUrl}${this.itemActionRequest}`, {
      data: {
        "Body": {"ItemActionRequest": {"_jsns": "urn:zimbraMail", "action": {"op": action, "id": id}}}, "Header": {"context": {"_jsns": "urn:zimbra", "account": {"by": "name", "_content": user}}},
      },
    });
  };

  async GetFolders(user: string, view: string) {
    const response = await this.page.request.post(`${this.soapServiceUrl}${this.getFolderRequest}`, {
      headers: {['content-type']: 'application/soap+xml'},
      data: `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Header><context xmlns="urn:zimbra"><account by="name">${user}</account><format type="js"/></context></soap:Header><soap:Body><BatchRequest xmlns="urn:zimbra" onerror="stop"> <GetFolderRequest xmlns="urn:zimbraMail" visible="1" view="${view}"></GetFolderRequest></BatchRequest></soap:Body></soap:Envelope>`,
    });
    const body = await this.GetResponseBody(response);
    return body.Body.BatchResponse.GetFolderResponse[0].folder[0].folder;
  };
};
