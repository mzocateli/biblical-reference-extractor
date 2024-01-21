export type Translation = 'aa' | 'acf' | 'nvi';
export type TranslationContent = {
  abbrev: string;
  chapters: Array<string[]>;
  name: string;
};
export type BibleData = Record<Translation, TranslationContent[]>;
