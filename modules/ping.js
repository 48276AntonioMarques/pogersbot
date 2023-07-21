import Module from '../module.js'
import Command from '../Command.js'

export default class Ping extends Module {
    inputs = []

    static onLoad() {
        Command.register(new Command('ping', 'Pong!', (origin) => {
            origin.channel.send('Pong!')
        }))
    }

    onStart() { }

    onUpdate() { }
}