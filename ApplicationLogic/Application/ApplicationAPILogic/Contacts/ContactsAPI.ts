import {BaseAPI} from '../BaseAPI';

export class ContactsAPI extends BaseAPI {
  constructor(page) {
    super(page);
  };

  ContactFolderIds = {
    Contacts: '7',
    EmailedContacts: '13',
    Trash: '3',
  };

  async getContactIds(user: string) {
    const contactIds = [];
    // eslint-disable-next-line guard-for-in
    for (const folder in this.ContactFolderIds) {
      const response = await this.page.request.post(`${this.soapServiceUrl}${this.searchRequest}`, {
        data: {
          Body: {
            SearchRequest: {
              query: {"_content": `inid:"${this.ContactFolderIds[folder]}"`},
              _jsns: 'urn:zimbraMail',
              types: 'contact',
            },
          },
          Header: {
            context: {
              _jsns: 'urn:zimbra',
              account: {by: 'name', _content: user},
            },
          },
        },
      });
      const body = await this.GetResponseBody(response);
      if (body.Body.SearchResponse.cn) {
        const contacts = body.Body.SearchResponse.cn;
        contactIds.push(...(contacts.flatMap((contact) => contact.id)));
      };
    };
    return contactIds;
  };

  async DeleteContactsViaAPI(user) {
    const contactIds = await this.getContactIds(user);
    await Promise.all(contactIds.map(async (id) => await this.ItemActionRequest(id, user)));
  };
};
