'use strict'

const productStatusList = ['InActive', 'Active', 'Pending', 'Trash']
const productRatingLevel = ['Sangat Buruk', 'Buruk', 'Lumayan', 'Bagus', 'Sangat Bagus']

class ProductHelper {
    constructor (instance) {
        this.instance = instance
    }

    productStatus (statusId = 0) {
        return productStatusList[statusId] || productStatusList[0]
    }

    starsLevel (level = 0) {
        return productRatingLevel[Math.floor(level)] || productRatingLevel[0]
    }
}

module.exports = function (instance) {
    return new ProductHelper(instance)
}