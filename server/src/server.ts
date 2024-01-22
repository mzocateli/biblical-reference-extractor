import express, { json } from 'express';
import helmet from 'helmet';
import { handleJsonError } from './middlewares';
import router from './routes';

const app = express();
const port = 3000;

app.use(json());
app.use(handleJsonError);
app.use(helmet());
app.use(router);

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default server;
