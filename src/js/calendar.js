import flatpickr from 'flatpickr';
import * as helpers from './helpers';

/**
 * Class represents Calendar component
 */
export default class Calendar {
    constructor(selector = '.calendar', options = null) {
        this.selector = selector;

        this.checkBeforeInit(options);

        this.calendar = null;

        // Plugin options
        this.options = {
            inline: true,
            disable: [
                (date) => (date.getDay() === 0 || date.getDay() === 6),
            ],
            monthSelectorType: 'static',
            locale: {
                firstDayOfWeek: 1, // start week on Monday
            },
            minDate: 'today',
            maxDate: false,
            onChange: false,
        };

        if (options instanceof Object) {
            this.options = helpers.merge(this.options, options);
        }

        this.init();
    }

    checkBeforeInit(options) {
        if (typeof this.selector === 'string') {
            [...document.querySelectorAll(this.selector)].forEach((el) => new Calendar(el, options));
            return true;
        }

        if (!(this.selector instanceof Element)) {
            throw new Error(`${this.selector} should be a DOM Object or string`);
        }

        return false;
    }

    init() {
        this.calendar = flatpickr(this.selector, this.options);
    }
}
