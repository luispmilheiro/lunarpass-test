import { test, expect } from '../../support'

test('deve validar o título na aba do navegador', async ({ page, app }) => {
  await app.store.homePage.go()

  await expect(page).toHaveTitle(/Lunar Pass/)
})

test('deve exibir o slogan na homepage', async ({ app }) => {
  await app.store.homePage.go()

  await expect(app.store.homePage.slogan).toBeVisible()
})
