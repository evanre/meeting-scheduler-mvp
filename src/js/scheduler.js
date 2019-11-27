import Calendar from './calendar';
import * as helpers from './helpers';

/**
 * Class represents Scheduler component
 */
export default class Scheduler {
    constructor(selector = '.scheduler', options = null) {
        this.selector = selector;

        if (this.checkBeforeInit()) {
            return;
        }

        this.calendar = null;
        this.timePanel = null;
        this.previousBtn = null;
        this.confirmBtn = null;

        this.checkBeforeInit(options);

        // Plugin options
        this.options = {
            maxDate: new Date().fp_incr(14), // 14 days from now
            onChange: this.dateSelected.bind(this),
            availableTime: {
                // get time frames from server, now in demo mode
                '2019-11-29': ['10:00', '10:30', '11:00'],
                '2019-00-00': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '15:00', '15:30', '16:00', '16:30'],
            },
        };

        if (options instanceof Object) {
            this.options = helpers.merge(this.options, options);
        }

        this.init();
    }

    checkBeforeInit(options) {
        if (typeof this.selector === 'string') {
            [...document.querySelectorAll(this.selector)].forEach((el) => new Scheduler(el, options));
            return true;
        }

        if (!(this.selector instanceof Element)) {
            throw new Error(`${this.selector} should be a DOM Object or string`);
        }

        return false;
    }

    init() {
        this.calendar = new Calendar('.calendar', this.options);
        this.timePanel = this.selector.querySelector('.time-panel');
        this.confirmBtn = Scheduler.createConfirmBtn();

        this.timePanel.addEventListener('click', this.onTimePanel.bind(this));
    }

    dateSelected(selectedDates, dateStr, instance) {
        const [d] = selectedDates;
        const weekday = instance.l10n.weekdays.longhand[d.getDay()];
        const month = instance.l10n.months.longhand[d.getMonth()];

        if (this.timePanel.classList.contains('-is-hidden')) {
            this.timePanel.classList.remove('-is-hidden');
        }

        const title = this.timePanel.querySelector('.time-panel__title');
        if (title) {
            title.innerText = `${weekday}, ${d.getDate()} ${month}`;
        }

        const list = this.timePanel.querySelector('.time-panel__list');
        if (list) {
            const timeFrame = this.options.availableTime;
            helpers.clearElement(list);
            list.appendChild(Scheduler.getTimeList(timeFrame[dateStr] || timeFrame['2019-00-00']));
        }
    }

    static getTimeList(list) {
        const fragment = document.createDocumentFragment();
        list.forEach((time) => {
            const li = document.createElement('li');
            li.setAttribute('class', 'time-panel__item');
            li.setAttribute('data-time', time);

            const btn = document.createElement('button');
            btn.className = 'time-panel__button';
            btn.setAttribute('type', 'button');
            btn.innerText = time;

            li.appendChild(btn);

            return fragment.appendChild(li);
        });

        return fragment;
    }

    onTimePanel(e) {
        const btn = e.target;
        const li = btn.parentNode;

        if (btn.classList.contains('time-panel__button')) {
            if (this.previousBtn) {
                this.previousBtn.parentNode.classList.remove('-is-selected');
            }

            this.previousBtn = btn;

            li.classList.add('-is-selected');
            li.appendChild(this.confirmBtn);
        } else if (btn.classList.contains('time-panel__confirm')) {
            // move to confirmation page
            console.log(`Confirm button pressed ${li.getAttribute('data-time')}!`);
        }
    }

    static createConfirmBtn() {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'time-panel__confirm');
        btn.innerText = 'Confirm';

        return btn;
    }
}
