import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'public/screenshots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await page.goto('http://localhost:5174')
await page.waitForLoadState('networkidle')

// 1. Main app — empty state
await page.screenshot({ path: `${OUT}/01-main.png`, fullPage: false })
console.log('✓ 01-main.png')

// 2. Fill in the input panel with realistic sample data
await page.fill('#feature-name', 'User Login')
await page.fill('#requirements',
`As a registered user, I want to log into the application so I can access my account.

Acceptance Criteria:
- AC1: User can log in with valid email and password
- AC2: Incorrect credentials display an error message
- AC3: Account locks after 5 consecutive failed attempts
- AC4: User can reset their password via email link
- AC5: Session expires after 30 minutes of inactivity`)

await page.screenshot({ path: `${OUT}/02-input-filled.png`, fullPage: false })
console.log('✓ 02-input-filled.png')

// 3. Settings modal
await page.click('button[aria-label="More options"]')
await page.waitForTimeout(200)
await page.click('text=Settings')
await page.waitForSelector('[role="dialog"]')
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/03-settings.png`, fullPage: false })
console.log('✓ 03-settings.png')
await page.keyboard.press('Escape')
await page.waitForTimeout(200)

// 4. About modal
await page.click('button[aria-label="More options"]')
await page.waitForTimeout(200)
await page.click('text=About this project')
await page.waitForSelector('[role="dialog"]')
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/04-about.png`, fullPage: false })
console.log('✓ 04-about.png')
await page.keyboard.press('Escape')
await page.waitForTimeout(200)

// 5. Docs modal
await page.click('button[aria-label="More options"]')
await page.waitForTimeout(200)
await page.click('text=Docs')
await page.waitForSelector('[role="dialog"]')
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/05-docs.png`, fullPage: false })
console.log('✓ 05-docs.png')

await browser.close()
console.log('\nAll screenshots saved to', OUT)
