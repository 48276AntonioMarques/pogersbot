export default class Command {
    static #commands = []
    template = null
    description = null
    callback = null
    constructor(template, description, callback) {
        this.template = template
        this.description = description
        this.callback = callback
    }

    static register(command) {
        this.#commands.push(command)
    }

    static getAll() {
        return this.#commands
    }
}
