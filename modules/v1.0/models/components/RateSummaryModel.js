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
        return 'rate_summary'
    }

    get connection () {
        return 'pg'
    }

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            rate_type: {
                type: String,
                stringType: 'bpchar(20)',
                isNullable: false
            }, // product, store or other
            product_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // foreign-key dari product_list
            stars_level: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // (type float8)
            created_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            },
            updated_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            }
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