'use strict'

const Models = require('../index')
const {result} = require('lodash')

class ProductsModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'product_list'
    }

    get connection () {
        return 'pg'
    }

    /* functions */
    /* 
    - sort_by: [name, price]
    - sort_dir: [asc, desc] > default: asc
     */
    async list ({product_id, category_id, product_name, product_stock, product_status, sort_by, sort_dir, limit, page, pagination}, parentLink) {
        try {
            console.log('--->>>>')
            const {tableName: categoryTable} = this.instance.include('models', 'CategoriesModel')(this.instance)
            const usePagination = pagination === 'yes'
            const currentLimit = parseInt(limit) || 10
            const currentPage = parseInt(page) || 1
            const currentOffset = currentLimit * (currentPage - 1)
            let sql = [`SELECT ${this.tableName}.*, ${categoryTable}.category_name FROM ${this.tableName}`]
            sql.push(`LEFT JOIN ${categoryTable} ON ${this.tableName}.category_id = ${categoryTable}.id`)
            if (product_id) sql.push(this.where('id', parseInt(product_id)))
            if (category_id) sql.push(this.where('category_id', parseInt(category_id)))
            if (product_name) sql.push(this.whereLike('product_name', `%${product_name}%`))
            if (product_stock) sql.push(this.where('product_stock', parseInt(product_stock)))
            if (product_status) sql.push(this.where('product_status', parseInt(product_status)))
            if (sort_by) {
                const direction = sort_dir === 'desc' ? 'DESC' : 'ASC'
                if (sort_by === 'name') {
                    sql.push(`SORT BY product_name ${direction}`)
                } else if (sort_by === 'price') {
                    sql.push(`SORT BY product_price ${direction}`)
                }
            }
            sql.push(this.limit(currentLimit))
            sql.push(this.offset(currentOffset))
            const query = await this.execquery(
                sql, this.values)
            if (!query) query = {}
            if (query && !query.rows) query = {}
            const productStatuses = ['InActive', 'Active', 'Pending', 'Trash']
            const items = (query.rows || []).map(function (x) {
                return {
                    id: x.id,
                    category: {
                        id: x.category_id,
                        name: x.category_name
                    },
                    product_name: x.product_name,
                    product_price: x.product_price,
                    product_stock: x.product_stock,
                    product_status: {
                        id: x.product_status,
                        value: productStatuses[x.product_status]
                    },
                    product_description: x.product_description,
                    product_discount: x.product_discount,
                    created_at: x.created_at,
                    updated_at: x.updated_at
                }
            })
            const data = {
                items,
                count: (query.rows || []).length,
                filters: {
                    product_id,
                    category_id,
                    product_name,
                    product_stock,
                    product_status,
                    sort_by,
                    sort_dir,
                    limit: currentLimit,
                    page: currentPage,
                },
                pagination: {}
            }
            if (usePagination) {
                this.values = [] // reset values of query
                this.whereClause = [] // reset values of query
                const t = await this.getTotal({product_id, category_id, product_name, product_stock, product_status})
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

    async getTotal ({product_id, category_id, product_name, product_stock, product_status}) {
        try {
            let sql = [`SELECT COUNT(*) FROM ${this.tableName}`]
            if (product_id) sql.push(this.where('id', parseInt(product_id)))
            if (category_id) sql.push(this.where('category_id', parseInt(category_id)))
            if (product_name) sql.push(this.whereLike('product_name', `%${product_name}%`))
            if (product_stock) sql.push(this.where('product_stock', parseInt(product_stock)))
            if (product_status) sql.push(this.where('product_status', parseInt(product_status)))
            const query = await this.execquery(
                sql, this.values)
            return {
                total: parseInt(result(query, 'rows[0].count', 0)),
                filters: {
                    product_id,
                    category_id,
                    product_name,
                    product_stock,
                    product_status
                }
            }
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (instance = {}) {
    const model = new ProductsModel(instance)
    return model
}