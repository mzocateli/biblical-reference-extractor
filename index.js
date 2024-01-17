const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const bibleData = {
  'aa': require('./bible/aa.json'),
  'acf': require('./bible/acf.json'),
  'nvi': require('./bible/nvi.json'),
};

const TRANSLATION = 'nvi';

const texto = `
O Evangelho
O Evangelho são as boas novas anunciadas na bíblia sagrada de que Cristo, enviado pelo grande amor e misericórdia do criador (Mt 10.40, Lc 4.18, Jo 3.17), morreu pelos nossos pecados, nos livrando da justa condenação eterna da qual éramos (e somos) merecedores (Ef 2.3-5), redimindo a humanidade que havia se afastado de Deus desde a queda de Adão (Jo 1.29, Ef 2.1), sendo perfeito e puro mas tomando para si toda a ira divina (Is 53.10, 2Co 5.21), foi sepultado e ressuscitou vitorioso para se assentar à destra de Deus (Rm 1.16-17, 1Co 15.3-4, Hb 12.2, 1Pe 3.21-22), sem deixar qualquer dívida não paga (Jo 19.30), para o qual diremos eternamente “Digno é o cordeiro que foi morto de receber o poder, a riqueza, a sabedoria, a força, a honra, a glória e o louvor” (Ap 5.12), Amém!
Assim, reconhecer o evangelho também é reconhecer que precisamos nos arrepender e que não poderíamos e nem podemos conquistar a salvação nem o favor de Deus por nossos méritos próprios, sendo necessário que Jesus, o próprio Deus encarnado, morresse por nós para que isso fosse possível.
`

function findBibleReferences(text) {
  const bibleReferencePattern = /\b([1-3]?\s?[A-Za-z]+)\s(\d{1,3})\.(\d{1,3}(?:-\d{1,3})?)\b/g;
  return text.match(bibleReferencePattern);
}

function sortBibleReferences(references) {
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

function getVerse(bookAbbrev, chapter, verse) {
  const book = bibleData[TRANSLATION].find(b => b.abbrev === bookAbbrev);
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

async function searchBiblicalText(reference) {
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

  const texto = multipleVerses ? verses.map((individualVerse) => getVerse(book.toLocaleLowerCase(), chapter, individualVerse)).join(' ') : getVerse(book.toLocaleLowerCase(), chapter, verse);
  return texto
}

async function buildReferencesAndText(references) {
  let referencesAndText = {}
  for (const ref of references) {
    referencesAndText[ref] = await searchBiblicalText(ref)
  }
  return referencesAndText
}

function formatBibleReferences(referencesAndText) {
  let text = ``
  for (const ref in referencesAndText) {
    text += `<p><b>${ref}:</b> ${referencesAndText[ref]}</p>\n`
  }
  return text
}

async function main() {
  fs.writeFileSync('text.html',
    formatBibleReferences(
      await buildReferencesAndText(
        await sortBibleReferences(
          await findBibleReferences(texto)
        )
      )
    ), { encoding: 'utf-8' })
}

main()
