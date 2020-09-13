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

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            image_name: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            }, // akan di tempatkan pada alt di tag <img>
            product_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // foreign-key dari product_list
            image_url: {
                type: String,
                stringType: 'text',
                isNullable: false
            }, // dipisahkan koma. dibatasi max 4 image
            image_index: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // mulai dari 0: defautl 1 gambar ke2 dst
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
    const model = new ProductImagesModel(instance)
    return model
}