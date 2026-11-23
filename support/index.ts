import { test as base, expect, Page } from '@playwright/test'

import { Navbar } from '../pages/mission-control/navbar'
import { LoginPage } from '../pages/mission-control/login.page'
import { DashPage } from '../pages/mission-control/dash.page'
import { RegisterPage } from '../pages/mission-control/register.page'

import { Toast } from '../pages/shared/toast'

const createApp = (page: Page) => ({
    loginPage: new LoginPage(page),
    navbar: new Navbar(page),
    dashboardPage: new DashPage(page),
    dashPage: new DashPage(page),
    registerPage: new RegisterPage(page),
    toast: new Toast(page)
})

type App = ReturnType<typeof createApp>

export const test = base.extend<{ app: App }>({
    app: async ({ page }, use) => {
        await use(createApp(page))
    }
})

export { expect }
