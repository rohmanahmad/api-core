'use strict'

const Models = require('../index')
const {result} = require('lodash')

class ProductReviewRepliesModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'review_replies'
    }

    get connection () {
        return 'pg'
    }

    get schema () {
        return {
            id: Number,
            review_id: Number, // relasi ke product_review.id
            customer_id: Number, // relasi ke customer.id
            ukm_id: Number, // relasi ke ukm.id
            reply_text: String,
            reply_images: String,
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
            review_id: { // sort chat by date
                keys: {review_id: -1},
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
    const model = new ProductReviewRepliesModel(instance)
    return model
}