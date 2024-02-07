import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';

function fetchPage(url: string): Promise<string | undefined> {
  const HTMLData = axios
    .get(url)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error with ${error.config?.url}.`);
      console.error(error.toJSON());
    });

  return HTMLData;
}

async function fetchFromWebOrCache(url: string, ignoreCache = false) {
  // If the cache folder doesn't exist, create it
  if (!existsSync(resolve(__dirname, '.cache'))) {
    mkdirSync('.cache');
  }
  console.log(`Getting data for ${url}...`);
  if (
    !ignoreCache &&
    existsSync(
      resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
    )
  ) {
    console.log(`I read ${url} from cache`);
    const HTMLData = await readFile(
      resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
      { encoding: 'utf8' },
    );
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  } else {
    console.log(`I fetched ${url} fresh`);
    const HTMLData = await fetchPage(url);
    if (!ignoreCache && HTMLData) {
      writeFile(
        resolve(
          __dirname,
          `.cache/${Buffer.from(url).toString('base64')}.html`,
        ),
        HTMLData,
        { encoding: 'utf8' },
      );
    }
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
  }
}

function extractDataDelfland(document: Document) {
    const calendarItems: HTMLAnchorElement[] = Array.from(
        document.querySelectorAll('div[class="box large calendar-item"]'),
    );
    return calendarItems.map(item => {
        var block = item.querySelector('div.in');
        var pullLeft = block?.querySelector('div.pull-left');
        var detailHolder = block?.querySelector('div.detail-holder');
        return {
            date: pullLeft?.querySelector('time')?.dateTime,
            name: detailHolder?.querySelector('a')?.querySelector('h3')?.innerHTML,
            description: detailHolder?.querySelector('p')?.innerHTML,
            url: detailHolder?.querySelector('a')?.href,
        };
    });
}

function saveData(filename: string, data: any) {
  if (!existsSync(resolve(__dirname, 'data'))) {
    mkdirSync('data');
  }
  writeFile(resolve(__dirname, `data/${filename}.json`), JSON.stringify(data), {
    encoding: 'utf8',
  });
}

async function getData() {
  const document = await fetchFromWebOrCache(
    'https://delflandgolf.nl/activiteiten/',
    true,
  );
  const data = extractDataDelfland(document);
  saveData('delfland-activiteiten', data);
}

getData();