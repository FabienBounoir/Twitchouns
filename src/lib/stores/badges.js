import { writable } from 'svelte/store';

/**
 * @typedef {Object} config
 */
export const badges = writable({
    global: null,
    channels: {},
});