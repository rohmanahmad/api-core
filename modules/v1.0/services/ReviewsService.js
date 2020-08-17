'use strict'

class ProductsService {
    constructor (instance) {
        this.instance = instance
    }

    async getByProduct (filter = {}) {
        try {
            const ReviewsModel = this.instance.include('models', 'ReviewsModel')(this.instance)
            const data = await Reviews.findOne(filter)
            return data
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new ProductsService(injection)
    return instance
}