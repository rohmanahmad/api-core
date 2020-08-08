'use strict'

const Models = require('../index')

class UsersModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'application_events_log'
    }

    get connection () {
        return 'pg'
    }

    /* functions */

    async createRestartActivity () {
        try {
            await this.execquery(
                `INSERT INTO ${this.tableName} (server_ip, type, data, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)`, [
                    '127.0.0.1',
                    'restart-server',
                    {},
                    new Date(),
                    new Date()
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