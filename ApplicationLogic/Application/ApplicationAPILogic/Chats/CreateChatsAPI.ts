import {BaseAPI} from '../BaseAPI';

export class CreateChatsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async CreateSpace(title, topic, userIds) {
    const response = await this.page.request.post(`${this.restServiceUrl}${this.createSpaceRequest}`, {
      data: {"name": title, "invited_user_ids": userIds, "topic": topic},
    });

    const body = await this.GetResponseBody(response);
    return body.id;
  };

  async CreateGroup(topic, userId) {
    const response = await this.page.request.post(`${this.restServiceUrl}${this.createGroupRequest}`, {
      data: {"invited_user_ids": userId, "topic": topic},
    });
    const body = await this.GetResponseBody(response);
    return body;
  };

  async CreateVirtualRoom(name) {
    const instantMeetingResponse = await this.page.request.post(`${this.restServiceUrl}${this.createInstantMeetingRequest}`, {
      data: {"name": name},
    });
    const body = await this.GetResponseBody(instantMeetingResponse);
    const id = body.id;

    await this.page.request.post(`${this.restServiceUrl}${this.createMeetingRequest}`, {
      data: {"conversation_id": id, "scheduled": true, "name": name},
    });
  };

  async CreateChannel(spaceId, name, topic) {
    const response = await this.page.request.post(`${this.restServiceUrl}${this.createChannelRequest}`, {
      data: {"space_id": spaceId, "name": name, "topic": topic},
    });

    const body = await this.GetResponseBody(response);
    return body.id;
  };
}
