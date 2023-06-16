import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class ContactDetails extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('_react=[path*="contactId"]'),
    EditContainer: this.page.locator('_react=[path*="editId"]'),
  };

  TypeIcons = {
    Mobile: ('_react=[icon="SmartphoneOutline"]'),
    Work: ('_react=[icon="BriefcaseOutline"]'),
    Home: ('_react=[icon="HomeOutline"]'),
    Other: ('_react=[icon="PersonOutline"]'),
  };

  Fields = {
    FirstName: this.Containers.MainContainer.locator('_react=[label="First Name"]'),
    LastName: this.Containers.MainContainer.locator('_react=[label="Last Name"]'),
    Email: this.Containers.MainContainer.locator('_react=[label="E-mail address"]'),
    PhoneNumber: this.Containers.MainContainer.locator('_react=[label="Phone contact"]'),
    Website: this.Containers.MainContainer.locator('_react=[label="Website"]'),
    Address: this.Containers.MainContainer.locator('_react=[label="Street"]'),

  };

  Chevrons = {
    DetailsChevronUp: this.Containers.MainContainer.locator('_react=[data-testid="contact-preview-content-desktop"] >> _react=ArrowIosUpward'),
    DetailsChevronDown: this.Containers.MainContainer.locator('_react=[data-testid="contact-preview-content-desktop"] >> _react=ArrowIosDownward'),
    EmailChevronDown: this.Containers.MainContainer.locator('_react=[label="E-mail address"] >> _react=ArrowIosDownward'),
    PhoneNumberChevronDown: this.Containers.MainContainer.locator('_react=[label="Phone contact"] >> _react=ArrowIosDownward'),
    WebsiteChevronDown: this.Containers.MainContainer.locator('_react=[label="Website"] >> _react=ArrowIosDownward'),
    AddressChevronDown: this.Containers.MainContainer.locator('_react=[label="Address"] >> _react=ArrowIosDownward'),
  };

  ContactOptions = {
    Edit: this.Containers.MainContainer.locator('"Edit"'),
  };

  EditContactView = {
    Save: this.Containers.EditContainer.locator('"Save"'),
    FirstName: this.Containers.EditContainer.locator('[name="firstName"]'),
    LastName: this.Containers.EditContainer.locator('[name="lastName"]'),
    Email: this.Containers.EditContainer.locator('[name="email"]'),
    PhoneNumber: this.Containers.EditContainer.locator('[name="phone"]'),
    Website: this.Containers.EditContainer.locator('[name="URL"]'),
    Address: this.Containers.EditContainer.locator('[name="address"]'),

  };
}

