'use strict'

const Models = require('../index')
const {result, set} = require('lodash')

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

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            category_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // foreign-key dari category_list
            product_name: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            },
            product_description: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            product_price: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            product_status: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            product_discount: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            product_stock: {
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
            category: { // digunakan untuk pencarian by category
                keys: {category_id: 1},
                uniq: false
            },
            productname: { // digunakan untuk pencarian by keyword
                keys: {product_name: 1},
                uniq: false
            },
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* functions */
    /* 
    - sort_by: [name, price]
    - sort_dir: [asc, desc] > default: asc
     */
    async list ({product_id, category_id, product_name, product_stock, product_status, sort_by, sort_dir, limit, page, pagination}, parentLink) {
        try {
            const {tableName: categoryTable} = this.instance.include('models', 'CategoriesModel')(this.instance)
            const {productStatus} = this.instance.include('helpers', 'ProductHelper')(this.instance)
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
            const items = (query.rows || []).map(function (x) {
                return {
                    product_id: x.id,
                    category_id: x.category_id,
                    category_name: x.category_name,
                    product_name: x.product_name,
                    product_price: x.product_price,
                    product_stock: x.product_stock,
                    product_status_id: x.product_status,
                    product_status_value: productStatus(x.product_status),
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
            } else {
                data.pagination = {disabled: true}
            }
            return data
        } catch (err) {
            throw err
        }
    }

    async getDetail ({product_id}) {
        try {
            if (!product_id || (product_id && product_id.length === 0)) throw new Error('Invalid Project ID')
            const {tableName: CategoriesTable} = this.instance.include('models', 'CategoriesModel')(this.instance)
            const {tableName: ProductImagesTable} = this.instance.include('models', 'ProductImagesModel')(this.instance)
            const {tableName: ProductRateSummaryTable} = this.instance.include('models', 'ProductRateSummaryModel')(this.instance)
            const {productStatus, starsLevel} = this.instance.include('helpers', 'ProductHelper')(this.instance)
            let sql = [`SELECT 
                ${this.tableName}.*,
                ${CategoriesTable}.category_name,
                ${ProductImagesTable}.image_index,
                ${ProductImagesTable}.image_name,
                ${ProductImagesTable}.image_url,
                ${ProductRateSummaryTable}.stars_level
                    FROM ${this.tableName}`]
            sql.push(`LEFT JOIN ${CategoriesTable} ON ${CategoriesTable}.id = ${this.tableName}.category_id`)
            sql.push(`LEFT JOIN ${ProductImagesTable} ON ${ProductImagesTable}.product_id = ${this.tableName}.id`)
            sql.push(`LEFT JOIN ${ProductRateSummaryTable} ON ${ProductRateSummaryTable}.product_id = ${this.tableName}.id`)
            sql.push(this.where(`${this.tableName}.id`, product_id))
            const query = await this.execquery(
                sql, this.values)
            const rows = query && query.rows ? query.rows : []
            const data = {
                // product_id: 0,
                // category: {
                //     id: 0,
                //     name: ''
                // },
                // product_name: '',
                // product_description: '',
                // product_status: {
                //     id: 0,
                //     name: ''
                // },
                // product_stars: {
                //     id: 4.5,
                //     name: 'Good Product'
                // },
                // product_discount: 0,
                // product_price: 0,
                // product_stock: 0,
                // product_images: [
                //     {
                //         index: 1,
                //         image: "/static/images/product1.jpg",
                //         title: "this is image 1"
                //     }
                // ],
                // created_at: '',
                // updated_at: ''
            }
            let item = rows.reduce(function (r, x) {
                if (!r.product_id) set(r, 'product_id', x.id)
                if (!r.category) {
                    set(r, 'category.id', x.category_id)
                    set(r, 'category.name', x.category_name)
                }
                if (!r.product_name) set(r, 'product_name', x.product_name)
                if (!r.product_description) set(r, 'product_description', x.product_description)
                if (!r.product_status) {
                    set(r, 'product_status.id', x.product_status)
                    set(r, 'product_status.value', productStatus(x.product_status))
                }
                if (!r.product_discount) set(r, 'product_discount', x.product_discount)
                if (!r.product_price) set(r, 'product_price', x.product_price) // bermasalah masih, nilai nya 0
                if (!r.product_stock) set(r, 'product_stock', x.product_stock)
                if (!r.created_at) set(r, 'created_at', x.created_at)
                if (!r.updated_at) set(r, 'updated_at', x.updated_at)
                if (!r.product_images) r.product_images = []
                if (!r.product_stars) {
                    r.product_stars = {
                        value: x.stars_level,
                        label: starsLevel(x.stars_level)
                    }
                }
                if (x.image_url) {
                    r.product_images.push({
                        index: x.image_index,
                        image: x.image_url,
                        title: x.image_name
                    })
                }
                return r
            }, data)
            // getting product favorite by product_id
            // only available for logged user
            // code here
            debugger
            return {
                objectItem: item,
                filters: { product_id }
            }
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