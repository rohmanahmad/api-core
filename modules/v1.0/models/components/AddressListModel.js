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

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            address_name: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            },
            address_street: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            address_province: {
                type: String,
                stringType: 'bpchar(50)',
                isNullable: false
            },
            address_city: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            },
            address_kecamatan: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            },
            address_kelurahan: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            },
            address_postal_code: {
                type: String,
                stringType: 'bpchar(10)',
                isNullable: false
            },
            ukm_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke ukm.id
            customer_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke customer.id
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