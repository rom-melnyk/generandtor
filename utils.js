/**
 * Converts the async function to Promise.
 * The async function should respect NodeJS convention:
 * - last param is callback;
 * - callback is called with first param boolean meaning the error.
 *
 * @param {Function} asyncFunction(...params, callback(err, ...res))
 * @param {Object|null} [context=null]          the context where `asyncFunction` is called
 * @param {Boolean} [multipleParams=false]      whether callback provides >1 parameters after `err`
 * @return {Function}
 */
function promisify(asyncFunction, { context = null, multipleParams = false } = {}) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            args.push((err, ...result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(multipleParams ? result : result[0]);
                }
            });

            asyncFunction.apply(context, args);
        });
    }
}


/**
 * @param {Array|String|Number} source
 * @return {Number|*}
 */
function random(source) {
    const hasElements = Array.isArray(source) || typeof source === 'string';
    const max = hasElements ? source.length : source;
    const number = Math.floor(Math.random() * max);
    return hasElements ? source[number] : number;
}


module.exports = { promisify, random };
