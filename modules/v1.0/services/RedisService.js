'use strict'

class RedisService {
    constructor (instance) {
        this.instance = instance
    }
    async publish (channel = '', data = {}) {
        try {
            let {redis: Redis} = this.instance
            if (typeof Redis === 'function') Redis = new Redis(process.env.REDIS_URI)
            debugger
            await Redis.publish(channel, JSON.stringify(data))
        } catch (err) {
            throw err
        }
    }
    async setdata () {
        try {
            const {redis} = this.instance
        } catch (err) {
            throw err
        }
    }
    async deldata () {
        try {
            const {redis} = this.instance
        } catch (err) {
            throw err
        }
    }
    async remove () {
        try {
            const {redis} = this.instance
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (instance) {
    return new RedisService(instance)
}