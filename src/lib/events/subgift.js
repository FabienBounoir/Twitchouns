import { push } from '../stores/message'
import { config } from "../stores/config"

import { setAvatar } from "../stores/avatar"
import explosion from "$lib/assets/avatar/explosion.png";

let query;

config.subscribe(value => {
    query = value;
});

export class SubGift {
    constructor(config) {
        this.config = config;
        this.eventName = 'subgift';
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, username, numbOfSubs, methods, userstate) {
        let senderCount = ~~userstate["msg-param-sender-count"];

        setAvatar(explosion);
        if (query.animsubgift) {
            // animation(
            //     query?.customSubGif?.split(",") || [
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
            //     10000 * numbOfSubs
            // );
        }

        console.log(`${username} a offert ${numbOfSubs} sub à la communauté`);

        push(
            {
                message: `Merci @${username} pour ${numbOfSubs > 1
                    ? `les ${numbOfSubs} sub gift`
                    : "le sub gift"
                    }`,
                name: "Sub Gift",
                type: "sub",
            },
            1000 * numbOfSubs > 60000 ? 60000 : 5000 * numbOfSubs
        );
    }
}