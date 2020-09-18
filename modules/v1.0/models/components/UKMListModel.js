'use strict'

const Models = require('../index')
const {result} = require('lodash')

class UKMListModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'ukm_list'
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
            account_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke transactions.id
            ukm_name: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            }, // relase ke product_list.id
            store_name: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            },
            address_id: {
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
            name: { // untuk searching
                keys: {ukm_name: -1},
                uniq: false
            },
            date: { // untuk sorting
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* functions */
    async findById (id) {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`
            const q = await this.execquery(sql, [id])
            return q.rows[0]
        } catch (err) {
            throw err
        }
    }

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
    const model = new UKMListModel(instance)
    return model
}