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
 * @param {Number} [from=0]
 * @param {Number} [to]
 * @return {Number}
 */
function randomNumber(from = 0, to) {
    if (to === undefined) {
        to = from;
        from = 0;
    }
    const delta = to - from;
    return Math.floor(Math.random() * delta) + from;
}


/**
 * @param {Array|String} source
 * @return {String|*}
 */
function randomValue(source) {
    if (!source || !source.length) {
        return '';
    }

    const index = Math.floor(Math.random() * source.length);
    return source[index];
}


module.exports = { promisify, randomNumber, randomValue };
