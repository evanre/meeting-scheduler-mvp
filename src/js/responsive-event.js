import * as helpers from './helpers';

/**
 Responsive event. Dispatch change window width event.
 If you need to change some state of your code when window width (current breakpoint) is changes, just add window event listener for this.

 @important: Init the plugin at the very beginning of the code;
 @important: You can get current breakpoint from global scope - window.responsive

 @example: window.addEventListener('responsive', menuOld);
 @example: window.addEventListener('responsive', () => {
    console.log('current breakpoint: ', window.responsive)
 });

 @param {Object} options - Object of all options.
 @param {Object} options.sizes - Object of sizes to generate events on them.
 @param {string} options.eventName - Name of the generated event

 @version 1.0.1
 */
export default class ResponsiveEvent {
    constructor(options = null) {
        this.options = {
            sizes: {
                0: 'smartphone',
                767: 'tablet',
                1279: 'desktop',
            },
            eventName: 'responsive',
        };

        if (options instanceof Object) {
            this.options = helpers.extendDefaults(this.options, options);
        }

        // 1.0.1 In future we can attach functions in some kind of a stack to call them without event
        // this.stack = [];

        this.event = null;

        this.init();
    }

    init() {
        const size = this.getSize(window.innerWidth);
        this.IEPolyfill();
        this.event = new CustomEvent(this.options.eventName, {
            bubbles: true,
            cancelable: false,
            detail: {
                [this.options.eventName]: size,
            },
        });

        // Attach variable to global scope at the very beginning
        window[this.options.eventName] = size;

        // Force checkView to dispatch the event on load.
        window.addEventListener('load', this.checkView.bind(this, true));

        window.addEventListener('resize', helpers.debounce(this.checkView.bind(this), 50));
    }

    getSize(width) {
        const view = Object.keys(this.options.sizes).reduce((acc, curr) => (width > curr ? curr : acc));

        return this.options.sizes[view];
    }

    checkView(forceUpdate = false) {
        const view = this.getSize(window.innerWidth);
        if (forceUpdate || view !== window[this.options.eventName]) {
            // 1.0.1 In future we can attach functions in some kind of a stack to call them without event
            // this.stack.forEach(f => helpers.executeIfFunction(f.bind(view)));

            window[this.options.eventName] = view;
            this.event.detail[this.options.eventName] = view;
            window.dispatchEvent(this.event);
        }
    }

    IEPolyfill() {
        try {
            const event = new CustomEvent('IE has CustomEvent, but doesn\'t support constructor');
        } catch (e) {
            window.CustomEvent = (
                event,
                params = {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined,
                },
            ) => {
                const evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            };

            CustomEvent.prototype = Object.create(window.Event.prototype);
        }
    }
}
