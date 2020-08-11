'use strict'

exports.loginUKMUser = async function (request, response) {
    const AuthenticationService = this.include('services', 'AuthenticationService')(this)
    const data = await AuthenticationService.tryLoginUKMuser(request.body)
    response.send(data)
}