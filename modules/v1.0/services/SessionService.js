'use strict'

const Services = require('./__index_module')

class SessionService extends Services {
    constructor (instance) {
        super()
        this.instance = instance
        this.redisService = instance.include('services', 'RedisService')(instance)
    }
    /**
    @getSession void
    @params key String
    @return Object
    */
    async getSession (key) {
        debugger
    }
    /**
    @setSession void
    @params key String
    @params value String
    */
    async setSession (key, value = '') {
        debugger
    }
}

module.exports = function (instance) {
    return new SessionService(instance)
}