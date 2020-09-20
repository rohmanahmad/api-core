'use strict'

class EmailSender {
    constructor (instance) {
        this.instance = instance
    }

    async handle (options) {}
}

module.exports = function (instance) {
    return new EmailSender(instance)
}