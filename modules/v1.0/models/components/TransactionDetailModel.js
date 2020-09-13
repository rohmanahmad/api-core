'use strict'

const Models = require('../index')
const {result} = require('lodash')

class TransactionDetailModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'transaction_detail'
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
            transaction_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke transactions.id
            trx_product_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relase ke product_list.id
            trx_locked_name: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            },
            trx_locked_price: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            trx_locked_image_urls: {
                type: String,
                stringType: 'text',
                isNullable: false
            }, // url didapat dari copy dari product images
            trx_locked_discount: {
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
            search_autocomplete: { // search shipping
                keys: {shipping_name: 1},
                uniq: false
            },
            date: { // untuk sorting
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* functions */

    /* //blm dipakai
    async getTotal ({category_id, category_name}) {
        try {
            const sql = [`SELECT COUNT(*) FROM ${this.tableName}`]
            const query = await this.execquery(
                sql, this.values)
            return {
                total: parseInt(result(query, 'rows[0].count', 0)),
                filters: {
                    category_id,
                    category_name
                }
            }
        } catch (err) {
            throw err
        }
    } */
}

module.exports = function (instance = {}) {
    const model = new TransactionDetailModel(instance)
    return model
}