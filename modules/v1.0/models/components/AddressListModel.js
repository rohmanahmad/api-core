'use strict'

const Models = require('../index')
const {result} = require('lodash')

class AddressListModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'address_list'
    }

    get connection () {
        return 'pg'
    }

    get schema () {
        return {
            id: Number,
            address_name: String,
            address_street: String,
            address_province: String,
            address_city: String,
            address_kecamatan: String,
            address_kelurahan: String,
            address_postal_code: String,
            ukm_id: Number, // relasi ke ukm.id
            customer_id: Number, // relasi ke customer.id
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
            name: { // untuk mencari data autocomplete
                keys: {address_name: 1},
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
    const model = new AddressListModel(instance)
    return model
}