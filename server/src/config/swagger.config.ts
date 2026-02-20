import { Application } from 'express';

import swaggerJsdoc, { type OAS3Options } from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitBot API',
      version: '1.0.0',
      description: 'A FitBot API documentation',
    },
    tags: [
      {
        name: 'Example',
        description: 'Example endpoints'
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      }
    ],
    security: [
      { bearerAuth: [] }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options)

export function setupSwagger(app: Application) {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'My API Documentation'
  }))
}