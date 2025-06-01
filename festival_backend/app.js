import express from 'express';
import connectDB from './config/database.js';
import studentRoutes from './routes/studentRoutes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import FestivalStudent from './model/model.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();
await FestivalStudent.syncIndexes(); // Ensure indexes are created for the model

// Swagger/OpenAPI setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jesus Festival API',
      version: '1.0.0',
      description: 'API documentation for Jesus Festival registration',
    },
    servers: [
      {
        url: `https://jesus-festival.onrender.com`,
      },
    ],
  },
  apis: ['./routes/*.js'], // Make sure your route files have Swagger JSDoc comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ReDoc
app.get('/redoc', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Jesus Festival API</title>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      </head>
      <body>
        <redoc spec-url="/swagger.json"></redoc>
      </body>
    </html>
  `);
});

// Serve raw Swagger JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// App routes
app.use('/api', studentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("App URL: https://jesus-festival.onrender.com");
  console.log(`Swagger UI: https://jesus-festival.onrender.com/api-docs`);
  console.log(`ReDoc: https://jesus-festival.onrender.com/redoc`);
});
