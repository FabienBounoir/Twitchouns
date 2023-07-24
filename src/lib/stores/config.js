import { writable } from 'svelte/store';

/**
 * @typedef {Object} config
 */
export const config = writable({
    events: ['message'],
    theme: 'light',
    position: 'left',
    margin: [0, 0, 0, 0],
    avatar: false,
    badge: true,
    channels: [],
    save: false,
    maxMessage: 30,
    timeMessage: '0',
    customAvatar: [],
    color: false,
    debug: false,
});