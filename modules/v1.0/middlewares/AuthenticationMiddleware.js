'use strict'

class AuthenticationMiddleware {
    constructor () {}

    async handle (request, response, next) {
        try {
            console.log('----')
            await next()
        } catch (err) {
            await next(err)
        }
    }
}

module.exports = AuthenticationMiddleware
