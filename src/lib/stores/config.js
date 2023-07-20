import { writable } from 'svelte/store';

/**
 * @typedef {Object} config
 */
export const config = writable({
    events: ['message'],
    theme: 'white',
    position: 'left',
    margin: [0, 0, 0, 0],
    avatar: true,
    badge: true,
    channels: ["badbounstv"],
    save: false,
    maxMessage: null,
    timeMessage: '0',
    customAvatar: [],
});