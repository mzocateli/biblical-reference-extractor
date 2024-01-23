import { NextFunction, Request, Response } from 'express';
import { Translation } from './types/bibleData.type';

export function handleJsonError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body !== 'object') {
    res.status(400).send('Invalid JSON');
  } else {
    next();
  }
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

export function logReqs(req: Request, res: Response, next: NextFunction) {
  console.log(`Method: ${req.method} | URL: ${req.url} | Source ${req.protocol}://${req.hostname}${req.path} from ${req.ip}`);
  next();
}
