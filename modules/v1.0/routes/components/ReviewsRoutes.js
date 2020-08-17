const prefix = '/reviews'
const routes = [
    {
        method: 'GET',
        url: '/product',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'client',
            tags: ['Reviews'],
            summary: 'Product Reviews',
            description: 'Reviews Information For Specific Product',
            security: [
                {
                  "apiKey": []
                }
            ],
            required: ['product_id', 'ukm_id', 'customer_id'],
            querystring: [
                "product_id",
                "ukm_id",
                "customer_id",
                "limit",
                "page",
                "pagination",
            ],
            headers: {
                // 'accept-version': {type: 'string', default: '1.0.0'}
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number', example: '200' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                metadata: {
                                    type: 'object',
                                    properties: {
                                        product_id: { type: 'number', example: 2 }
                                    }
                                },
                                dataitems: {
                                    type: "object",
                                    properties: {
                                        review_id: { type: 'number', example: 1 },
                                        from: {
                                            type: 'object',
                                            properties: {
                                                customer_id: {type: 'number', example: 100},
                                                customer_name: {type: 'string', example: 'sukirman wibowo'},
                                                profile_link: {type: 'string', example: '/profile/sukirmanwibowo22'},
                                                profile_image: {type: 'string', example: '/images/profiles/726jd-273jj-12jhkk-ad5s6h/30x30.jpg'}
                                            },
                                            example: 'product 1'
                                        },
                                        review_content: { type: 'string', example: 'produk bagus, dan pengiriman rapi. terima kasih cuy... puas' },
                                        review_images: {
                                            type: 'array',
                                            example: [{
                                                index: 1,
                                                image: '/static/images/product1.jpg',
                                                title: 'this is image 1'
                                            }]
                                        },
                                        review_stars: { type: 'object', example: { value: 4.5, label: 'Good Product' }},
                                        publish_date: { type: 'string', example: '2020/01/01 20:02:02' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        preHandler: [
            // 'Authentication'
        ],
        handler: 'ReviewsController.getReviewByProduct'
    }
]

module.exports = {routes, prefix}
