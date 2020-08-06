'use strict'

class HomeController {
    constructor () {}
    async main (request, response) {
        response.send('ini index')
    }
}

module.exports = function (handler, config = {}) {
    const c = new HomeController(config)
    return c[handler]
}