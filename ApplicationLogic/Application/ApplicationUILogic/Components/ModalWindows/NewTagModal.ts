import {ModalWindowBase} from './ModalWindowBase';

export class NewTagModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    Create: this.Containers.MainContainer.locator('"Create"'),
  };

  Textboxes = {
    TagName: this.Containers.MainContainer.locator('[name="Tag name"]'),
  };

  Dropdowns = {
    OpenCloseDropdown: this.Containers.MainContainer.locator('[class*="Dropdown"]'),
    YellowColor: this.page.locator('"yellow"'),
  };

  async CreateTag(tagName) {
    await this.Textboxes.TagName.fill(tagName);
    await this.Buttons.Create.click();
  };
}
