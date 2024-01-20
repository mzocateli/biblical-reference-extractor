import bibleData from './bibleData.cjs';
// const axios = require('axios');
// const cheerio = require('cheerio');

export function findBibleReferences(text) {
  const bibleReferencePattern = /\b([1-3]?\s?[A-Za-z]+)\s(\d{1,3})\.(\d{1,3}(?:-\d{1,3})?)\b/g;
  return text.match(bibleReferencePattern);
}

export function sortBibleReferences(references) {
  console.log(references.length)
  const biblicalOrder = ['Gn', 'Ex', 'Lv', 'Nm', 'Dt', 'Js', 'Jz', 'Rt', '1Sm', '2Sm', '1Rs', '2Rs', '1Cr', '2Cr', 'Ed', 'Ne', 'Et', 'Jó', 'Sl', 'Pv', 'Ec', 'Ct', 'Is', 'Jr', 'Lm', 'Ez', 'Dn', 'Os', 'Jl', 'Am', 'Ob', 'Jn', 'Mq', 'Na', 'Hc', 'Sf', 'Ag', 'Zc', 'Ml', 'Mt', 'Mc', 'Lc', 'Jo', 'At', 'Rm', '1Co', '2Co', 'Gl', 'Ef', 'Fp', 'Cl', '1Ts', '2Ts', '1Tm', '2Tm', 'Tt', 'Fm', 'Hb', 'Tg', '1Pe', '2Pe', '1Jo', '2Jo', '3Jo', 'Jd', 'Ap'];

  return references.sort((a, b) => {
    const [bookA, capVersA] = a.split(' ');
    const [bookB, capVersB] = b.split(' ');

    if (bookA !== bookB) {
      return biblicalOrder.indexOf(bookA) - biblicalOrder.indexOf(bookB);
    }

    const [capA, versA] = capVersA.split('.');
    const [capB, versB] = capVersB.split('.');

    if (capA !== capB) {
      return Number(capA.replace()) - Number(capB);
    }

    return Number(versA.replace(/-.*/, '')) - Number(versB.replace(/-.*/, ''));
  }).filter((item, i) => references.indexOf(item) === i);
}

function getVerse(bookAbbrev, chapter, verse, translation = 'nvi') {
  const book = bibleData[translation].find(b => b.abbrev === bookAbbrev);
  if (!book) {
    return 'Book not found';
  }

  if (book.chapters.length < chapter) {
    return 'Chapter not found';
  }

  if (book.chapters[chapter - 1].length < verse) {
    return 'Verse not found';
  }

  return book.chapters[chapter - 1][verse - 1];
}

export async function searchBiblicalText(reference, translation) {
  const [book, chapterVerse] = reference.split(' ');
  const [chapter, verse] = chapterVerse.split('.');
  const multipleVerses = verse.match('-')
  let verses = []
  if (multipleVerses) {
    let [f, l] = verse.split('-')
    f = Number(f)
    l = Number(l)
    verses = Array.from({ length: (l + 1) - f }, (v, k) => f + k)
  }
  // const res = await axios.get(`https://www.bibliaonline.com.br/rc69/${book.toLowerCase()}/${chapter}`);
  // const $ = cheerio.load(res.data);
  // const texto = multipleVerses ? verses.map((individualVerse) => $(`p > [data-v=".${individualVerse}."].t`).text()).join('') : $(`p > [data-v=".${verse}."].t`).text();

  const texto = multipleVerses ? verses.map((individualVerse) => getVerse(book.toLocaleLowerCase(), chapter, individualVerse, translation)).join(' ') : getVerse(book.toLocaleLowerCase(), chapter, verse, translation);
  return texto
}

export async function buildReferencesAndText(references, translation) {
  let referencesAndText = {}
  for (const ref of references) {
    referencesAndText[ref] = await searchBiblicalText(ref, translation)
  }
  return referencesAndText
}
