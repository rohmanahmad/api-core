const acceptedVersion = 'v1'
const basePath = `/api/${acceptedVersion}/client`

module.exports = {
    zone: 'client',
    mode: 'dynamic',
    routePrefix: `${basePath}/documentation`,
    swagger: {
      info: {
        title: 'Client API',
        description: 'API Documentation for Client',
        version: '0.1.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: 'localhost:4000',
      basePath: basePath,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Home', description: 'All About Home Routes' },
        { name: 'Authentication', description: 'All About Authentication Routes' },
        { name: 'Users', description: 'All About User Routes' },
        { name: 'Partners', description: 'All About Partners Routes' },
        { name: 'Customers', description: 'All About Customers Routes' },
        { name: 'Products', description: 'All About Products Routes' },
        { name: 'Reviews', description: 'All About Reviews Routes' },
        { name: 'Transactions', description: 'All About Transaction Routes' },
        { name: 'Shipping', description: 'All About Shipping Routes' },
        { name: 'Configurations', description: 'All About Configuration Routes' },
        { name: 'Conversations', description: 'All About Conversation Routes' }
      ],
      definitions: {},
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      }
    },
    exposeRoute: true
  }