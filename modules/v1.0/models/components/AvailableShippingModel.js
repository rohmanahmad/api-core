'use strict'

const Models = require('../index')
const {result} = require('lodash')

class AvailableShippingModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'available_shipping'
    }

    get connection () {
        return 'pg'
    }

    get schema () {
        return {
            id: Number,
            ukm_id: Number,
            shipping_id: Number,
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
            ukm: { // untuk mencari data berdasarkan
                keys: {ukm_id: 1},
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
    const model = new AvailableShippingModel(instance)
    return model
}