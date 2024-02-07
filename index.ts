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

async function fetchFromWeb(url: string) {
    console.log(`Getting data for ${url}...`);
    const HTMLData = await fetchPage(url);
    const dom = new JSDOM(HTMLData);
    return dom.window.document;
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

export async function getData() {
  const document = await fetchFromWeb(
    'https://delflandgolf.nl/activiteiten/'
  );
  const data = extractDataDelfland(document);
  return data;
}

// getData();