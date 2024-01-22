import { NextFunction, Request, Response } from 'express';
import { Translation } from './types/bibleData.type';

export function handleJsonError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).send('Invalid JSON');
  }
  next();
}

export function validatePostRequest(req: Request, res: Response, next: NextFunction) {
  const { text, translation } = req.body;
  const validTranslations: Translation[] = ['aa', 'acf', 'nvi'];

  if (!text) {
    return res.status(400).send('Missing text');
  }
  if (!translation) {
    return res.status(400).send('Missing translation');
  }
  if (!validTranslations.includes(translation)) {
    return res.status(400).send('Invalid translation');
  }
  if (typeof text !== 'string') {
    return res.status(400).send('Invalid text');
  }

  next();
}
