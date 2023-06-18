import puppeteer from 'puppeteer'
import { writeExcel, writeJson } from './utils/index.js'
import randomUseragent from 'random-useragent'

const openWebPage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 400
  })
  const page = await browser.newPage()

  await page.goto('https://example.com')
  await browser.close()
}

const captureScreenshoot = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 400
  })
  const page = await browser.newPage()

  await page.goto('https://www.mercadolibre.com.ar/')
  await page.screenshot({ path: 'example.png'})
  await browser.close()
}

const navigateWebPage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,

  })
  const page = await browser.newPage()

  await page.goto('https://quotes.toscrape.com/')
  await page.click('a[href="/login"]')
  await new Promise(resolve => setTimeout(resolve, 3000))

  await browser.close()
}

const getDataFromWebPage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
  })
  const page = await browser.newPage()

  await page.goto('https://example.com/')

  const result = await page.evaluate(() => {
    const title = document.querySelector('h1').innerText
    const description = document.querySelector('p').innerText
    const more = document.querySelector('a').innerText

    return { title, description, more }
  })
  
  console.log(result)
  await browser.close()
}

const handleDynamicWebPage = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
    })

    const page = await browser.newPage()
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1920, height: 1080})

    await page.goto('http://quotes.toscrape.com/')

    const result = await page.evaluate(() => {
      const quotes = document.querySelectorAll('.quote')
      const data = [...quotes].map((quote, index) => {
        const quoteText = quote.querySelector('.text').innerText
        const author = quote.querySelector('.author').innerText
        const tags = [...quote.querySelectorAll('.tag')].map(tag => tag.innerText)

        return { id: index, quoteText, author, tags }
      })

      return data
    })

    await page.screenshot({ path: './data/screens/example.png'})
    await browser.close()

    await writeJson(result)
    await writeExcel(result)
  } catch (err) {
    console.log(err)
  }
}

handleDynamicWebPage()