import { writable } from 'svelte/store';

/**
 * @typedef {Object} config
 */
export const config = writable({
    channels: [],
    events: ['message'],
    theme: 'Light',
    position: 'left',
    avatar: false,
    save: false,
    badge: true,
    color: true,
    maxMessage: 30,
    timeMessage: '0',
    blacklist: [],
    customAvatar: [],
    margin: [0, 0, 0, 0],
    debug: false
});