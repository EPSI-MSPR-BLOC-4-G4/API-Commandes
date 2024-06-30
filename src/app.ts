import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import orderRouter from "./routes/order.routes";
import { setupSwagger } from '../swagger';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotevnv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservice 2 API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Chemin vers vos fichiers de routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Expose the Swagger JSON
app.get('/api-docs-json', (req, res) => {
  res.json(swaggerSpec);
});

// Setup Swagger
setupSwagger(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/", orderRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;

