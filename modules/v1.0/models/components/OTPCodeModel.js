'use strict'

const Models = require('../index')
const {result} = require('lodash')
const moment = require('moment')

class OTPCodeModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'otp_code'
    }

    get connection () {
        return 'pg'
    }

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4'
            },
            user_id: {
                type: Number,
                stringType: 'int4'
            },
            otp_code: {
                type: String,
                stringType: 'bpchar(6)'
            }, // yaitu parentid masih dari tabel yg sama
            otp_type: {
                type: String,
                stringType: 'bpchar(10)' // email, sms, whatsapp
            },
            status: {
                type: Number,
                stringType: 'int4' // 0: pending, 1: success, 2: timeout
            },
            valid_until: {
                type: Date,
                stringType: 'timestamp'
            },
            created_at: {
                type: Date,
                stringType: 'timestamp'
            },
            updated_at: {
                type: Date,
                stringType: 'timestamp'
            }
        }
    }

    get index () {
        return {
            primary: {
                keys: {id: -1},
                uniq: true
            },
            otp_search: { // untuk sorting kebanyakan DESC
                keys: {otp_code: 1, otp_type: 1, valid_until: -1},
                uniq: false
            },
            user: { // untuk sorting kebanyakan DESC
                keys: {user_id: 1},
                uniq: false
            },
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1}
            }
        }
    }

    /* functions */
    async generateOTP ({userid, type}) {
        try {
            let code = `${Math.random() * 1010101010}`.substr(0, 6)
            const isAvailable = await this.isAvailable(code)
            if (!isAvailable) code = await this.generateOTP({ userid }) // getting new otp
            const sql = `INSERT INTO ${this.tableName}
                (
                    user_id,
                    otp_code,
                    otp_type,
                    status,
                    valid_until,
                    created_at,
                    updated_at
                )
            VALUES
                ($1, $2, $3, $4, $5, $6, $7)`
            const q = this.execquery(sql, [
                userid,
                code,
                type,
                0,
                moment().add(10, 'm').toDate(), // active only 10minutes from starting
                new Date(),
                new Date()
            ])
            return code
        } catch (err) {
            throw err
        }
    }

    async getCode (code) {
        const sql = `SELECT * FROM ${this.tableName} WHERE otp_code = $1 AND status = 0 AND valid_until > NOW() LIMIT 1`
        const q = await this.execquery(sql, [code])
        return q.rows
    }

    async isAvailable (code) {
        const q = await this.getCode(code)
        return (q && q.length === 0) // true or false
    }
}

module.exports = function (instance = {}) {
    const model = new OTPCodeModel(instance)
    return model
}