var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function fetchFromWeb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Getting data for ${url}...`);
        const HTMLData = yield fetchPage(url);
        const dom = new JSDOM(HTMLData);
        return dom.window.document;
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
export function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield fetchFromWeb('https://delflandgolf.nl/activiteiten/');
        const data = extractDataDelfland(document);
        return data;
    });
}
// getData();
//# sourceMappingURL=index.js.map