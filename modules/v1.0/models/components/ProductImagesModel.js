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

    get schema () {
        return {
            id: Number,
            image_name: String, // akan di tempatkan pada alt di tag <img>
            product_id: Number, // foreign-key dari product_list
            image_url: String, // dipisahkan koma. dibatasi max 4 image
            image_index: Number, // mulai dari 0: defautl 1 gambar ke2 dst
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
    const model = new ProductImagesModel(instance)
    return model
}