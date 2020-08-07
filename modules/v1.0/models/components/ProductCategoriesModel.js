'use strict'

const Models = require('../index')

class ProductCategories extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'product_categories'
    }

    get connection () {
        return 'pg'
    }

    /* functions */

    async list ({category_id, category_name, }) {
        try {
            let sql = [`SELECT * FROM ${this.tableName}`]
            sql.push(`WHERE`)
            if (category_id) sql.push(``)
            await this.query(
                sql, [
                    '127.0.0.1',
                    'restart-server',
                    {},
                    new Date(),
                    new Date()
                ])
            return true
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (instance = {}) {
    const model = new ProductCategories(instance)
    return model
}