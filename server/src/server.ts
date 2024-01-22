import express, { json } from 'express';
import helmet from 'helmet';
import { handleJsonError } from './middlewares';
import router from './routes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(json());
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, methods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.use(handleJsonError);
app.use(router);

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default server;
