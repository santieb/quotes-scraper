import { handleScrapping } from './lib/scraper.js';
import { writeExcel, writeJson } from "./utils/index.js";

const main = async () => {
  try {
    const data = await handleScrapping()

    await writeExcel(data)
    await writeJson(data)
  } catch (err) {
    console.log(err);
  }
};

main();
