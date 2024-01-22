import { Router } from 'express';
import { api } from './api';
import { validatePostRequest } from './middlewares';

const router = Router();

router.post('/', validatePostRequest, (req, res) => {
  const { text, translation } = req.body;
  api(text, translation)
    .then(result => res.send(result))
    .catch(err => res.status(500).send(err.message));
});

router.options('*', (req, res) => {
  res.header('Allow', 'POST, OPTIONS');
  res.status(200).send();
});

router.all('*', (req, res) => {
  res.status(405).send('Method not allowed');
});

export default router;
