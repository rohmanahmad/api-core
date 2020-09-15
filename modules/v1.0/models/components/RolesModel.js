'use strict'

const Models = require('../index')

class Roles extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'roles'
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
            roles_name: { // roles_name berupa admin, client, vendor
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            roles: { // roles berupa string, hanya dipisah menggunakan koma
                type: String,
                stringType: 'text',
                isNullable: false
            },
            status: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
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
            name: { // mencari dengan spesifik server dan jenis
                keys: {roles_name: -1},
                uniq: false
            },
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1}
            }
        }
    }

    /* functions */
}

module.exports = function (instance = {}) {
    const model = new Roles(instance)
    return model
}