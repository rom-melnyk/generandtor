const WORD_DELIMITER = /[\s\n]+/;
const LINE_DELIMITER = /(\s*\n+\s*)+/;


function splitWords(input) {
    return (input && input.toString() || '').split(WORD_DELIMITER).filter(w => !!w);
}


function splitLines(input) {
    return (input && input.toString() || '').split(LINE_DELIMITER);
}


module.exports = { splitWords, splitLines };
