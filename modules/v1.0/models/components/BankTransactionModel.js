'use strict'

const Models = require('../index')

class BankTransactionModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'bank_transaction'
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
            bank_from_name: {
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            bank_destination_name: {
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            bank_ref_transaction_code: {
                type: String,
                stringType: 'bpchar(5)',
                isNullable: false
            },
            bank_sender_account_no: {
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            bank_sender_note: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            bank_sender_attachment: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            nominal: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            approved_by_id: { // relasi ke user_account yg rolenya sebagai admin / operation
                type: Number,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            approved_at: { // relasi ke user_account yg rolenya sebagai admin / operation
                type: Date,
                stringType: 'timestamp',
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
    const model = new BankTransactionModel(instance)
    return model
}