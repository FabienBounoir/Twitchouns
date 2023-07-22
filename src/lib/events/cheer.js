import { push } from '../stores/message'
import { config } from "../stores/config"
import Animation from '$lib/components/animation.svelte';

let query;

config.subscribe(value => {
    query = value;
});

export class Cheer {
    constructor(config) {
        this.config = config;
        this.eventName = 'cheer';
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, userstate, message) {
        if (this.config.animcheer === "true") {
            // animation(
            //     query?.customCheers?.split(",") || [bits],
            //     100,
            //     10000
            // );
        }

        push(
            {
                message: `Merci ${userstate["display-name"]} pour les ${userstate.bits} Bits`,
                name: "Bits",
                type: "cheers",
            },
            userstate.bits < 99
                ? 1000
                : userstate.bits < 1000
                    ? 5000
                    : userstate.bits < 4999
                        ? 15000
                        : userstate.bits * 3.5
        );
    }
}