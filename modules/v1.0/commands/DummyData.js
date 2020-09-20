'use strict'

class DummyData {
    constructor (instance) {
        this.instance = instance
    }

    async handle ({tables, limit, customerId, prefix}) {
        try {
            this.client = await this.instance.pool.connect()
            limit = parseInt(limit || 10)
            tables = (tables || '').split(',').map(x => x.trim()).filter(x => x.length > 1) 
            if (tables.indexOf('customers') > -1) await this.createCustomers()
            if (tables.indexOf('products') > -1) {
                for (let i = 1; i <= limit; i++) {
                    try {
                        const prod = await this.createProducts({ urutan: i, prefix })
                        await this.createProductImages({ productId: prod.id })
                        if (i % 2 === 0 && customerId) await this.createProductFavorite({ productId: prod.id, customerId })
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        } catch (err) {
            throw err
        }
    }

    async createCustomers () {
        try {
            const sql = `INSERT INTO customer_list
                (customer_title,
                customer_fullname,
                is_verified,
                verification_photo,
                identity_no,
                birth_date,
                birth_place,
                main_address_id,
                secondary_address_id,
                is_indonesia,
                created_at,
                updated_at)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
            for (let i = 1; i < 10; i++) {
                await this.client.query(sql, [
                    'mr',
                    `customer ${i}`,
                    true,
                    `http://domain/images/profile/verifications/profile_${i}.jpg`,
                    `100120${i}8000112222${i}`,
                    `1994-01-${i}`,
                    `place ${i}`,
                    1,
                    2,
                    true,
                    new Date(),
                    new Date()
                ])
                console.log('Creating customer', i)
            }
        } catch (err) {
            throw err
        }
    }

    async createProducts ({ urutan, prefix }) {
        try {
            const sql = `INSERT INTO product_list
            (
                category_id,
                product_name,
                product_description,
                product_price,
                product_status,
                product_discount,
                product_stock,
                created_at,
                updated_at)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id`
            const productName = `product ${prefix}_${urutan}`
            const description = `description for ${productName}`
            const productPrice = 1000 * urutan + (urutan * 20)
            const values = [
                2,
                productName,
                description,
                productPrice,
                1,
                0,
                1,
                new Date(),
                new Date()
            ]
            const query = this.client.query(sql, values)
            const x = await query
            console.log(`creating ${productName}`)
            return x['rows'][0]
        } catch (err) {
            throw err
        }
    }

    async createProductImages ({ productId }) {
        try {
            const sql = `INSERT INTO product_images
                (image_name, product_id, image_url, image_index, created_at, updated_at)
            VALUES
                ($1, $2, $3, $4, $5, $6)`
            for (let i = 1; i <= 5; i++) {
                try {
                    const imageName = `image_${productId}_${i}`
                    const values = [
                        imageName,
                        productId,
                        `http://localhost/images/image_${imageName}.jpg`,
                        i,
                        new Date(),
                        new Date()
                    ]
                    await this.client.query(sql, values)
                    console.log(`creating product images for product (${productId})`)
                } catch (err) {
                    console.log(err)
                }
            }
        } catch (err) {
            throw err
        }
    }

    async createProductFavorite ({ productId, customerId }) {
        try {
            const sql = `INSERT INTO product_favorites 
                (product_id, customer_id, created_at, updated_at)
            VALUES
                ($1, $2, $3, $4)`
            await this.client.query(sql, [
                productId,
                customerId,
                new Date(),
                new Date()
            ])
            console.log(`setting product favorites for customer_id ${customerId}`)
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (instance) {
    return new DummyData(instance)
}
