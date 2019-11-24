import ResponsiveEvent from './responsive-event';
import Scheduler from './scheduler';

const event = new ResponsiveEvent();

document.addEventListener('DOMContentLoaded', () => {
    const scheduler = new Scheduler();
});

window.addEventListener('load', () => {
    window.addEventListener('responsive', () => {
        console.log('current breakpoint: ', window.responsive);
    });
});
