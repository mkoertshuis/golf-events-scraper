import axios, { AxiosError } from 'axios';
import { parseFromString, Dom, Node } from 'dom-parser';


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
    const dom = parseFromString(HTMLData);
    return dom
    }

function extractDataDelfland(document: Dom) {
    const calendarItems: Node[] = Array.from(
        document.getElementsByClassName("box large calendar-item"),
    );
    return calendarItems.map(item => {
        var block = item.getElementsByClassName('in')[0];
        var pullLeft = block?.getElementsByClassName('pull-left')[0];
        var detailHolder = block?.getElementsByClassName('detail-holder')[0];
        return {
            date: pullLeft?.getElementsByTagName('TIME')[0]?.getAttribute('datetime'),
            name: detailHolder?.getElementsByTagName('A')[0]?.getElementsByTagName('H3')[0]?.innerHTML,
            description: detailHolder?.getElementsByTagName('P')[0]?.innerHTML,
            url: detailHolder?.getElementsByTagName('A')[0]?.getAttribute('href'),
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