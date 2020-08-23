'use strict'

class UserAccountsService {
    constructor (instance) {
        this.instance = instance
    }

    async getInformation ({ email, phonenumber }) {
        try {
            const UserAccountsModel = this.instance.include('models', 'UserAccountsModel')
            const information = await UserAccountsModel.getInformation({ email, phonenumber })
            return information
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    debugger
    const instance = new UserAccountsService(injection)
    return instance
}