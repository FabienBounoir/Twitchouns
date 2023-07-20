import { push, remove } from '../stores/message'
import { config } from "../stores/config"
import { setAvatar } from "../stores/avatar"
import oups from "$lib/assets/avatar/oups.png";


let query;

config.subscribe(value => {
    query = value;
});

export class MessageDeleted {
    constructor(config) {
        this.config = config;
        this.eventName = 'messagedeleted';
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, username, deletedMessage, userstate) {
        console.log(`${username} a supprimé son message "${deletedMessage}"`)
        remove(deletedMessage, username)

        if (this.config.events.includes(this.eventName)) {
            setAvatar(oups);
            push({
                message: `Attention à ton langage @${username}`,
                name: "Warning",
                type: "warning",
            });
        }
    }
}


