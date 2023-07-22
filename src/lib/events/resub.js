import { push } from '../stores/message'
import { config } from "../stores/config"

import { setAvatar } from "../stores/avatar"
import fete from "$lib/assets/avatar/fete.png";

let query;

config.subscribe(value => {
    query = value;
});

export class Resub {
    constructor(configuration) {
        this.config = configuration;
        this.eventName = 'resub';
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, username, months, message, userstate, methods) {
        setAvatar(fete);

        if (this.config.animsub === "true" || false) {
            // animation(
            //     query?.customSub?.split(",") || [
            //         bleucyan,
            //         bleuyellow,
            //         bleurouge,
            //         orange,
            //         vert,
            //         purple,
            //         rainbow,
            //         red,
            //         roseorange,
            //         violetcyan,
            //         violet,
            //         white,
            //         yellow,
            //     ],
            //     100,
            //     20000
            // );
        }
        push(
            {
                message: `Merci pour le resub @${username}`,
                name: `Resub ${userstate["msg-param-cumulative-months"]}eme mois`,
                type: "resub",
            },
            30000
        );
    }
}