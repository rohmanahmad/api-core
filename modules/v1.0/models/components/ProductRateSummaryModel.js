'use strict'

const Models = require('../index')

/*
    tabel ini tidak diubah secara langsung oleh pemilik maupun admin.
    ini otomatis diubah berdasarkan data dari review dan dihitung menggunakan formula
*/
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

    get schema () {
        return {
            id: Number,
            product_id: Number, // foreign-key dari product_list
            stars_level: Number, // (type float8)
            created_at: Date,
            updated_at: Date
        }
    }

    get index () {
        return {
            primary: {
                keys: {id: -1},
                uniq: true
            },
            product: {
                keys: {product_id: 1},
                uniq: false
            },
            date: { // untuk sorting kebanyakan DESC
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* functions */
}

module.exports = function (instance = {}) {
    const model = new ProductRateSummary(instance)
    return model
}