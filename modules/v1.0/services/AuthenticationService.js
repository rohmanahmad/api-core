'use strict'

const Services = require('./__index_module')

class AuthenticationService extends Services {
    constructor (instance) {
        super()
        this.instance = instance
    }

    async loginWithAutoRegister ({ userlogin, password }, { ip }) {
        try {
            const UserAccountsModel = this.instance.include('models', 'UserAccountsModel')(this.instance)
            const {opt, data, type} = await UserAccountsModel.findLogin({ userlogin })
            // sending events to redis
            // ....
            // creating log activity (success)
            await this.createSuccessActivity({type: 'login', response: data, ip}, { userlogin })
            return {
                statusCode: 200,
                message: 'OK',
                data: {
                    messageText: `Mohon Cek ${type} Untuk Melakukan Validasi OTP`
                }
            }
        } catch (err) {
            // creating log activity (error)
            await this.createErrorActivity({type: 'login', err, ip}, { userlogin })
            throw err
        }
    }

    async doValidateOTP ({ otp_code: code }, { ip }) {
        try {
            if (!code) throw new Error('Invalid OTP')
            const {OTPCodeModel, UserAccountsModel, UKMListModel, CustomerListModel} = this.instance.include('models')
            const qOTP = await OTPCodeModel(this.instance).getCode(code)
            if (!qOTP || (qOTP && !qOTP[0])) throw new Error('Invalid Code')
            const {user_id: userid} = qOTP[0]
            const userdata = await UserAccountsModel(this.instance).findById(userid)
            if (userdata.is_blocked) throw new Error('Account kamu Terblokir, Harap Hubungi Support Kami Untuk Pemulihan.')
            let responseData = {}
            responseData['type'] = 'customer'
            responseData['need_update_profile'] = false
            if (userdata.ukm_id > 0) {
                const data = await UKMListModel(this.instance).findById(userdata.ukm_id)
                responseData['type'] = 'ukm'
                if (!data) responseData['need_update_profile'] = true
            } else {
                const data = await CustomerListModel(this.instance).findById(userdata.id)
                if (!data) responseData['need_update_profile'] = true
            }
            return {
                statusCode: 200,
                message: 'OK',
                data: responseData
            }
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new AuthenticationService(injection)
    return instance
}