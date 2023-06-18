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

const MAX_PAGES = 5

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

    const pages = ['http://quotes.toscrape.com/page/8/', 'http://quotes.toscrape.com/page/9/']
    const dataa = []

    for (const url of pages) {
      await page.goto(url)

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
  
      const getUrlNextPage = await page.$('.next a')
      const nextUrl = await page.evaluate(getUrlNextPage => getUrlNextPage.getAttribute('href'), getUrlNextPage)

      dataa.push(result)
    }

    console.log(dataa)
    
    //await page.screenshot({ path: './data/screens/example.png'})
    await browser.close()
  } catch (err) {
    console.log(err)
  }
}

handleDynamicWebPage()