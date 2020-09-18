'use strict'

const Models = require('../index')

class UsersModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'user_activities'
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
            from_ip: {
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            // examples: searching, checkout, topup, many others
            activity_type: {
                type: 'string',
                stringType: 'bpchar(20)',
                isNullable: false
            },
            data: {
                type: Object,
                stringType: 'json',
                isNullable: false
            },
            created_at: {
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
            type: { // untuk search by type
                keys: {activity_type: 1}
            },
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1}
            }
        }
    }

    /* functions */

    async create (item) {
        try {
            await this.execquery(
                `INSERT INTO ${this.tableName} (from_ip, activity_type, data, created_at) VALUES ($1, $2, $3, $4)`, [
                    item.from_ip,
                    item.activity_type,
                    item.data,
                    item.created_at
                ])
            return true
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (instance = {}) {
    const model = new UsersModel(instance)
    return model
}