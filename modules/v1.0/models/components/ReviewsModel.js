'use strict'

const Models = require('../index')
const {result, set} = require('lodash')

class ProductsModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'reviews'
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
            product_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // as foreign-key to product_list
            ukm_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // as foreign-key to ukm_list
            customer_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // as foreign-key to customer_list
            review_text: {
                type: String,
                stringType: 'text',
                isNullable: false
            }, // dibatasi 255 karakter
            review_images_url: {
                type: String,
                stringType: 'text',
                isNullable: false
            }, // dipisahkan tanda koma. metok 4 images
            created_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            },
            updated_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            },
        }
    }

    get index () {
        return {
            primary: {
                keys: {id: -1},
                uniq: true
            },
            product: { // mencari review by productid dan customerid serta ukmid
                keys: {product_id: -1, ukm_id: 1, customer_id: 1},
                uniq: false
            },
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1}
            }
        }
    }

    /* functions */
    /* 
    - sort_by: [name, price]
    - sort_dir: [asc, desc] > default: asc
     */
    async list ({product_id, limit, page, pagination}, parentLink) {
        try {
            const {tableName: ukm_list} = this.instance.include('models', 'CategoriesModel')(this.instance)
            const {productStatus} = this.instance.include('helpers', 'ProductHelper')(this.instance)
            const usePagination = pagination === 'yes'
            const currentLimit = parseInt(limit) || 10
            const currentPage = parseInt(page) || 1
            const currentOffset = currentLimit * (currentPage - 1)
            let sql = [`SELECT ${this.tableName}.*, FROM ${this.tableName}`]
            if (product_id) sql.push(this.where('id', parseInt(product_id)))
            sql.push(this.where(`${this.tableName}.id`, product_id))
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (instance = {}) {
    const model = new ProductsModel(instance)
    return model
}