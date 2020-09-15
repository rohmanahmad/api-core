'use strict'

const Models = require('../index')

class EWalletModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'e_wallets'
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
            user_id: { // relasi ke user_accounts
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            credits: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            is_active: {
                type: Boolean,
                stringType: 'bool',
                isNullable: false
            },
            notes: {
                type: String,
                stringType: 'text',
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
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1}
            }
        }
    }

    /* functions */
}

module.exports = function (instance = {}) {
    const model = new EWalletModel(instance)
    return model
}