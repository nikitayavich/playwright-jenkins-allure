import {Page} from '@playwright/test';
import {ModalWindowBase} from '../../ModalWindows/ModalWindowBase';

export class AddNewMembersModal extends ModalWindowBase {
  constructor(page: Page) {
    super(page);
  };

  Dropdowns = {
    MembersDropdownContainer: this.page.locator('[data-testid="popper"]'),
    ModeratorsDropdownContainer: this.Containers.DropdownContainer,
  };

  Fields = {
    AddMemberField: this.Containers.MainContainer.locator('[name="Add members"]'),
    AddModeratorField: this.Containers.MainContainer.locator('[name= "Add other moderators"]'),
  };

  Buttons = {
    CloseButton: this.Containers.MainContainer.locator('[data-testid*="Close"]'),
    SaveButton: this.Containers.MainContainer.locator('"Save"'),
    AddButton: this.Containers.MainContainer.locator('"Add"'),
  };

  Participants = {
    Member: this.Dropdowns.MembersDropdownContainer.locator(this.InheritedFields.SearchedContactLocator),
    Moderator: this.Dropdowns.ModeratorsDropdownContainer.locator(this.InheritedFields.SearchedContactLocator),
  };

  async AddNewMember(member) {
    await this.Fields.AddMemberField.fill(member);
    await this.Participants.Member.locator('nth=-1').click();
    await this.Buttons.SaveButton.click();
  };

  async AddNewModerator(moderator) {
    await this.Fields.AddModeratorField.type(moderator);
    await this.Participants.Moderator.click();
    await this.Buttons.AddButton.click();
  };
};
