module.exports = class Module {
    inputs = []
    addInput(emoji) { }
    removeInput(emoji) { }
    // input detection will be made by an input handling array
    onStart() { }
    onUpdate() { }
    addCommand(command) { }
}