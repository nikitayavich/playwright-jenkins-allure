import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class NewContact extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.InheritedFields.NewItemBoardLocator),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  TypeOptions = {
    MobileType: this.Containers.DropdownContainer.locator('"mobile"'),
    WorkType: this.Containers.DropdownContainer.locator('"work"'),
    HomeType: this.Containers.DropdownContainer.locator('"home"'),
    OtherType: this.Containers.DropdownContainer.locator('"other"'),
  };

  Buttons = {
    Save: this.Containers.MainContainer.locator('"Save"'),
    PlusEmail: this.Containers.MainContainer.locator('_react=[name="email"] >> [data-testid*="Plus"]'),
    PlusPhone: this.Containers.MainContainer.locator('_react=[name="phone"] >> [data-testid*="Plus"]'),
    PlusWebsite: this.Containers.MainContainer.locator('_react=[name="URL"] >> [data-testid*="Plus"]'),
    PlusAddress: this.Containers.MainContainer.locator('_react=[name="address"] >> [data-testid*="Plus"]'),
    MinusEmail: this.Containers.MainContainer.locator('_react=[name="email"] >> [data-testid*="Minus"]'),
    MinusPhone: this.Containers.MainContainer.locator('_react=[name="phone"] >> [data-testid*="Minus"]'),
    MinusWebsite: this.Containers.MainContainer.locator('_react=[name="URL"] >> [data-testid*="Minus"]'),
    MinusAddress: this.Containers.MainContainer.locator('_react=[name="address"] >> [data-testid*="Minus"]'),
    SelectPhoneType: this.Containers.MainContainer.locator('_react=[name="phone"] >> "Select type"'),
    SelectWebsiteType: this.Containers.MainContainer.locator('_react=[name="URL"] >> "Select type"'),
    SelectAddressType: this.Containers.MainContainer.locator('_react=[name="address"] >> "Select type"'),
  };

  Inputs = {
    FirstName: this.Containers.MainContainer.locator('[placeholder="First Name*"]'),
    LastName: this.Containers.MainContainer.locator('[placeholder="Last Name*"]'),
    Email: this.Containers.MainContainer.locator('[placeholder="E-mail"]'),
    PhoneNumber: this.Containers.MainContainer.locator('[placeholder="Number"]'),
    Website: this.Containers.MainContainer.locator('[placeholder="Website"]'),
    Address: this.Containers.MainContainer.locator('[placeholder="Street"]'),
  };

  async CreateNewContact(firstName, lastName, email) {
    await this.Inputs.FirstName.click();
    await this.Inputs.FirstName.fill(firstName);
    await this.Inputs.LastName.click();
    await this.Inputs.LastName.fill(lastName);
    await this.Inputs.Email.click();
    await this.Inputs.Email.fill(email);
    await this.Buttons.Save.click();
  };
}
