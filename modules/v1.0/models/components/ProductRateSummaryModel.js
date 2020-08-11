'use strict'

const Models = require('../index')

class ProductRateSummary extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'product_rate_summary'
    }

    get connection () {
        return 'pg'
    }

    /* functions */
}

module.exports = function (instance = {}) {
    const model = new ProductRateSummary(instance)
    return model
}