'use strict'

const Models = require('../index')
const {result} = require('lodash')

class CategoriesModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'category_list'
    }

    get connection () {
        return 'pg'
    }

    get schema () {
        return {
            id: Number,
            parent_id: Number, // yaitu parentid masih dari tabel yg sama
            category_name: String,
            category_description: String,
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
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1}
            }
        }
    }

    /* functions */

    async getProductCategories ({category_id, category_name, limit, page, pagination}, parentLink) {
        try {
            const usePagination = pagination === 'yes'
            const currentLimit = parseInt(limit) || 10
            const currentPage = parseInt(page) || 1
            const currentOffset = currentLimit * (currentPage - 1)
            let sql = [`SELECT * FROM ${this.tableName}`]
            if (category_id) {
                sql.push(this.where('id', category_id))
            }
            if (category_name) {
                sql.push(this.where('category_name', category_name))
            }
            sql.push(this.limit(currentLimit))
            sql.push(this.offset(currentOffset))
            const query = await this.execquery(
                sql, this.values)
            if (!query) query = {}
            if (query && !query.rows) query = {}
            const data = {
                items: query.rows || [],
                count: (query.rows || []).length,
                filters: {
                    category_id,
                    category_name,
                    limit: currentLimit,
                    page: currentPage,
                },
                pagination: {}
            }
            if (usePagination) {
                this.values = [] // reset values of query
                this.whereClause = [] // reset values of query
                const t = await this.getTotal({category_id, category_name})
                data['pagination'] = this.usePaginationModule({
                    total: t.total,
                    // total: 30,
                    current: currentPage,
                    limitPerPage: currentLimit,
                    parentLink
                })
            }
            return data
        } catch (err) {
            throw err
        }
    }

    async getTotal ({category_id, category_name}) {
        try {
            const sql = [`SELECT COUNT(*) FROM ${this.tableName}`]
            if (category_id) sql.push(this.where('id', category_id))
            if (category_name) sql.push(this.where('category_name', category_name))
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
    }
}

module.exports = function (instance = {}) {
    const model = new CategoriesModel(instance)
    return model
}