export * from './golfscraper'
import * as _ from 'lodash';
import { getData } from './golfscraper';

function component() {
    const element = document.createElement('div');
    const jsonString = JSON.stringify(getData());
    element.innerHTML = jsonString;

    return element;
  }

document.body.appendChild(component());