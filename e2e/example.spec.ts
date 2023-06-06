import { test, expect} from '@playwright/test';
import { allure } from "allure-playwright"
import locs from '../pages/locators';



test.beforeEach(async ({ page }) => {
  await page.goto('https://otto.de/')
  await page.getByRole('button', { name: "OK" }).click()
})

test.describe('first suite', () => {
  test('check the tab title and the URL of the page', async ({ page }) => {
    allure.suite('Example of allure suite')
    // await expect(page).toHaveTitle('oOTTO - Mode, Möbel & Technik » Zum Online-Shop')
    await expect(page).toHaveURL(/.*otto.dee/)

  })

  // test('check the cookie bar visibility after set up closing', async ({ page }) => {
  //   const cookieBanner = page.locator('#cookieBanner')
  //   await expect(cookieBanner).toHaveCSS('visibility', 'hidden')
  // })
  // test('hover to the first element in the main bar', async ({ page }) => {
  //   const elementToHover = page.getByRole('link', { name: 'Inspiration', exact: true })
  //   await elementToHover.hover()
  //   await page.waitForTimeout(5000)
  //   await page.hover("//span[contains(text(),'Herren')]")
  // })
  test('search field check', async ({ page }) => {
    await page.click(locs.searchField)
    const searchWord = 'candino'
    await page.fill(locs.searchField, searchWord)
    await page.press(locs.searchField, 'Enter')
    //await page.click(locs.searchLens)
    await page.waitForTimeout(5000)
    await expect(page.locator(locs.searchWordResuts)).toHaveText(" „" + searchWord + "“")

  })


})




