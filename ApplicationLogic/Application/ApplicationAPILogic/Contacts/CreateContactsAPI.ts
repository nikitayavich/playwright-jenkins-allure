import {BaseAPI} from '../BaseAPI';

export class CreateContactsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  async CreateContact(userFirstName: string, userMail: string) {
    let contactsId = '';
    const response = await this.page.request.post(`${this.soapServiceUrl}${this.createContactRequest}`, {
      data: {
        "Body": {"CreateContactRequest": {"_jsns": "urn:zimbraMail", "cn": {"m": [], "l": "7", "a": [{"n": "nameSuffix", "_content": ""}, {"n": "namePrefix", "_content": ""}, {"n": "firstName", "_content": userFirstName}, {"n": "lastName", "_content": ""}, {"n": "middleName", "_content": ""}, {"n": "image", "_content": ""}, {"n": "jobTitle", "_content": ""}, {"n": "department", "_content": ""}, {"n": "company", "_content": ""}, {"n": "notes", "_content": ""}, {"n": "email", "_content": userMail}]}}},
      },
    });
    const body = await this.GetResponseBody(response);

    if (body.Body.CreateContactResponse.cn) {
      contactsId = body.Body.CreateContactResponse.cn[0].id;
    }
    return contactsId;
  };
}
