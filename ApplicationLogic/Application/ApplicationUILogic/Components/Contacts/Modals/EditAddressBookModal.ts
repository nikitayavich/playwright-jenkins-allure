import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class EditAddressBookModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Edit: this.Containers.MainContainer.locator('"Edit"'),
    Empty: this.Containers.MainContainer.locator('"Empty"'),
  };

  TextBoxes = {
    AddressBookName: this.Containers.MainContainer.locator('[placeholder="Address book name"]'),
  };

  DropDown = {
    DestinationFolderList: this.Containers.MainContainer.locator('"Destination folder"'),
    ColorList: this.Containers.MainContainer.locator('"Select Color"'),
  };
}
