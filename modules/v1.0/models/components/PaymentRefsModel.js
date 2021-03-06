'use strict'

const Models = require('../index')

class PaymentRefsModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'payment_reference'
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
            nominal: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            payment_method: { // bank_transfer / credits
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            e_wallet_transaction_id: { // relasi ke e_wallet_transaction
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            bank_transaction_id: { // relasi ke bank_transaction
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
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1}
            }
        }
    }

    /* functions */
}

module.exports = function (instance = {}) {
    const model = new PaymentRefsModel(instance)
    return model
}