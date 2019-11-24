import deepmerge from 'deepmerge';

export const isArr = (arr) => arr && Array.isArray(arr);

export const isObj = (obj) => obj && typeof obj === 'object';

export const merge = (x = {}, y = {}) => deepmerge(x, y, { arrayMerge: (_, src) => src });


/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Function} fn      A function to be executed after delay milliseconds. The `this` context and all arguments are
 *                             passed through, as-is, to `callback` when the debounced-function is executed.
 * @param  {Number}   delay   A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *
 * @return {Function} A new, debounced function.
 */
export const debounce = (fn, delay) => {
    let timer = null;
    return () => {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
};

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {Function} fn         A function to be executed after delay milliseconds. The `this` context and all arguments are
 *                              passed through, as-is, to `callback` when the throttled-function is executed.
 * @param {Number}   threshold  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param {Object}   scope      Optional, you can pass context for callback function.
 *
 * @return {Function} A new, throttled, function.
 */
export const throttle = (fn, threshold = 250, scope) => {
    let last;
    let deferTimer;
    return (...list) => {
        const context = scope || this;
        const now = +new Date();
        const args = list;
        if (last && now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
};

export const clearElement = (el) => {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
};
