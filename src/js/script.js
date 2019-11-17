import ResponsiveEvent from './responsive-event';

const event = new ResponsiveEvent();

document.addEventListener('DOMContentLoaded', () => {
});

window.addEventListener('load', () => {
    window.addEventListener('responsive', () => {
        console.log('current breakpoint: ', window.responsive);
    });
});
