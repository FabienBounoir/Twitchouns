import { writable, get } from 'svelte/store';
import { v4 } from "uuid";

import { config } from '$lib/stores/config';

export let messages = writable([]);

/**
 * @type {any[]}
 */
let tchat = [];

messages.subscribe(value => {
    tchat = value;
})

/**
 * 
 * @param {Object} message 
 * @param {Number} time 
 * @returns 
 */
export const push = (message, time = 5000) => {
    const $config = get(config);


    message._id = v4();
    messages.update(n => [...n, message]);

    // console.log(tchat);

    if ($config?.maxMessage && tchat.filter((s) => s.type == "tchat").length > parseInt($config?.maxMessage)) {
        tchat = tchat.slice(tchat.length - parseInt($config?.maxMessage));
        messages.set(tchat);
    }

    if ($config.save == true) return;

    setTimeout(() => {
        tchat = tchat.filter((s) => s._id !== message._id);
        messages.set(tchat);
    }, time + (parseInt($config?.timeMessage) || 0));
};

/**
 * 
 * @param {String} deletedMessage 
 * @param {String} username 
 */
export const remove = (deletedMessage, username) => {
    console.log(`fzfzefzefze`)
    tchat = tchat.filter((s) => s.message != deletedMessage && s.username != username);
    messages.set(tchat);
}
