'use strict'

const Services = require('./__index_module')

class ProductsService extends Services {
    constructor (instance) {
        super()
        this.instance = instance
    }

    async list (filter = {}, basepath = '/') {
        try {
            const parentLink = basepath.split('?')[0]
            const Products = this.instance.include('models', 'ProductsModel')(this.instance)
            const {items, count, filters, metas} = await Products.list(filter, {parentLink})
            const data = {
                items,
                metadata: {count, filters},
                pagination: {}
            }
            const usePagination = (filters.pagination === 'yes')
            if (usePagination) {
                this.values = [] // reset values of query
                this.whereClause = [] // reset values of query
                const t = await this.getTotal({
                    product_id: filters.product_id,
                    category_id: filters.category_id,
                    product_name: filters.product_name,
                    product_stock: filters.product_stock,
                    product_status: filters.product_status
                })
                data['pagination'] = this.usePaginationModule({
                    total: t.total,
                    // total: 30,
                    current: metas.currentPage,
                    limitPerPage: metas.currentLimit,
                    parentLink
                })
            } else {
                data.pagination = {disabled: true}
            }
            return data
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async detail (filter = {}) {
        try {
            const Products = this.instance.include('models', 'ProductsModel')(this.instance)
            const data = await Products.getDetail(filter)
            return data
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async getTotal (filter = {}) {
        try {
            const Products = this.instance.include('models', 'ProductsModel')(this.instance)
            const data = await Products.getTotal(filter)
            return data
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new ProductsService(injection)
    return instance
}