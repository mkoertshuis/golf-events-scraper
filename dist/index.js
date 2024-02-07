var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import axios from 'axios';
import { JSDOM } from 'jsdom';
function fetchPage(url) {
    const HTMLData = axios
        .get(url)
        .then(res => res.data)
        .catch((error) => {
        var _a;
        console.error(`There was an error with ${(_a = error.config) === null || _a === void 0 ? void 0 : _a.url}.`);
        console.error(error.toJSON());
    });
    return HTMLData;
}
function fetchFromWebOrCache(url, ignoreCache = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // If the cache folder doesn't exist, create it
        if (!existsSync(resolve(__dirname, '.cache'))) {
            mkdirSync('.cache');
        }
        console.log(`Getting data for ${url}...`);
        if (!ignoreCache &&
            existsSync(resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`))) {
            console.log(`I read ${url} from cache`);
            const HTMLData = yield readFile(resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`), { encoding: 'utf8' });
            const dom = new JSDOM(HTMLData);
            return dom.window.document;
        }
        else {
            console.log(`I fetched ${url} fresh`);
            const HTMLData = yield fetchPage(url);
            if (!ignoreCache && HTMLData) {
                writeFile(resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`), HTMLData, { encoding: 'utf8' });
            }
            const dom = new JSDOM(HTMLData);
            return dom.window.document;
        }
    });
}
function extractDataDelfland(document) {
    const calendarItems = Array.from(document.querySelectorAll('div[class="box large calendar-item"]'));
    return calendarItems.map(item => {
        var _a, _b, _c, _d, _e;
        var block = item.querySelector('div.in');
        var pullLeft = block === null || block === void 0 ? void 0 : block.querySelector('div.pull-left');
        var detailHolder = block === null || block === void 0 ? void 0 : block.querySelector('div.detail-holder');
        return {
            date: (_a = pullLeft === null || pullLeft === void 0 ? void 0 : pullLeft.querySelector('time')) === null || _a === void 0 ? void 0 : _a.dateTime,
            name: (_c = (_b = detailHolder === null || detailHolder === void 0 ? void 0 : detailHolder.querySelector('a')) === null || _b === void 0 ? void 0 : _b.querySelector('h3')) === null || _c === void 0 ? void 0 : _c.innerHTML,
            description: (_d = detailHolder === null || detailHolder === void 0 ? void 0 : detailHolder.querySelector('p')) === null || _d === void 0 ? void 0 : _d.innerHTML,
            url: (_e = detailHolder === null || detailHolder === void 0 ? void 0 : detailHolder.querySelector('a')) === null || _e === void 0 ? void 0 : _e.href,
        };
    });
}
function saveData(filename, data) {
    if (!existsSync(resolve(__dirname, 'data'))) {
        mkdirSync('data');
    }
    writeFile(resolve(__dirname, `data/${filename}.json`), JSON.stringify(data), {
        encoding: 'utf8',
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield fetchFromWebOrCache('http://delflandgolf.nl/activiteiten/', true);
        const data = extractDataDelfland(document);
        saveData('delfland-activiteiten', data);
        return data;
    });
}
// getData();
//# sourceMappingURL=index.js.map