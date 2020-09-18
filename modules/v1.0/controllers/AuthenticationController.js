'use strict'

/* 
    Login
     => login and auto create new user (if not exists)
 */
exports.login = async function (request, response) {
    const AuthenticationService = this.include('services', 'AuthenticationService')(this)
    const data = await AuthenticationService.loginWithAutoRegister(request.body, { ip: request.ip })
    response.send(data)
}

/* 
    OTPValidation
     => validate otp from device
 */
exports.OTPValidation = async function (request, response) {
    const AuthenticationService = this.include('services', 'AuthenticationService')(this)
    const data = await AuthenticationService.doValidateOTP(request.query, { ip: request.ip })
    response.send(data)
}