import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';


export class BeforeYouLeaveModal extends ModalWindowBase {
  constructor(page) {
    super(page);
  };

  Buttons = {
    SaveDraft: this.Containers.MainContainer.locator('"Save Draft"'),
    DeleteDraft: this.Containers.MainContainer.locator('"Delete Draft"'),
    CloseCross: this.Containers.MainContainer.locator('[data-testid$="CloseOutline"]'),
  };
};
