import { push } from '../stores/message'
import { config } from "../stores/config"

import { setAvatar } from "../stores/avatar"
import agacer from "$lib/assets/avatar/agacer.png";

let query;

config.subscribe(value => {
    query = value;
});

export class Timeout {
    constructor(config) {
        this.config = config;
        this.eventName = 'timeout';
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, username, reason, duration, userstate) {
        setAvatar(agacer);
        push({
            message: `@${username} expulsé pour ${duration} secondes`,
            name: "Time Out",
            type: "ban",
        });
    }
}