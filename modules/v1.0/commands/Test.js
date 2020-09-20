'use strict'

class Test {
    constructor (instance) { // instance ini bukan instance dari fastify
        this.instance = instance
    }

    async handle ({ command, channel, message, toNumber }) {
        if (command === 'redispublish') await this.redisPublish({channel, message, toNumber})
    }

    async redisPublish ({channel, message, toNumber}) {
        const RedisService = this.instance.include('services', 'RedisService')(this.instance) // bukan instance dari fastify tp masih compatible dengan redis service
        await RedisService.publish(channel, {
            type: 'otp', // sebenernya gk perlu, krn udh dibedakan dari channel (otp)
            target: 'whatsapp',
            to_number: toNumber ? `${toNumber}@c.us` : '6285333525510@c.us',
            message
        })
    }
}

module.exports = function (instance) {
    return new Test(instance)
}