import {ShareModalWindow} from '../../ModalWindows/ShareModalWindow';

export class ShareFolderModal extends ShareModalWindow {
  constructor(page) {
    super(page);
  };

  ExtraButtons = {
    GoBack: this.Containers.MainContainer.locator('"GO BACK"'),
  };
}
