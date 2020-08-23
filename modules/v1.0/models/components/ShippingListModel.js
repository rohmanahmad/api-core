'use strict'

const Models = require('../index')
const {result} = require('lodash')

class ShippingListModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'product_review_replies'
    }

    get connection () {
        return 'pg'
    }

    get schema () {
        return {
            id: Number,
            shipping_name: String,
            shipping_company_id: Number,
            is_active: Boolean,
            created_at: Date,
            updated_at: Date
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
    const model = new ShippingListModel(instance)
    return model
}