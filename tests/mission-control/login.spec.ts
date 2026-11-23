import { test, expect } from '../../support'

test.beforeEach(async ({ app }) => {
  await app.loginPage.go()
})

test('deve autenticar no controle de missões', async ({ app }) => {
  await app.loginPage.login('buzz@lunarpass.dev', 'pwd123')

  await expect(app.navbar.logout).toBeVisible()
})

test('não deve autenticar com e-mail inválido', async ({ app }) => {
  await app.loginPage.login('invalid@lunarpass.dev', 'pwd123')

  await expect(app.loginPage.alert).toHaveText('E-mail ou senha inválidos.')
})

test('não deve autenticar com senha inválida', async ({ app }) => {
  await app.loginPage.login('buzz@lunarpass.dev', 'wrongpassword')

  await expect(app.loginPage.alert).toHaveText('E-mail ou senha inválidos.')
})

test('não deve autenticar sem preencher os campos', async ({ app }) => {
  await app.loginPage.login('', '')

  await expect(app.loginPage.alert).toHaveText('Informe um e-mail válido')
})

test('não deve autenticar sem preencher o e-mail', async ({ app }) => {
  await app.loginPage.login('', 'wrongpassword')

  await expect(app.loginPage.alert).toHaveText('Informe um e-mail válido')
})

test('não deve autenticar sem preencher a senha', async ({ app }) => {
  await app.loginPage.login('buzz@lunarpass.dev', '')

  await expect(app.loginPage.alert).toHaveText('Informe a senha')
})
