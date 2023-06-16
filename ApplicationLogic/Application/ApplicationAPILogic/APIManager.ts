import {Page} from '@playwright/test';
import {CalendarAPI} from './Calendars/CalendarAPI';
import {CreateCalendarAPI} from './Calendars/CreateCalendarAPI';
import {DeleteCalendarAPI} from './Calendars/DeleteCalendarAPI';
import {ShareCalendarAPI} from './Calendars/ShareCalendarAPI';
import {MailsAPI} from './Mails/MailsAPI';
import {CreateMailsAPI} from './Mails/CreateMailsAPI';
import {DeleteMailsAPI} from './Mails/DeleteMailsAPI';
import {ChatsAPI} from './Chats/ChatsAPI';
import {CreateChatsAPI} from './Chats/CreateChatsAPI';
import {DeleteChatsAPI} from './Chats/DeleteChatsAPI';
import {FilesAPI} from './Files/FilesAPI';
import {CreateFilesAPI} from './Files/CreateFilesAPI';
import {DeleteFilesAPI} from './Files/DeleteFilesAPI';
import {ContactsAPI} from './Contacts/ContactsAPI';
import {CreateContactsAPI} from './Contacts/CreateContactsAPI';
import {DeleteContactsAPI} from './Contacts/DeleteContactsAPI';
import {UsersAPI} from './UsersAPI';
import {CreateFoldersAPI} from './Folders/CreateFoldersAPI';
import {DeleteFoldersAPI} from './Folders/DeleteFoldersAPI';
import {AddressBookAPI} from './Contacts/AddressBooksAPI';
import {DeleteTagsAPI} from './Tags/DeleteTagsAPI';
import {TagsAPI} from './Tags/TagsAPI';
import {CreateTagsAPI} from './Tags/CreateTagsAPI';
import {FoldersAPI} from './Folders/FoldersAPI';

export class APIManager {
  page: Page;
  mailsAPI;
  createMailsAPI;
  deleteMailsAPI;
  calendarAPI;
  createCalendarAPI;
  deleteCalendarAPI;
  shareCalendarAPI;
  chatsAPI;
  createChatsAPI;
  deleteChatsAPI;
  filesAPI;
  createFilesAPI;
  deleteFilesAPI;
  contactsAPI;
  createContactsAPI;
  deleteContactsAPI;
  usersAPI;
  createFoldersAPI;
  deleteFoldersAPI;
  addressBookAPI;
  deleteTagsAPI;
  tagsAPI;
  createTagsAPI;
  foldersAPI;

  constructor(page) {
    this.page = page;
    this.mailsAPI = new MailsAPI(this.page);
    this.createMailsAPI = new CreateMailsAPI(this.page);
    this.deleteMailsAPI = new DeleteMailsAPI(this.page);
    this.calendarAPI = new CalendarAPI(this.page);
    this.createCalendarAPI = new CreateCalendarAPI(this.page);
    this.deleteCalendarAPI = new DeleteCalendarAPI(this.page);
    this.shareCalendarAPI = new ShareCalendarAPI(this.page);
    this.chatsAPI = new ChatsAPI(this.page);
    this.createChatsAPI = new CreateChatsAPI(this.page);
    this.deleteChatsAPI = new DeleteChatsAPI(this.page);
    this.filesAPI = new FilesAPI(this.page);
    this.createFilesAPI = new CreateFilesAPI(this.page);
    this.deleteFilesAPI = new DeleteFilesAPI(this.page);
    this.contactsAPI = new ContactsAPI(this.page);
    this.createContactsAPI = new CreateContactsAPI(this.page);
    this.deleteContactsAPI = new DeleteContactsAPI(this.page);
    this.usersAPI = new UsersAPI(this.page);
    this.createFoldersAPI = new CreateFoldersAPI(this.page);
    this.deleteFoldersAPI = new DeleteFoldersAPI(this.page);
    this.addressBookAPI = new AddressBookAPI(this.page);
    this.deleteTagsAPI = new DeleteTagsAPI(this.page);
    this.tagsAPI = new TagsAPI(this.page);
    this.createTagsAPI = new CreateTagsAPI(this.page);
    this.foldersAPI = new FoldersAPI(this.page);
  };
};