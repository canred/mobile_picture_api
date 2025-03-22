// Import the 'express' module
import express from 'express';

import routingPhoto from './Router/routing_photo.js';
import routingUser from './Router/routing_user.js';
import routingAlbum from './Router/routing_album.js';
import routingSystem from './Router/routing_system.js';
// Import Swagger modules
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// Import CORS module
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

// Create an Express application
const app = express();



// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Middleware to set the authorization header globally
app.use((req, res, next) => {
  req.headers['authorization'] = req.headers['authorization'] || 'Bearer YOUR_DEFAULT_TOKEN';
  next();
});

// Set the port number for the server
const port = process.env.PORT || 3000;
const server_ip = process.env.SERVER_IP;

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Serve static files from the 'dist/browser' directory
app.use(express.static('dist/browser'));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Mobile Picture API',
      version: '1.0.0',
      description: 'API documentation for the Mobile Picture API',
    },
    servers: [
      {
        url: `http://${server_ip}:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Token: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              description: 'The bearer token',
              example: 'eyJhb1cioiJIVCJ9.eyAixjMdNTY31D1wIioNSiW0jxTyT5TyCjIxOTI3MjJ9.kOkTVr4rPq5wiv2W1bB1UQ',
            },
            token_type: {
              type: 'string',
              example: 'Bearer',
            },
            expires_in: {
              type: 'integer',
              description: 'Token expiration time in seconds',
              example: 3600,
            },
            refresh_token: {
              type: 'string',
              description: 'The refresh token',
              example: 'eyJhba5c1IaIkXV9.ezdfIiOqNSaiaWF0IjoxNTYyMTg5MOjE1NjU5MsdDMsw.lFlaJqxPP4rX-c3sWACvvO',
            },
          },
        },
      },
      responses: {
        InvalidApiRequest: {
          description: 'Invalid Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Missing Authorization Token',
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Expired token. Use the refresh token to get a new one',
                  },
                },
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'You are no longer an active user here',
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/Router/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define a route for the root path ('/')


// Use the routing file for photo-related routes
app.use('/api/photo', routingPhoto);

// Use the routing file for user-related routes
app.use('/api/user', routingUser);

// Use the routing file for user-related routes
app.use('/api/album', routingAlbum);

// Use the routing file for user-related routes
app.use('/api/system', routingSystem);


app.get('/', (req, res) => {
  // Send the Angular project's index.html file
  res.sendFile('index.html', { root: 'dist/browser' });
});

// Catch-all route to handle Angular routing
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist/browser' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://${server_ip}:${port}`);
  console.log(`Swagger docs available at http://${server_ip}:${port}/api-docs`);
  console.log('JSON request parser middleware is enabled');
});
