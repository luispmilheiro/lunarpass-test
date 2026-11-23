import { Page, Locator } from '@playwright/test'

export class DashPage {
    readonly page: Page
    readonly addMission: Locator

    constructor(page: Page) {
        this.page = page
        this.addMission = page.getByRole('link', { name: 'Nova missão' })
    }
}
