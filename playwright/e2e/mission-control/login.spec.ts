import { test, expect } from '../../support'

test.beforeEach(async ({ app }) => {
  await app.mission.loginPage.go()
})

test('deve autenticar no controle de missões', async ({ app }) => {
  await app.mission.loginPage.login('buzz@lunarpass.dev', 'pwd123')

  await expect(app.mission.navbar.logout).toBeVisible()
})

test('não deve autenticar com e-mail inválido', async ({ app }) => {
  await app.mission.loginPage.login('invalid@lunarpass.dev', 'pwd123')

  await expect(app.mission.loginPage.alert).toHaveText('E-mail ou senha inválidos.')
})

test('não deve autenticar com senha inválida', async ({ app }) => {
  await app.mission.loginPage.login('buzz@lunarpass.dev', 'wrongpassword')

  await expect(app.mission.loginPage.alert).toHaveText('E-mail ou senha inválidos.')
})

test('não deve autenticar sem preencher os campos', async ({ app }) => {
  await app.mission.loginPage.login('', '')

  await expect(app.mission.loginPage.alert).toHaveText('Informe um e-mail válido')
})

test('não deve autenticar sem preencher o e-mail', async ({ app }) => {
  await app.mission.loginPage.login('', 'wrongpassword')

  await expect(app.mission.loginPage.alert).toHaveText('Informe um e-mail válido')
})

test('não deve autenticar sem preencher a senha', async ({ app }) => {
  await app.mission.loginPage.login('buzz@lunarpass.dev', '')

  await expect(app.mission.loginPage.alert).toHaveText('Informe a senha')
})
