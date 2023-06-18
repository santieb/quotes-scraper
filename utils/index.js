import ExcelJS from 'exceljs'
import fs from 'fs/promises'

export const writeExcel = async (data) => {
    const fileName = `./data/quotes-${Date.now()}.xlsx`

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Quotes')

    data.map(quote => {
      quote.tags = quote.tags.join(' ')
      return quote
    })

    sheet.columns = [
      { header: 'Id', key: 'id', name: 'id'},
      { header: 'quote', key: 'quoteText', name: 'quote'},
      { header: 'author', key: 'author', name: 'author'},
      { header: 'tags', key: 'tags', name: 'tags'}
    ]
    sheet.addRows(data)

    try {
    await workbook.xlsx.writeFile(fileName)
    console.log('Excel file created:', fileName);
  } catch (err){
    console.log(err)
  }
}

export const writeJson = async (data) => {
  const fileName = `./data/quotes-${Date.now()}.json`
  const jsonContent = JSON.stringify(data, null, 2);

  try {
    await fs.writeFile(fileName, jsonContent);
    console.log('JSON file created:', fileName);
  } catch (err) {
    console.error(err);
  }
}