import express from 'express';
import errorHandler from '@/shared/utils/error-handling/errorHandler'
import iamRouter from '@/modules/iam/api/router'
import docsRouter from '@/docs/router'

const app = express();

app.use(express.json());

app.get('/health', async (req, res) => {
  res.json({ status: 'ok' });
});

// Docs and OpenAPI
app.use('/api', docsRouter)

// IAM API
app.use('/api/iam', iamRouter)

// Global error handler (keep as last middleware)
app.use(errorHandler)

export default app;
