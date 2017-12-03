const readFileNative = require('fs').readFile;
const { promisify } = require('./utils');
const { splitLines, splitWords } = require('./splitters');
const { personFactory, TEMPLATE_FILLERS } = require('./factory');
const { parseArguments } = require('./parse-arguments');
const path = require('path');

const readFile = promisify(readFileNative);

const { amount, template, isVerbose } = parseArguments();

function loadDictionaries(...dicts) {
    // reject-proof promises
    const promises = dicts.map(({ file, splitter }) => readFile(file).then(splitter)
        .catch((e) => {
            if (isVerbose) {
                console.warn(`Failed loading "${file}"`, e);
            }
            return '';
        }));

    return Promise.all(promises);
}


const DICTIONARIES = {
    FirstNames: {
        file: path.resolve(__dirname, '../dictionaries/first-names.txt'),
        splitter: splitWords
    },
    LastNames: {
        file: path.resolve(__dirname, '../dictionaries/last-names.txt'),
        splitter: splitWords
    },
    Countries: {
        file: path.resolve(__dirname, '../dictionaries/countries.txt'),
        splitter: splitLines
    },
    EmailDomains: {
        file: path.resolve(__dirname, '../dictionaries/email-domains.txt'),
        splitter: splitLines
    },
};


function print(amount, template) {
    loadDictionaries(DICTIONARIES.FirstNames, DICTIONARIES.LastNames, DICTIONARIES.Countries, DICTIONARIES.EmailDomains)
        .then(([firstNames, lastNames, countries, emailDomains]) => {
            personFactory.init(firstNames, lastNames, countries, emailDomains);
            while (--amount >= 0) {
                const person /*{ firstName, lastName, country, birthYear, email, salary }*/ = personFactory();
                const result = template.replace(/%[a-zA-Z]+%/g, (found) => {
                    const filler = TEMPLATE_FILLERS[found];
                    return typeof filler === 'function' ? filler(person) : found;
                });
                console.log(result);
            }
        })
        .catch(console.error)
        .then(() => { process.exit(); })
}


print(amount, template);
