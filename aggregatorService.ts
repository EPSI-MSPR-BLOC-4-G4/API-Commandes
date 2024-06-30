import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import fetch from 'node-fetch';

const app = express();

const swaggerDocument: any = {
  openapi: '3.0.0',
  info: {
    title: 'Aggregated API',
    version: '1.0.0',
  },
  paths: {},
  components: {
    schemas: {},
  },
};

const aggregateSwaggerDocs = async () => {
  const services = [
    //'http://localhost:7000/api-docs-json',
    'http://localhost:8000/api-docs-json', 
  ];

  for (const service of services) {
    const response = await fetch(service);
    const doc = await response.json();

    Object.assign(swaggerDocument.paths, doc.paths);
    Object.assign(swaggerDocument.components.schemas, doc.components.schemas);
  }
};

// Ajoutez une route pour servir le document Swagger agrégé en JSON
app.get('/api-docs-json', async (req: Request, res: Response) => {
  await aggregateSwaggerDocs();
  res.json(swaggerDocument);
});

// Servez l'interface utilisateur Swagger en utilisant le document agrégé
app.use('/api-docs', swaggerUi.serve, async (req: Request, res: Response) => {
  await aggregateSwaggerDocs();
  (req as any).swaggerDoc = swaggerDocument;
  res.json(swaggerDocument);
}, swaggerUi.setup());

app.listen(3000, () => {
  console.log('AggregatorService is running on port 3000');
});
