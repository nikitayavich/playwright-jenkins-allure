import {Page} from '@playwright/test';
import {LoginPage} from './LoginPage';
import {BaseApplicationPage} from './BaseApplicationPage';
import {HeaderMenu} from '../Components/HeaderMenu';
import {NewMail} from '../Components/Mails/NewMail';
import {NewAppointment} from '../Components/Calendars/NewAppointment';
import {SideMenu} from '../Components/SideMenu';
import {SideSecondaryMailMenu} from '../Components/Mails/SideSecondaryMailMenu';
import {SideSecondaryCalendarMenu} from '../Components/Calendars/SideSecondaryCalendarMenu';
import {SideSecondaryContactsMenu} from '../Components/Contacts/SideSecondaryContactsMenu';
import {MailsList} from '../Components/Mails/MailsList';
import {Calendar} from '../Components/Calendars/Calendar';
import {ShareCalendarModal} from '../Components/Calendars/Modals/ShareCalendarModal';
import {MoveAppointmentModal} from '../Components/Calendars/Modals/MoveAppointmentModal';
import {DeleteCalendarModal} from '../Components/Calendars/Modals/DeleteCalendarModal';
import {NewCalendarModal} from '../Components/Calendars/Modals/NewCalendarModal';
import {RevokeShareCalendarModal} from '../Components/Calendars/Modals/RevokeShareCalendarModal';
import {EditCalendarPropertyModal} from '../Components/Calendars/Modals/EditCalendarPropertyModal';
import {CalendarAccessShareModal} from '../Components/Calendars/Modals/CalendarAccessShareModal';
import {NewContact} from '../Components/Contacts/NewContact';
import {ContactsList} from '../Components/Contacts/ContactsList';
import {ContactDetails} from '../Components/Contacts/ContactDetails';
import {SideSecondaryChatsMenu} from '../Components/Chats/SideSecondaryChatsMenu';
import {NewChatsModal} from '../Components/Chats/Modals/NewChatsModal';
import {NewVirtualRoomsModal} from '../Components/Chats/Modals/NewVirtualRoomsModal';
import {SideSecondaryFilesMenu} from '../Components/Files/SideSecondaryFilesMenu';
import {FilesList} from '../Components/Files/FilesList';
import {FileDetails} from '../Components/Files/FileDetails';
import {MailDetails} from '../Components/Mails/MailDetails';
import {SearchResultsList} from '../Components/Search/SearchResultsList';
import {SearchStatisticsHeader} from '../Components/Search/SearchStatisticsHeader';
import {ChatsInfo} from '../Components/Chats/ChatsInfo';
import {ChatsActionsModal} from '../Components/Chats/Modals/ChatsActionsModal';
import {ShareFolderModal} from '../Components/Mails/Modals/ShareFolderModal';
import {EditFolderModal} from '../Components/Mails/Modals/EditFolderModal';
import {CreateNewItemModal} from '../Components/Files/Modals/CreateNewItemModal';
import {FileChooserModal} from '../Components/Files/Modals/FileChooserModal';
import {NewAddressBookModal} from '../Components/Contacts/Modals/NewAddressBookModal';
import {MoveAddressBookModal} from '../Components/Contacts/Modals/MoveAddressBookModal';
import {ShareAddressBookModal} from '../Components/Contacts/Modals/ShareAddressBookModal';
import {MoveFolderModal} from '../Components/Mails/Modals/MoveFolderModal';
import {ReadReceiptRequiredModal} from '../Components/Mails/Modals/ReadReceiptRequiredModal';
import {WipeFolderModal} from '../Components/Mails/Modals/WipeFolderModal';
import {DeleteFolderModal} from '../Components/Mails/Modals/DeleteFolderModal';
import {BeforeYouLeaveModal} from '../Components/Mails/Modals/BeforeYouLeaveModal';
import {EditAddressBookModal} from '../Components/Contacts/Modals/EditAddressBookModal';
import {ChatField} from '../Components/Chats/ChatField';
import {VirtualRoomField} from '../Components/Chats/VirtualRoomField';
import {AddNewMembersModal} from '../Components/Chats/Modals/AddNewMembersModal';
import {DeleteAddressBookModal} from '../Components/Contacts/Modals/DeleteAddressBookModal';
import {DeleteContactPermanentlyModal} from '../Components/Contacts/Modals/DeleteContactPermanentlyModal';
import {MoveMailToFolderModal} from '../Components/Mails/Modals/MoveMailToFolderModal';
import {DeleteMailModal} from '../Components/Mails/Modals/DeleteMailModal';
import {NewChannelModal} from '../Components/Chats/Modals/NewChannelModal';
import {AdvancedFiltersModal} from '../Components/Search/Modals/AdvancedFiltersModal';
import {NewTagModal} from '../Components/ModalWindows/NewTagModal';
import {EditTagModal} from '../Components/ModalWindows/EditTagModal';
import {EditAfterMoveAppointmentModal} from '../Components/Calendars/Modals/EditAfterMoveAppointmentModal';
import {TagModals} from '../Components/ModalWindows/TagModals';
import {JoinVirtualRoomModal} from '../Components/Chats/Modals/JoinVirtualRoomModal';
import {MeetingPage} from '../Components/Chats/MeetingPage';

export class PageManager {
  page: Page;
  loginPage;
  baseApplicationPage;
  searchResultsList;
  searchStatisticsHeader;
  newContact;
  contactsList;
  contactDetails;
  sideSecondaryContactsMenu;
  headerMenu;
  sideMenu;
  newMail;
  sideSecondaryMailMenu;
  mailsList;
  mailDetails;
  newAppointment;
  sideSecondaryCalendarMenu;
  calendar;
  sideSecondaryChatsMenu;
  sideSecondaryFilesMenu;
  filesList;
  fileDetails;
  chatsInfo;
  chatField;
  virtualRoomField;
  newTagModal;
  editTagModal;
  tagModals;

