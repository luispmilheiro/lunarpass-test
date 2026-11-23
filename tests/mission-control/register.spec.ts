import { test, expect } from '../../support'
import { faker } from '@faker-js/faker'

import { Mission } from '../../support/types'
import { cleanMission, cleanAndInsertMission } from '../../support/database'

test.beforeEach(async ({ app }) => {
    await app.loginPage.go()
    await app.loginPage.login('buzz@lunarpass.dev', 'pwd123')
})

test('deve cadastrar uma nova missão', async ({ app }) => {

    const mission: Mission = {
        id: 'LP-0128A',
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000
    }

    await cleanMission(mission)

    await app.dashboardPage.addMission.click()
    await expect(app.registerPage.title).toBeVisible()
    await app.registerPage.submit(mission)

    await expect(app.toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.')
})

test('não deve cadastrar um código com formato inválido', async ({ app }) => {

    const mission: Mission = {
        id: faker.string.alphanumeric({ length: { min: 5, max: 5 }, casing: 'upper' }),
        rocket: 'Starship',
        baseId: 'aurora',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 1000
    }

    await app.dashboardPage.addMission.click()
    await expect(app.registerPage.title).toBeVisible()
    await app.registerPage.submit(mission)

    await expect(app.registerPage.alert).toHaveText('Use o formato LP-0000')
})

test('não deve cadastrar um código duplicado', async ({ app }) => {

    const mission: Mission = {
        id: 'LP-DUP01',
        rocket: 'Starship',
        baseId: 'orion',
        departureDate: '2030-01-20',
        returnDate: '2030-01-27',
        price: 500
    }

    await cleanAndInsertMission(mission)

    await app.dashboardPage.addMission.click()
    await expect(app.registerPage.title).toBeVisible()
    await app.registerPage.submit(mission)

    await expect(app.registerPage.alert).toHaveText('Já existe uma missão com este ID.')
})
