const prefix = '/v1/product/categories'
const routes = [
    {
        method: 'GET',
        url: '/',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            tags: ['Products'],
            summary: 'All Categories',
            description: 'category list',
            security: [
                {
                  "apiKey": []
                }
            ],
            querystring: [
                'category_id',
                'category_name'
            ],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        category_id: { type: 'number' },
                        category_name: { type: 'string' },
                        category_status: { type: 'string' },
                        created_at: { type: 'string' },
                        updated_at: { type: 'string' },
                    }
                }
            }
        },
        preHandler: [
        ],
        handler: 'CategoriesController.main'
    }
]

module.exports = {routes, prefix}
