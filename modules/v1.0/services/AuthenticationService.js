'use strict'

class AuthenticationService {
    constructor (instance) {
        this.instance = instance
    }

    async login ({ username, password }) {
        try {
            const {UserAccountsModel} = this.instance.include('models', 'UserAccountsModel')(this.instance)
            await UserAccountsModel.doLogin({ username, password })
            console.log('creating restart activity')
            return true
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new AuthenticationService(injection)
    return instance
}