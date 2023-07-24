import { push } from '../stores/message'
import { config } from "../stores/config"

import { setAvatar } from "../stores/avatar"
import love from "$lib/assets/avatar/love.png";

let query;

config.subscribe(value => {
    query = value;
});

export class Subscription {
    constructor(config) {
        this.config = config;
        this.eventName = 'sub';
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, username, method, message, userstate) {
        setAvatar(love);
        if (query.animsub === "true") {
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

        console.log("Sub de " + username)

        push(
            {
                message: `Merci pour le Sub @${username}`,
                name: "Sub",
                type: "sub",
            },
            30000
        );
    }
}