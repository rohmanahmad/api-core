'use strict'

class CategoriesService {
    constructor (instance) {
        this.instance = instance
    }

    async createRestartActivity (filter = {}) {
        try {
            const Categories = this.instance.include('models', 'Categories')(this.instance)
            await Categories.getProductCategories(filter)
            console.log('creating restart activity')
            return true
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new CategoriesService(injection)
    return instance
}