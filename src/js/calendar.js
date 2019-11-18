import flatpickr from 'flatpickr';
import * as helpers from './helpers';

/**
 * Class represents Calendar component
 */
export default class Calendar {
    constructor(selector = '.calendar', options = null) {
        this.selector = selector;
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
            maxDate: new Date().fp_incr(14), // 14 days from now
            onChange: (selectedDates, dateStr, instance) => {
                console.log( selectedDates, dateStr, instance );
            },
        };

        if (options instanceof Object) {
            this.options = helpers.extendDefaults(this.options, options);
        }

        this.checkBeforeInit();
    }

    checkBeforeInit() {
        if (typeof this.selector === 'string') {
            [...document.querySelectorAll(this.selector)].forEach((el) => new Calendar(el));
        } else if (this.selector instanceof Element) {
            this.init();
        } else {
            throw new Error(`${this.selector} should be a DOM Object or string`);
        }
    }

    init() {
        this.calendar = flatpickr(this.selector, this.options);
    }
}
