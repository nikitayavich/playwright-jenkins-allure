import {BasePage} from "../../../BasePage";

export class BaseApplicationPage extends BasePage {
  constructor(page) {
    super(page);
  };

  InheritedFields = {
    SideSecondaryBarLocator: '[data-testid="SideSecondaryBarContainer"]',
    WorkspaceContainerLocator: '[class*="BoardsRouterContainer"]',
    ListContainerLocator: '[class*="List"][orientation="column"]',
    ListItemLocator: '[class*="List"]:has([class^="Avatar"])',
    ContactBubbleLocator: '[class*="ChipContainer"]',
    DropdownItemReactLocator: '_react=[key]',
    NewItemBoardLocator: '[data-testid="NewItemContainer"]',
    NewItemBodyIframeLocator: '.tox-edit-area__iframe',
    NewItemBodyLocator: '.mce-content-body',
    ExpandFoldersLocator: '[data-testid="ExpandMoreIcon"]',
    ChatInfoContainerLocator: '[class*="InfoPanelContainer"]',
    ChatMembersContainerLocator: '[class*="ParticipantsListWidget"]',
    SearchedContactLocator: '[class*="SearchedContact"]',
  };
};
