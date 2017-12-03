const { randomValue, randomNumber } = require('./utils');


const DELIMITERS_DASHES = ['-', '_'];
const DELIMITERS_DASHES_OR_EMPTY = ['-', '_', ''];
const SUFFIXES_OCCUPATION = ['corp', 'edu', 'pvt', 'pub', 'work', 'wrk', 'home'];
const SUFFIXES_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '2000', '2010', '2005', '2015', '1999'];

const emailStrategies = [
    (firstName, lastName, country, birthYear) => {
        let email = lastName.toLowerCase();
        email += birthYear;
        const domain = randomValue(_emailDomains);
        return `${email}@${domain}`;
    },
    (firstName, lastName, country, birthYear) => {
        const email = firstName.toLowerCase();
        const delim = randomValue(DELIMITERS_DASHES_OR_EMPTY);
        const year = (birthYear + '').substr(2);
        const domain = randomValue(_emailDomains);
        return `${email}${delim}${year}@${domain}`;
    },
    (firstName, lastName, country, birthYear) => {
        let email = firstName.substr(0, 1);
        email += lastName.toLowerCase();
        email += randomValue(DELIMITERS_DASHES);
        email += randomValue(SUFFIXES_OCCUPATION);
        const domain = randomValue(_emailDomains);
        return `${email}@${domain}`;
    },
    (firstName, lastName, country, birthYear) => {
        let email = firstName
            .substr(0, randomNumber(2, firstName.length))
            .toLowerCase();
        email += lastName.toLowerCase();
        email += randomValue(SUFFIXES_NUMBERS);
        const domain = randomValue(_emailDomains);
        return `${email}@${domain}`;
    },
];


let _firstNames = [];
let _lastNames = [];
let _countries = [];
let _emailDomains = [];

function personFactory(/*firstNames, lastNames, countries, emailDomains*/) {
    const firstName = randomValue(_firstNames);
    const lastName = randomValue(_lastNames);
    const country = randomValue(_countries);
    const birthYear = randomNumber(1950, 2007);
    const email = randomValue(emailStrategies)(firstName, lastName, country, birthYear, _emailDomains);
    const salary = randomNumber(1e1, 3e4) * 100;
    return { firstName, lastName, country, birthYear, email, salary };
}

personFactory.init = (firstNames, lastNames, countries, emailDomains) => {
    _firstNames = firstNames;
    _lastNames = lastNames;
    _countries = countries;
    _emailDomains = emailDomains;
};

const TEMPLATE_FILLERS = {
    '%firstName%': ({ firstName }) => firstName,
    '%lastName%': ({ lastName }) => lastName,
    '%name%': ({ firstName, lastName }) => `${firstName} ${lastName}`,
    '%fullName%': ({ firstName, lastName }) => `${firstName} ${lastName}`,
    '%country%': ({ country }) => country,
    '%birthYear%': ({ birthYear }) => birthYear,
    '%salary%': ({ salary }) => salary,
    '%email%': ({ email }) => email,
};


module.exports = { personFactory, TEMPLATE_FILLERS };
