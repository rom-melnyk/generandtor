const DEFAULT_OUTPUT_LINES = 10;


function parseArguments() {
    let amount = DEFAULT_OUTPUT_LINES;
    let template = '';
    let isVerbose = false;

    let expectNumber = false;

    const args = process.argv.slice(2);
    while (args.length > 0) {
        let arg = args.shift();
        switch (true) {
            case arg === '--verbose':
                isVerbose = true;
                break;
            case arg === '-h' || arg === '--help':
                printHelpAndExit();
                break;
            case arg === '-n' || arg === '--number':
                expectNumber = true;
                break;
            case expectNumber:
                arg = +arg;
                amount = isNaN(arg) ? DEFAULT_OUTPUT_LINES : arg;
                expectNumber = false;
                break;
            case args.length === 0:
                template = arg;
                break;
            default:
        }
    }
    if (!template) {
        printHelpAndExit();
    }

    return { amount, template, isVerbose };
}


function printHelpAndExit() {
    console.log(`
Generates random data for testing.

Usage: node src/index.js [-h] [-n XX] [--verbose] TEMPLATE_STRING

Optional arguments:
  -h, --help            Show this message and exit.
  --verbose             Show errors if any (useful for debug purposes).
  -n NUMBER             Number of times to print data (default ${DEFAULT_OUTPUT_LINES}).

TEMPLATE_STRING, for instance, "%name% from %country%, %email%"
is scanned for %___% masks. If one found, it is replaced with it's value.
Currently following masks are supported:

  %firstName%
  %lastName%
  %name%, %fullName%
  %country%
  %birthYear%           Random year of [1950..2007].
  %email%'
  %salary%              Random number of [1k..300k] step 100.

GeneRANDtor v1.0.0 by Roman Melnyk (c) 2017

`);
    process.exit();
}


module.exports = { parseArguments };
