'use strict'

class HomeController {
    constructor () {}
    async index (request, response) {
        response.send('ini index')
    }
}

module.exports = function (handler, config = {}) {
    const c = new HomeController(config)
    return c[handler]
}