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
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            user_password: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            user_phonenumber: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            is_active: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            is_blocked: {
                type: Number,
                stringType: 'int4',
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
            invalidUserAndPasswordMessage: 'Invalid Username And Password',
            blockedAccountMessage: 'Account Blocked',
            needActivateAccountMessage: 'Your Account Need to be Activating. Please Check Your Email',
        }
    }

    /* 
    login hanya valid menggunakan email dan password, selainnya pakai verifikasi by phonenumber / google / facebook
    */
    async doLogin ({email, password}) {
        try {
            const {
                invalidUserAndPasswordMessage,
                blockedAccountMessage,
                needActivateAccountMessage
            } = this.messages
            const hashPassword = md5(password)
            const sql = `SELECT * FROM ${this.tableName} WHERE user_email = $1 AND user_password = $2`
            const data = await this.execquery(sql, [email, hashPassword])
            if (!data) throw new Error(invalidUserAndPasswordMessage)
            return data
        } catch (err) {
            throw err
        }
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

    async register ({email, password, phonenumber}) {
        const hashPassword = md5(password)
        const sql = `INSERT INTO ${this.tableName}
            (user_email,    user_password,  user_phonenumber,   is_active,  is_blocked, ukm_id, created_at, updated_at)
            VALUES 
            ($1,            $2,             $3,                 $4,         $5,         $6,     $7,         $8)`
        await this.execquery(sql, [
            email,
            password,
            phonenumber,
            false,
            false,
            null,
            new Date(),
            new Date()
        ])
        return 
    }
}

module.exports = function (instance = {}) {
    const model = new UserAccountsModel(instance)
    return model
}