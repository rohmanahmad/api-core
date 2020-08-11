'use strict'

class ProductsService {
    constructor (instance) {
        this.instance = instance
    }

    async list (filter = {}, parentLink) {
        try {
            const Products = this.instance.include('models', 'ProductsModel')(this.instance)
            const data = await Products.list(filter, parentLink)
            return data
        } catch (err) {
            throw err
        }
    }

    async detail (filter = {}) {
        try {
            const Products = this.instance.include('models', 'ProductsModel')(this.instance)
            const data = await Products.getDetail(filter)
            return data
        } catch (err) {
            throw err
        }
    }

    async getTotal (filter = {}) {
        try {
            const Products = this.instance.include('models', 'ProductsModel')(this.instance)
            const data = await Products.getTotal(filter)
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