const readFileNative = require('fs').readFile;
const { promisify, random } = require('./utils');
const { splitLines, splitWords } = require('./splitters');

const readFile = promisify(readFileNative);

const isVerbose = process.argv.indexOf('--verbose');


function loadDictionaries(...filenames) {
    // reject-proof promises
    const promises = filenames.map(filename => readFile(filename)
        .catch((e) => {
            if (isVerbose) {
                console.warn(`Failed loading "${filename}"`, e);
            }
            return '';
        }));

    return Promise.all(promises)
        .then(list => list.map(splitWords));
}


const DICTIONARY = {
    FirstNames: './dictionary/first-names.txt',
    LastNames: './dictionary/last-names.txt'
};

function printRandomNames(count) {
    loadDictionaries(DICTIONARY.FirstNames, DICTIONARY.LastNames)
        .then(([firstNames, lastNames]) => {
            while (--count >= 0) {
                const fname = random(firstNames);
                const lname = random(lastNames);
                console.info(`${fname} ${lname}`);
            }
        })
        .catch(console.error)
        .then(() => { process.exit(); })
}


printRandomNames(5);
