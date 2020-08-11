'use strict'

const Models = require('../index')

class ProductImagesModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'product_images'
    }

    get connection () {
        return 'pg'
    }

    /* functions */
}

module.exports = function (instance = {}) {
    const model = new ProductImagesModel(instance)
    return model
}