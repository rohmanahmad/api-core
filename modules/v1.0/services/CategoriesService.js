'use strict'

class CategoriesService {
    constructor (instance) {
        this.instance = instance
    }

    async list (filter = {}, parentLink) {
        try {
            const Categories = this.instance.include('models', 'CategoriesModel')(this.instance)
            const data = await Categories.getProductCategories(filter, parentLink)
            return data
        } catch (err) {
            throw err
        }
    }

    async getTotal (filter = {}) {
        try {
            const Categories = this.instance.include('models', 'CategoriesModel')(this.instance)
            const data = await Categories.getTotal(filter)
            return data
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new CategoriesService(injection)
    return instance
}