  // #region Calendars Modal
  newCalendarModal;
  calendarAccessShareModal;
  editCalendarPropertyModal;
  revokeShareCalendarModal;
  shareCalendarModal;
  deleteCalendarModal;
  moveAppointmentModal;
  editAfterMoveAppointmentModal;
  // #endregion

  // #region Contacts Modal
  newAddressBookModal;
  moveAddressBookModal;
  shareAddressBookModal;
  editAddressBookModal;
  deleteAddressBookModal;
  deleteContactPermanentlyModal;
  // #endregion

  // #region Files Modal
  createNewItemModal;
  fileChooserModal;
  // #endregion

  // #region Mails Modal
  shareFolderModal;
  editFolderModal;
  moveFolderModal;
  wipeFolderModal;
  deleteFolderModal;
  moveMailToFolderModal;
  deleteMailModal;
  readReceiptRequiredModal;
  beforeYouLeaveModal;
  // #endregion

  // #region Chats Modal
  newChatsModal;
  addNewMembersModal;
  newChannelModal;
  newVirtualRoomsModal;
  chatsActionsModal;
  joinVirtualRoomModal;
  meetingPage;
  // #endregion

  // #region Search Modal
  advancedFiltersModal;
  // #endregion

  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.baseApplicationPage = new BaseApplicationPage(page);
    this.searchResultsList = new SearchResultsList(page);
    this.searchStatisticsHeader = new SearchStatisticsHeader(page);
    this.newContact = new NewContact(page);
    this.contactsList = new ContactsList(page);
    this.contactDetails = new ContactDetails(page);
    this.sideSecondaryContactsMenu = new SideSecondaryContactsMenu(page);
    this.headerMenu = new HeaderMenu(page);
    this.sideMenu = new SideMenu(page);
    this.newMail = new NewMail(page);
    this.sideSecondaryMailMenu = new SideSecondaryMailMenu(page);
    this.mailsList = new MailsList(page);
    this.mailDetails = new MailDetails(page);
    this.newAppointment = new NewAppointment(page);
    this.sideSecondaryCalendarMenu = new SideSecondaryCalendarMenu(page);
    this.calendar = new Calendar(page);
    this.sideSecondaryChatsMenu = new SideSecondaryChatsMenu(page);
    this.sideSecondaryFilesMenu = new SideSecondaryFilesMenu(page);
    this.filesList = new FilesList(page);
    this.fileDetails = new FileDetails(page);
    this.chatsInfo = new ChatsInfo(page);
    this.chatField = new ChatField(page);
    this.virtualRoomField = new VirtualRoomField(page);
    this.tagModals = new TagModals(page);
    this.newTagModal = new NewTagModal(page);
    this.editTagModal = new EditTagModal(page);

    // #region Calendars Modal
    this.shareCalendarModal = new ShareCalendarModal(page);
    this.calendarAccessShareModal = new CalendarAccessShareModal(page);
    this.editCalendarPropertyModal = new EditCalendarPropertyModal(page);
    this.revokeShareCalendarModal = new RevokeShareCalendarModal(page);
    this.newCalendarModal = new NewCalendarModal(page);
    this.deleteCalendarModal = new DeleteCalendarModal(page);
    this.moveAppointmentModal = new MoveAppointmentModal(page);
    this.editAfterMoveAppointmentModal = new EditAfterMoveAppointmentModal(page);
    // #endregion

    // #region Contacts Modal
    this.newAddressBookModal = new NewAddressBookModal(page);
    this.moveAddressBookModal = new MoveAddressBookModal(page);
    this.shareAddressBookModal = new ShareAddressBookModal(page);
    this.editAddressBookModal = new EditAddressBookModal(page);
    this.deleteAddressBookModal = new DeleteAddressBookModal(page);
    this.deleteContactPermanentlyModal = new DeleteContactPermanentlyModal(page);
    // #endregion

    // #region Files Modal
    this.createNewItemModal = new CreateNewItemModal(page);
    this.fileChooserModal = new FileChooserModal(page);
    // #endregion

    // #region Mails Modal
    this.shareFolderModal = new ShareFolderModal(page);
    this.editFolderModal = new EditFolderModal(page);
    this.moveFolderModal = new MoveFolderModal(page);
    this.wipeFolderModal = new WipeFolderModal(page);
    this.deleteFolderModal = new DeleteFolderModal(page);
    this.moveMailToFolderModal = new MoveMailToFolderModal(page);
    this.deleteMailModal = new DeleteMailModal(page);
    this.readReceiptRequiredModal = new ReadReceiptRequiredModal(page);
    this.beforeYouLeaveModal = new BeforeYouLeaveModal(page);
    // #endregion

    // #region Chats Modal
    this.newChatsModal = new NewChatsModal(page);
    this.addNewMembersModal = new AddNewMembersModal(page);
    this.newChannelModal = new NewChannelModal(page);
    this.newVirtualRoomsModal = new NewVirtualRoomsModal(page);
    this.chatsActionsModal = new ChatsActionsModal(page);
    this.joinVirtualRoomModal = new JoinVirtualRoomModal(page);
    this.meetingPage = new MeetingPage(page);
    // #endregion

    // #region Search Modal
    this.advancedFiltersModal = new AdvancedFiltersModal(page);
    // #endregion
  };
};
