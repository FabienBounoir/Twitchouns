import { messages } from '../stores/message'



export class Clearchat {
    constructor(config) {
        this.config = config;
        this.eventName = 'clearchat';
    }

    getEventName() {
        return this.eventName;
    }

    /**
     * 
     * @param {String} channel 
     */
    async run(channel) {
        console.log("Le tchat a été effacé");
        messages.update(n => [])
    }
}