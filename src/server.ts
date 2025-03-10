// Import the 'express' module
import express from 'express';
import routingPhoto from './Router/routing_photo';
// Import Swagger modules
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// Import CORS module
import cors from 'cors';

// Create an Express application
const app = express();

// Enable CORS
app.use(cors());

// Set the port number for the server
const port = 3000;

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
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/Router/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send the Angular project's index.html file
  res.sendFile('index.html', { root: 'dist/browser' });
});

// Use the routing file for photo-related routes
app.use('/api/photo', routingPhoto);

// Catch-all route to handle Angular routing
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist/browser' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
