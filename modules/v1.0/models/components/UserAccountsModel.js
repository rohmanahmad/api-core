'use strict'

const Models = require('../index')
const md5 = require('md5')

class UserAccountsModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'user_accounts'
    }

    get connection () {
        return 'pg'
    }

    get schemas () {
        // user account bisa seorang pemilik ukm atau seorang customer (jadi satu)
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            user_email: {
                type: String,
                stringType: 'bpchar(50)',
                isNullable: false
            },
            user_password: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            user_phonenumber: {
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            is_active: {
                type: Boolean,
                stringType: 'bool',
                isNullable: false
            },
            is_blocked: {
                type: Boolean,
                stringType: 'bool',
                isNullable: false
            },
            ukm_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // jika user tsb juga sebagai mitra, maka ukm id ada isinya
            created_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            },
            updated_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            }
        }
    }

    get index () {
        return {
            primary: {
                keys: {id: -1},
                uniq: true
            },
            user_email: { // digunakan untuk getInformation
                keys: {user_email: 1},
                uniq: true
            },
            user_phonenumber: { // digunakan untuk getInformation by phonenumber
                keys: {user_phonenumber: 1},
                uniq: true
            },
            ukm_id: { // digunakan untuk pencarian by ukmid
                keys: {ukm_id: 1},
                uniq: true
            },
            created_date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* functions */

    get messages () {
        return {
            invalidUserAndPasswordMessage: 'Invalid User',
            blockedAccountMessage: 'Account Blocked',
            needActivateAccountMessage: 'Your Account Need to be Activating. Please Check Your Email',
        }
    }

    /* 
    login hanya valid menggunakan email dan password, selainnya pakai verifikasi by phonenumber / google / facebook
    */
    async findById (id) {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`
            const q = await this.execquery(sql, [id])
            return q.rows[0]
        } catch (err) {
            throw err
        }
    }
    async findLogin ({ userlogin }) {
        try {
            const {
                invalidUserAndPasswordMessage,
                blockedAccountMessage,
                needActivateAccountMessage
            } = this.messages
            const isEmail = userlogin.indexOf('@') > -1
            const isPhone = !isNaN(Number(userlogin))
            let opt = {
                email: '',
                phonenumber: '',
                password: ''
            }
            const type = isEmail ? 'email' : isPhone ? 'whatsapp' : 'none'
            if (isEmail) {
                opt['email'] = userlogin
            } else if (isPhone) {
                opt['phonenumber'] = userlogin
            } else {
                throw new Error('Invalid Userlogin')
            }
            const sql = `SELECT * FROM ${this.tableName} WHERE user_email = $1 OR user_phonenumber = $1 LIMIT 1`
            let data = await this.execquery(sql, [ userlogin ])
            if (!data || (data && data.rowCount === 0)) {
                data = await this.register(opt)
            }
            data = data.rows[0]
            const userid = data.id
            const OTPCodeModel = this.instance.include('models', 'OTPCodeModel')(this.instance)
            const otp = await OTPCodeModel.generateOTP({ userid, type })
            return {
                opt,
                type,
                data
            }
        } catch (err) {
            throw err
        }
    }

    async register (data) {
        const reg = await this.doRegister(data)
        return reg
    }

    async getInformation ({ email, phonenumber }) {
        try {
            const customerTable = this.instance.include('models', 'CustomerListModel')
            let sql = [`SELECT user_email,  FROM ${this.tableName}`]
            sql.push(`LEFT JOIN ${customerTable} ON ${customerTable}.user_id = ${this.tableName}.id`)
            sql.push(`WHERE`)
            if (email) sql.push()
        } catch (err) {
            throw err
        }
    }

    async doRegister ({email, password, phonenumber}) {
        const hashPassword = md5(password)
        const sql = `INSERT INTO ${this.tableName}
            (user_email,    user_password,  user_phonenumber,   is_active,  is_blocked, ukm_id, created_at, updated_at)
            VALUES 
            ($1,            $2,             $3,                 $4,         $5,         $6,     $7,         $8)
            RETURNING *`
        const q = await this.execquery(sql, [
            email,
            password,
            phonenumber,
            false,
            false,
            0,
            new Date(),
            new Date()
        ])
        return q
    }
}

module.exports = function (instance = {}) {
    const model = new UserAccountsModel(instance)
    return model
}