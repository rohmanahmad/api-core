'use strict'

const Models = require('../index')

/*
    tabel ini tidak diubah secara langsung oleh pemilik maupun admin.
    ini otomatis diubah berdasarkan data dari review dan dihitung menggunakan formula
*/
class WalletTransactionModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'wallet_transaction'
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
            wallet_id: { // product, store or other
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, 
            ewallet_transaction_type: {// foreign-key dari product_list
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            }, 
            ewall_send_to_ewallet_id: {// foreign-key dari ukm_list
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            ewall_transaction_nominal: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            ewall_payment_method: {
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            },
            ewall_approved_by_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            ewall_pre_transaction_credits: { // sebelum transaksi
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            ewall_after_transaction_credits: { // setelah transaksi
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            ewall_signed_transaction_token: { // token transaksi
                type: String,
                stringType: 'text',
                isNullable: false
            },
            ewall_approved_at: {
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
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* functions */
}

module.exports = function (instance = {}) {
    const model = new WalletTransactionModel(instance)
    return model
}