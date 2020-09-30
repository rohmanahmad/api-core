'use strict'

const Services = require('./__index_module')

class AuthenticationService extends Services {
    constructor (instance) {
        super()
        this.instance = instance
    }

    async loginWithAutoRegister ({ userlogin, otp_method: method }, { ip }) {
        try {
            const RedisService = this.instance.include('services', 'RedisService')(this.instance)
            const UserAccountsModel = this.instance.include('models', 'UserAccountsModel')(this.instance)
            const {otp, data} = await UserAccountsModel.findLogin({ userlogin, method })
            // sending events to redis
            let user = data.user_email
            if (method === 'whatsapp') user = data.user_phonenumber
            await RedisService.sendTriggerOTP({method, otp, user: user.trim()})
            // creating log activity (success)
            await this.createSuccessActivity({type: 'login', response: data, ip}, { userlogin })
            return {
                statusCode: 200,
                message: 'OK',
                data: {
                    messageText: `Mohon Cek ${method} Untuk Melakukan Validasi OTP`,
                    status: 'sent',
                    otp_dev: otp
                }
            }
        } catch (err) {
            // creating log activity (error)
            await this.createErrorActivity({type: 'login', err, ip}, { userlogin })
            throw err
        }
    }

    async doValidateOTP ({ username, otp_code: otp }, { ip }) {
        try {
            if (!otp) throw new Error('Invalid OTP')
            const { OTPCodeModel, UKMListModel, CustomerListModel, UserAccountsModel } = this.instance.include('models')
            const user = await UserAccountsModel(this.instance).findOne({username})
            const userdata = await OTPCodeModel(this.instance).findUserOTPByType({type: 'whatsapp', userid: user.id, otp})
            if (!userdata) throw new Error('Invalid Code')
            if (userdata.is_blocked) throw new Error('Account kamu Terblokir, Harap Hubungi Support Kami Untuk Pemulihan.')
            let responseData = {}
            responseData['type'] = 'customer'
            responseData['need_update_profile'] = false
            if (userdata.ukm_id > 0) {
                const data = await UKMListModel(this.instance).findById(userdata.ukm_id)
                responseData['type'] = 'ukm'
                if (!data) responseData['need_update_profile'] = true
            } else {
                const data = await CustomerListModel(this.instance).findById(userdata.customer_id)
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