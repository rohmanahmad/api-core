'use strict'

class AuthenticationController {
    constructor () {}
    async loginUKMUser (request, response) {
        const AuthenticationService = this.include('services', 'AuthenticationService')(this)
        const data = await AuthenticationService.tryLoginUKMuser(request.body)
        response.send(data)
    }
}

module.exports = function (handler, config = {}) {
    const c = new AuthenticationController(config)
    return c[handler]
}