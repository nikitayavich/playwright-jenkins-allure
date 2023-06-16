# Carbonio_PlaywrightFramework 🚀
**Zextras Carbonio** is a self-hosted software platform that guarantees full sovereignty over your data. 
It provides advanced e-mail management, calendars and events management, video meetings, chats and files management.

---
## Getting Started 💡

1. Generate ssh keys: [Tutorial](https://support.atlassian.com/bitbucket-cloud/docs/configure-ssh-and-two-step-verification/) 
2. Add key to your bitbucket: click [ Settings ] -> [ Personal bitbucket settings ] -> [ SSH key ] -> [ Add key ]
3. Go to [Repositories], choose [automationtesting]
4. Clone the project locally via https or ssh: `git clone https://UserName@bitbucket.org/zextras/automationtesting.git`
5. Navigate to the projects root directory and install its dependencies: `npm i`
6. Test are located within the tests directory and will run with the `npm run test` command. Results will be logged by default. 
7. To view a full report, run npm run `test:report` after your tests have completed. To modify your testing configuration, see the playwright.config.ts file in the root directory.
8. Also you can download extentions for writing code, such as: Playwright Test for VSCode v1.0.8  and ESLint to make your code writing process more easy.
---

## Wright tests 👨‍💻
1. We use GitFlow branching strategy, so first of all create your new branch:
  ```sh
   # Switch to new feature/ branch
   git checkout -b feature/BranchName
   ```
2. Write your tests and then use such commands to push your branch: 
  ```
  git status
  ```
  ```bash
  git add ./modified_file.ts
  ```
  ```bash
  git commit -m "Create tests TC100-120"
  ```
  ```bash
  git push origin feature/BranchName
  ```
3. For tests use such credantials: 
```
username : Test100...Test150
password : 812feee9-c08e-4ec5-9734-07f6e7a6b096
```

---

## Technology Stack 💻

### Programming Language

[![TypeScript](https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/javascript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML](https://img.shields.io/badge/html5-E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/css3-1572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![npm](https://img.shields.io/badge/npm-CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Node.js](https://img.shields.io/badge/node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Markdown](https://img.shields.io/badge/markdown-000000.svg?style=for-the-badge&logo=markdown&logoColor=white)](https://daringfireball.net/projects/markdown/)

### Frameworks and libraries

[![React](https://img.shields.io/badge/react-20232a.svg?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)


**Testing**:

[![Playwright](https://img.shields.io/badge/playwright-2EAD33.svg?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

---
## Page Objects ⭐️
**Page Objects** are a really nifty abstraction for the UI elements that you interact with in your tests. You can create simple getter functions for each element that you need to access. And optionally you can create convenience methods like loginWithCredentials() that allow you to write more concise tests.


```js
export class LoginPage extends BasePage {
  constructor(page, locator = pageLocator) {
    super(page, locator);
  };

  Containers = {
    MainContainer: this.page.locator('[class*="LoginContainer"]'),
    FormContainer: this.page.locator(pageLocator),
  };

  TextBox = {
    Login: this.Containers.FormContainer.locator('#input-0'),
    Password: this.Containers.FormContainer.locator('#password-0'),
  };

  Buttons = {
    Login: this.Containers.FormContainer.locator('[role="button"]:has-text("Login")'),
  };
};

```
---
## Test suits  📖
For this project test cases have been developed in order to cover the whole user path on the website including critical paths such as: adding to cart from the homepage, through the catalog, logging in with valid and invalid credentials, clearing the cart, etc. You can find an example of test suits here: [test suits](https://zextras.atlassian.net/l/cp/NCcX1Xuk);

| Test suit | TestID | Description | Steps | Test data | Expected result | Status  |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| TS01 Login | TC101 | Check User logs in with valid data | Go to URL                          Enter Username Enter Password Click “LOGIN” button | URL:                             https:// 2150.demo.zextras.io/ Username: test0@demo.zextras.io Password: assext0 | User enters the app. Main logo to be visible | AUTOMATED  |
| TS01 Login | TC102 | Check User logs out  | Go to URL Enter Username Enter Password Click “LOGIN” button Open Usermenu section  Click “Logout” option | URL:                             https:// 2150.demo.zextras.io/ Username: test0@demo.zextras.io Password: assext0 | User leaves the app. “LOGIN” button to be visible | AUTOMATED  |

## Bug report  📖
This document is created in order to describe and track issues (bugs and recommendations for improvements) appearing during Carbonio testing: 
[issues](https://zextras.atlassian.net/wiki/spaces/TSE/pages/2648834123/Issues);

---
## Test examples ✨
The tests in this project use [Safari](https://www.apple.com/ru/safari/), [Firefox](https://www.mozilla.org/) and [Google Chrome](https://www.google.com/) to demonstrate how to interact with some of the most common UI elements you will encounter. Including: dropdowns, basic auth, dynamic loading (waitUntil) and javascript alerts. 

```js
test.describe('Login tests', async () => {
  let userForLogin;

  test.beforeEach(async () => {
    BaseTest.setFeatureSuite.login();
  });

  test('TC101. Success login. @smoke', async ({browser}) => {
    BaseTest.setSuite.smoke();
    const page = await browser.newPage();
    await page.goto('/');
    const pageManager = new PageManager(page);
    await pageManager.loginPage.Login(userForLogin.login, BaseTest.userForLogin.password);
    await expect(pageManager.headerMenu.Logos.MainLogo).toBeVisible();
  });
});

```
---
## CI/CD ♾️

### Instruction on how to run tests
If the provisioning was successful, the previous push of the first commit should have triggered the first build process in Jenkins in the meantime, which can be viewed under the following steps:
1. Open Jenkins jobs page following by the link: https://ci.dev.zextras.com/job/Bitbucket%20Cloud/job/repository-automation/job/ui-end-to-end-tests/
2. Find the job with the “main” name and click the green “play” button.
3. Fill “STAGING” and “DOMAIN” fields. Then, click the “Build“ button.
4. Wait for the end of the build.

### Instructions on how to read reports
There are two types of test reports for the same test runs:
1. Pipeline run logs in Jenkins
2. Allure test report with traces. Each trace contains the list of actions the playwright performed and screenshots for these actions. 
Below are instructions on how to see each type of these reports.

### How to view pipeline run logs in Jenkins
1. Open the Jenkins page with pipeline runs by following this [link](https://ci.dev.zextras.com/blue/organizations/jenkins Bitbucket%20Cloud%2Frepository-automation%2Fui-end-to-end-tests/activity/)
2. Click on any pipeline run you want to analyse:
3. Select Chromium, Firefox or Webkit node to see logs for the corresponding browser.

### How to view Allure report and traces
1. Open the Jenkins page with pipeline runs by following this [link](https://ci.dev.zextras.com/job/Bitbucket Cloud/job/repository-automation/job/ui-end-to-end-tests/job/main/)
2. Choose pipeline build you want to analyse and click allure icon next to it:
3. On overview page you can:
    * click on exact job in trend panel
    * choose test suite by browser engine 
    * choose defects by category
Or you can do the same by clicking on Graphs/Suites/Categories tab in tab menu respectively
4. In order to review traces click on “Behaviors” tab. You can filter tests by status. Click on test you are going to explore. 
5. In test info panel on the right you can see all the test details. Click on trace (always choose trace with biggest size) and click on “Click to download attachment”
6. Open the link https://trace.playwright.dev/ in your web browser and drag-and-drop the downloaded archive into the window that opens or click “Select file” and upload it. Now you can explore the trace of the test case.

**Note**: Use the Forti Client VPN to connect to Jenkins and Allure. 
Click the following link to download [Forti Client VPN](https://www.fortinet.com/support/product-downloads). The name of VPN: "ZextrasGroupVPN".

---
## Reporters 📜
This projects uses both the spec-reporter and allure-reporter. The spec reporter offers great feedback when running from terminal and the allure reporter provides you with a nice report and screenshots that are automatically attached to failed tests. After running your the tests, run npm run report to generate the allure report. It's nifty.

This project implements [Allure](https://www.allure.com/) integration with [Playwright Test](https://playwright.dev) framework.

### Installation
```bash
npm i -D @playwright/test allure-playwright
```

### Usage
Either add **allure-playwright** into **playwright.config.ts**:
```js
{
  reporter: "allure-playwright";
}
```
Or pass the same value via command line:

```bash
npx playwright test --reporter=line,allure-playwright
```

### Specify location for allure results:
*  Mac / Linux
```bash
ALLURE_RESULTS_DIR=my-allure-results npx playwright test --reporter=line,allure-playwright
```
* Windows
```bash
set ALLURE_RESULTS_DIR=my-allure-results
npx playwright test --reporter=line,allure-playwright
```

### Generate Allure Report:
```bash
allure generate my-allure-results -o allure-report --clean
```

### Open Allure Report:
```bash
allure open allure-report
```




<!-- You need to create a cypress.env.json in order to override cypress default configuration in order to run your tests.

An example of env configuration you might need is:

{
"baseUrl": <server-to-test>,
"username": <your-username>,
"password": <your-password>
}

Then you can import those env variables in your test files:
const { baseUrl, username, password } = Cypress.env();

You can add all the variables you need in order to make your test work.


To write your tests check the following links.

Write your first test:
https://docs.cypress.io/guides/getting-started/writing-your-first-test#Write-your-first-test

Bundled tools:
https://docs.cypress.io/guides/references/bundled-tools#Mocha

Assertions:
https://docs.cypress.io/guides/references/assertions#Chai

Organize tests:
https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Configuring-Folder-Structure -->