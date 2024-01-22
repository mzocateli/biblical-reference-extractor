import { buildReferencesAndText, sortBibleReferences, findBibleReferences } from './services/bibleReferences';
import { Translation } from './types/bibleData.type';

export async function api(text: string, translation: Translation) {
  const bibleReferences = findBibleReferences(text);

  return await buildReferencesAndText(
    sortBibleReferences(bibleReferences), translation
  );
}
