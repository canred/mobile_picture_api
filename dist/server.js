"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the 'express' module
const express_1 = __importDefault(require("express"));
const routing_photo_1 = __importDefault(require("./Router/routing_photo"));
// Import Swagger modules
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Import CORS module
const cors_1 = __importDefault(require("cors"));
// Create an Express application
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)());
// Set the port number for the server
const port = 3000;
// Serve static files from the 'uploads' directory
app.use('/uploads', express_1.default.static('uploads'));
// Serve static files from the 'dist/browser' directory
app.use(express_1.default.static('dist/browser'));
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Define a route for the root path ('/')
app.get('/', (req, res) => {
    // Send the Angular project's index.html file
    res.sendFile('index.html', { root: 'dist/browser' });
});
// Use the routing file for photo-related routes
app.use('/api/photo', routing_photo_1.default);
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
