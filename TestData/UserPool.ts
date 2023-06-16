export class User {
  login: String;
  password: String;

  constructor(login, password) {
    this.login = login;
    this.password = password;
  }
}

const playwrightProjectsData = JSON.parse(JSON.stringify(require('./PlaywrightProjectsData.json')));

export const userPool = [
  new User(playwrightProjectsData.users.test0.login, playwrightProjectsData.users.test0.password),
  new User(playwrightProjectsData.users.test1.login, playwrightProjectsData.users.test1.password),
  new User(playwrightProjectsData.users.test2.login, playwrightProjectsData.users.test2.password),
  new User(playwrightProjectsData.users.test3.login, playwrightProjectsData.users.test3.password),
  new User(playwrightProjectsData.users.test4.login, playwrightProjectsData.users.test4.password),
  new User(playwrightProjectsData.users.test5.login, playwrightProjectsData.users.test5.password),
  new User(playwrightProjectsData.users.test6.login, playwrightProjectsData.users.test6.password),
  new User(playwrightProjectsData.users.test7.login, playwrightProjectsData.users.test7.password),
  new User(playwrightProjectsData.users.test8.login, playwrightProjectsData.users.test8.password),
  new User(playwrightProjectsData.users.test9.login, playwrightProjectsData.users.test9.password),
  new User(playwrightProjectsData.users.test10.login, playwrightProjectsData.users.test10.password),
  new User(playwrightProjectsData.users.test11.login, playwrightProjectsData.users.test11.password),
  new User(playwrightProjectsData.users.test12.login, playwrightProjectsData.users.test12.password),
  new User(playwrightProjectsData.users.test13.login, playwrightProjectsData.users.test13.password),
  new User(playwrightProjectsData.users.test14.login, playwrightProjectsData.users.test14.password),
  new User(playwrightProjectsData.users.test15.login, playwrightProjectsData.users.test15.password),
  new User(playwrightProjectsData.users.test16.login, playwrightProjectsData.users.test16.password),
  new User(playwrightProjectsData.users.test17.login, playwrightProjectsData.users.test17.password),
  new User(playwrightProjectsData.users.test18.login, playwrightProjectsData.users.test18.password),
  new User(playwrightProjectsData.users.test19.login, playwrightProjectsData.users.test19.password),
  new User(playwrightProjectsData.users.test20.login, playwrightProjectsData.users.test20.password),
  new User(playwrightProjectsData.users.test21.login, playwrightProjectsData.users.test21.password),
  new User(playwrightProjectsData.users.test22.login, playwrightProjectsData.users.test22.password),
  new User(playwrightProjectsData.users.test23.login, playwrightProjectsData.users.test23.password),
  new User(playwrightProjectsData.users.test24.login, playwrightProjectsData.users.test24.password),
  new User(playwrightProjectsData.users.test25.login, playwrightProjectsData.users.test25.password),
  new User(playwrightProjectsData.users.test26.login, playwrightProjectsData.users.test26.password),
  new User(playwrightProjectsData.users.test27.login, playwrightProjectsData.users.test27.password),
  new User(playwrightProjectsData.users.test28.login, playwrightProjectsData.users.test28.password),
  new User(playwrightProjectsData.users.test29.login, playwrightProjectsData.users.test29.password),
];
