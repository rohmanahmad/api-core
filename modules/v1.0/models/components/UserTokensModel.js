'use strict'

const Models = require('../index')
const md5 = require('md5')

class UserTokensModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'user_tokens'
    }

    get connection () {
        return 'pg'
    }

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            user_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // >> user_accounts.id
            token: {
                type: String,
                stringType: 'text',
                isNullable: false
            }, // text hash
            expired: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            }, // expired date in time 
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
            token_active: { // digunakan untuk get token by userid
                keys: {user_id: 1, expired: -1},
                uniq: false
            },
            token_inactive: { // digunakan untuk menghapus token yg tidak diperlukan lagi
                keys: {expired: 1},
                uniq: false
            },
            created_date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* FUNCTIONS */

    async createToken (userdata = {}) {
        try {
            const {id} = userdata
            if (!id) throw new Error('Invalid Userdata')
            const newToken = md5(JSON.stringify(userdata) + '_' + new Date().getTime())
            const expiredTime = new Date().getTime() + (1000 * 60 * 60 * 24) // 24 jam
            const sql = `INSERT INTO ${this.tableName}
                (user_id,   token,  expired,created_at, updated_at)
            VALUES
                ($1,        $2,     $3,     $4,         $5)`
            await this.execquery(sql, [
                id,
                newToken,
                expiredTIme,
                new Date(),
                new Date()
            ])
            return dataToInsert
        } catch (err) {
            throw err
        }
    }

    async getToken ({ userdata }) {
        try {
            const now = new Date().getTime() / 1000
            const sql = `SELECT token, user_id, expired FROM ${this.tableName} WHERE user_id = $1 AND expired > $2 LIMIT 1`
            const data = await this.execquery(sql, [ userdata.id, now ])
            if (!data) {
                await this.createToken(userdata)
                return dataToInsert
            } 
            return data && data[0] ? data[0] : data
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (instance = {}) {
    const model = new UserTokensModel(instance)
    return model
}