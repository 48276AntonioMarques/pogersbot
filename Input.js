export default class Input {

    static #listeners = []

    emoji = null
    user = null

    constructor(emoji, user) {
        this.emoji = emoji
        this.user = user
    }

    static getAll() {
        return this.#listeners
    }

    static add(module, message, emoji) {
        const listener = {
            module,
            message: {
                id: message.id,
                channel: message.channel.id
            },
            emoji
        }
        if (!this.listeners.includes.includes(listener))
            return this.listeners.push(listener)
        return false
    }

    static remove(module, message, emoji) {
        const listener = {
            module,
            message: {
                id: message.id,
                channel: message.channel.id
            },
            emoji
        }
        return this.listeners.remove(listener)
    }
}
