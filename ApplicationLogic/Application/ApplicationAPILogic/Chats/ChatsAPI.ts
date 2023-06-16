import {BaseAPI} from '../BaseAPI';

export class ChatsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async GetConversations() {
    let conversations = '';
    const response = await this.page.request.post(`${this.restServiceUrl}${this.getConversationsRequest}`, {
      data: {},
    });

    const body = await this.GetResponseBody(response);
    if (body.conversations) {
      conversations = body.conversations;
    }
    return conversations;
  };

  async GetUsers() {
    const response = await this.page.request.post(`${this.restServiceUrl}${this.getConversationsRequest}`, {
      data: {},
    });
    const body = await this.GetResponseBody(response);
    if (body.conversations) {
      const arrayOfConversations = body.conversations;
      const arrayOfMembersArrays = await Promise.all(arrayOfConversations.map(async (conversation) => {
        return conversation.members;
      }));
      const arrayOfMembers = arrayOfMembersArrays.flat();
      const membersIds = await Promise.all(arrayOfMembers.map(async (conversation) => {
        return conversation.user_id;
      }));
      return membersIds;
    };
  };
};
