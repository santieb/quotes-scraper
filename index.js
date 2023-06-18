import puppeteer from 'puppeteer'
import fs from 'fs/promises'

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
      slowMo: 200,
    })

    const page = await browser.newPage()

    await page.goto('http://quotes.toscrape.com/')

    const result = await page.evaluate(() => {
      const quotes = document.querySelectorAll('.quote')
      const data = [...quotes].map(quote => {
        const quoteText = quote.querySelector('.text').innerText
        const author = quote.querySelector('.author').innerText
        const tags = [...quote.querySelectorAll('.tag')].map(tag => tag.innerText)

        return { quoteText, author, tags }
      })

      return data
    })

    await page.screenshot({ path: './data/screens/example.png'})
    await browser.close()
    await fs.writeFile('./data/data.json', JSON.stringify(result, null, 2));
  } catch (err) {
    console.log(err)
  }
}

handleDynamicWebPage()