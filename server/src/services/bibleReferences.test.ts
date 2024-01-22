import { buildReferencesAndText, findBibleReferences, getVerse, searchBiblicalText, sortBibleReferences } from './bibleReferences';

describe('BibleReferences Tests', () => {
  describe('findBibleReferences', () => {
    it('should return an array of bible references from the text', () => {
      const text = 'text Gn 1.1, aaa Ex 2.3, .Ne 4.1/';
      const result = findBibleReferences(text);
      expect(result).toStrictEqual(['Gn 1.1', 'Ex 2.3', 'Ne 4.1']);
    });

    it('should return an empty array if no references are found', () => {
      const text = 'text';
      const result = findBibleReferences(text);
      expect(result).toStrictEqual([]);
    });
  });

  describe('sortBibleReferences', () => {
    it('should sort bible references in biblical order', () => {
      const references = ['Gn 2.2', 'Ap 20.1', 'Gn 2.1', 'Mt 1.1', 'Gn 1.1', 'Ex 1.1'];
      const result = sortBibleReferences(references);
      expect(result).toStrictEqual(['Gn 1.1', 'Gn 2.1', 'Gn 2.2', 'Ex 1.1', 'Mt 1.1', 'Ap 20.1']);
    });
  });

  describe('getVerse', () => {
    it('should return the verse from the default bible', () => {
      const result = getVerse('gn', 1, 1);
      expect(result).toBe('No princípio Deus criou os céus e a terra.');
    });

    it('should return the verse from the acf bible', () => {
      const result = getVerse('gn', 1, 1, 'acf');
      expect(result).toBe('No princípio criou Deus o céu e a terra.');
    });

    it('should return an error message if the book is not found', () => {
      const result = getVerse('gnn', 1, 1);
      expect(result).toBe('Book not found');
    });

    it('should return an error message if the chapter is not found', () => {
      const result = getVerse('gn', 100, 1);
      expect(result).toBe('Chapter not found');
    });

    it('should return an error message if the verse is not found', () => {
      const result = getVerse('gn', 1, 100);
      expect(result).toBe('Verse not found');
    });
  });

  describe('searchBiblicalText', () => {
    it('should return the text from the selected reference and translation', async () => {
      const result = await searchBiblicalText('Gn 1.1', 'acf');
      expect(result).toBe('No princípio criou Deus o céu e a terra.');
    });

    it('should return the text from the selected reference and translation with multiple verses', async () => {
      const result = await searchBiblicalText('Gn 1.1-2', 'acf');
      expect(result).toBe('No princípio criou Deus o céu e a terra. E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.');
    });
  });

  describe('buildReferencesAndText', () => {
    it('should return an object on the format reference: text', async () => {
      const result = await buildReferencesAndText(['Gn 1.1'], 'acf');
      expect(result).toStrictEqual({ 'Gn 1.1': 'No princípio criou Deus o céu e a terra.' });
    });
  });
});
