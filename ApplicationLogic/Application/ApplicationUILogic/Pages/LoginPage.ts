import {BasePage} from '../../../BasePage';
import {PageManager} from './PageManager';

const pageLocator: string = '[class*="FormContainer"]';

export class LoginPage extends BasePage {
  constructor(page, locator = pageLocator) {
    super(page, locator);
  };

  Containers = {
    MainContainer: this.page.locator('[class*="LoginContainer"]'),
    FormContainer: this.page.locator(pageLocator),
  };

  readonly searchTextBox;

  TextBox = {
    Login: this.Containers.FormContainer.locator('#input-0'),
    Password: this.Containers.FormContainer.locator('#password-0'),
  };

  Buttons = {
    Login: this.Containers.FormContainer.locator('[role="button"]:has-text("Login")'),
  };

  async Login(login, password) {
    const pageManager = new PageManager(this.page);
    await this.TextBox.Password.fill(password);
    await this.TextBox.Login.fill(login);
    await this.Buttons.Login.click();
    await pageManager.headerMenu.Logos.MainLogo.waitFor();
  };

  async Logout() {
    const pageManager = new PageManager(this.page);
    await pageManager.headerMenu.OpenUserMenuSection(pageManager.headerMenu.UserMenu.Logout);
  };

  async Relogin(login, password) {
    await this.Logout();
    await this.Login(login, password);
  };

  async GetBackgroundImagePath() {
    return await this.Containers.MainContainer.evaluate((el) => window.getComputedStyle(el).backgroundImage.slice(4, -1).replace(/"/g, ""));
  };
};
