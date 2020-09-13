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

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            review_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke product_review.id
            customer_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke customer.id
            ukm_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke ukm.id
            reply_text: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            reply_images_url: {
                type: String,
                stringType: 'text',
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