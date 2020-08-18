'use strict'

const Models = require('../index')
const md5 = require('md5')

class UKMUsersModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'ukm_users'
    }

    get connection () {
        return 'pg'
    }

    get schema () {
        return {
            id: Number,
            category_id: Number, // foreign-key dari category_list
            product_name: String,
            product_description: String,
            product_price: Number,
            product_status: Number,
            product_discount: Number,
            product_stock: Number,
            created_at: Date,
            updated_at: Date
        }
    }

    get index () {
        return {
            primary: {
                keys: {id: -1},
                uniq: true
            },
            category: { // digunakan untuk pencarian by category
                keys: {category_id: 1},
                uniq: false
            },
            productname: { // digunakan untuk pencarian by keyword
                keys: {product_name: 1},
                uniq: false
            },
            stock: { // digunakan untuk pencarian by keyword
                keys: {stock: 1},
                uniq: false
            },
            date: { // untuk sorting kebanyakan DESC
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

    async doLoginUKM ({email, password}) {
        try {
            const {
                invalidUserAndPasswordMessage,
                blockedAccountMessage,
                needActivateAccountMessage
            } = this.messages
            const hashPassword = md5(password)
            const sql = `SELECT * FROM ${this.tableName} WHERE ukm_user_email = $1 AND ukm_user_password = $2`
            const query = await this.execquery(sql, [email, hashPassword])
            if (!query) throw new Error(invalidUserAndPasswordMessage)

        } catch (err) {
            throw err
        }
    }

    async registerUKMUser ({email, password, fullname}) {
        const sql = `INSERT INTO ${this.tableName}
            (ukm_user_email, ukm_user_password, ukm_user_fullname, ukm_user_token, is_active, is_blocked, ukm_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
        await this.execquery(sql, [
            'rohmanmail@gmail.com',
            password,
            'akhmad abdul rohman',
            md5(password),
            1,
            0,
            1,
            new Date(),
            new Date()
        ])
    }
}

module.exports = function (instance = {}) {
    const model = new UKMUsersModel(instance)
    return model
}