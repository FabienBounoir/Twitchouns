import { push } from '../stores/message'
import { setAvatar } from "../stores/avatar"
import insulte from "$lib/assets/avatar/insulte.png";

export class Ban {
    constructor(config) {
        this.config = config;
        this.eventName = 'ban';
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, username, reason, userstate) {
        setAvatar(insulte);
        push({
            message: `@${username} a été ban !`,
            name: "Ban",
            type: "ban",
        });
    }
}