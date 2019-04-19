// src/main.js
import { version } from '../package.json';

const hello = async () => {
  console.log('version ' + version);
}

hello();