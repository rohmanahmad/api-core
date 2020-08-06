'use strict'

class AuthenticationService {
    constructor (instance) {
        this.instance = instance
        this.models = {
            UKMUsersModel: this.instance.include('models', 'UKMUsersModel')(this.instance)
        }
    }

    async tryLoginUKMuser ({ username, password }) {
        try {
            const {UKMUsersModel} = this.models
            await UKMUsersModel.doLoginUKM({ username, password })
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