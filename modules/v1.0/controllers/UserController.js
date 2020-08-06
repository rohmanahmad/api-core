'use strict'

class UserController {
    constructor () {}
    async me (request, response) {
        response.send('hello')
    }
}

module.exports = function (handler, config = {}) {
    const c = new UserController(config)
    return c[handler]
}