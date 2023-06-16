import {ModalWindowBase} from './ModalWindowBase';
import Colors from '../../../../../TestData/IconColorList.json';

export class EditTagModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Edit: this.Containers.MainContainer.locator('button [class*="Text__Comp"]'),
  };

  Textboxes = {
    TagName: this.Containers.MainContainer.locator('[name="Tag name"]'),
  };

  DropdownOptions = {
    OpenCloseDropdown: this.Containers.MainContainer.locator('[class*="Dropdown"]'),
    SelectColor: this.Containers.MainContainer.locator('"Select Color"'),
  };

  async EditNameTag(newTagName) {
    await this.Textboxes.TagName.fill(newTagName);
    await this.Buttons.Edit.click();
  };

  async ChooseColor({pageManager}, color, tagName) {
    await pageManager.tagModals.OpenTagContextMenu.EditTagModal(tagName);
    await this.DropdownOptions.SelectColor.click();
    if (color === Colors[2].ColorSet) {
      await this.Containers.DropdownContainer.locator(Colors[0].ColorSet).click();
      await this.Buttons.Edit.click();
      await pageManager.tagModals.OpenTagContextMenu.EditTagModal(tagName);
      await this.DropdownOptions.SelectColor.click();
    };
    await this.Containers.DropdownContainer.locator(color).click();
    await this.Buttons.Edit.click();
  };
};
