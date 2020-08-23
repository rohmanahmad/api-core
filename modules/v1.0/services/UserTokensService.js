'use strict'

class UserTokenService {
    constructor (instance) {
        this.instance = instance
    }

    async getToken ({ userdata }) { // return string
        try {
            const UserTokensModel = this.instance.include('models', 'UserTokensModel')
            const currentToken = await UserTokensModel.getToken({ userdata })
            return currentToken
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new UserTokenService(injection)
    return instance
}