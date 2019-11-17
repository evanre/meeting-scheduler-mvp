import ResponsiveEvent from './responsive-event';
import Calendar from './calendar';

const event = new ResponsiveEvent();

document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
});

window.addEventListener('load', () => {
    window.addEventListener('responsive', () => {
        console.log('current breakpoint: ', window.responsive);
    });
});
