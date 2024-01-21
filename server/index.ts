// const fs = require('fs')
import express, { json, NextFunction, Request, Response } from 'express';
import { buildReferencesAndText, sortBibleReferences, findBibleReferences } from './src/bibleReferences';
import { Translation } from './src/types/bibleData.type';
import helmet from 'helmet';

// async function main() {
//   fs.writeFileSync('text.html',
//     formatBibleReferences(
//       await buildReferencesAndText(
//         await sortBibleReferences(
//           await findBibleReferences(texto)
//         )
//       )
//     ), { encoding: 'utf-8' })
// }

// main()

async function api(text: string, translation: Translation) {
  const bibleReferences = await findBibleReferences(text);
  if (!bibleReferences) {
    return '';
  }
  return await buildReferencesAndText(
    await sortBibleReferences(bibleReferences), translation
  );
}

function handleJsonError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).send('Invalid JSON');
  }
  next();
}

const app = express();
const port = 3000;

app.use(json());
app.use(handleJsonError);
app.use(helmet());

app.post('/', async (req, res) => {
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

  res.send(await api(text, translation));
});

app.options('*', (req, res) => {
  res.header('Allow', 'POST, OPTIONS');
  res.status(200).send();
});

app.all('*', (req, res) => {
  res.status(405).send('Method not allowed');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
