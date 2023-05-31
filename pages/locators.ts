
class Locators {
  herrenLink: string = "//div[@class='nav_navi-panel__body']/ul/li[5]";
  searchField: string = "//*[@data-qa-id='search-field']"
  searchLens: string = "//*[@data-qa='ftfind-search-submit']"
  searchWordResuts: string = "//div[@class='nav_grimm-breadcrumb-headline']/div[2]"


  static locators = {
    herrenLink: "//div[@class='nav_navi-panel__body']/ul/li[5]",
    searchField: "//*[@data-qa-id='search-field']",
    searchLens: "//*[@data-qa='ftfind-search-submit']",
    searchWordResuts: "//div[@class='nav_grimm-breadcrumb-headline']/div[2]"
  }
  locatorss = {
    herrenLink: "//div[@class='nav_navi-panel__body']/ul/li[5]",
    searchField: "//*[@data-qa-id='search-field']",
    searchLens: "//*[@data-qa='ftfind-search-submit']",
    searchWordResuts: "//div[@class='nav_grimm-breadcrumb-headline']/div[2]"
  }
}
export default new Locators();

