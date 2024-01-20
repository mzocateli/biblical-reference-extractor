// const fs = require('fs')
import express, { json } from 'express';
import { buildReferencesAndText, sortBibleReferences, findBibleReferences } from './src/bibleReferences.js';

const texto = `
O Evangelho
O Evangelho são as boas novas anunciadas na bíblia sagrada de que Cristo, enviado pelo grande amor e misericórdia do criador (Mt 10.40, Lc 4.18, Jo 3.17), morreu pelos nossos pecados, nos livrando da justa condenação eterna da qual éramos (e somos) merecedores (Ef 2.3-5), redimindo a humanidade que havia se afastado de Deus desde a queda de Adão (Jo 1.29, Ef 2.1), sendo perfeito e puro mas tomando para si toda a ira divina (Is 53.10, 2Co 5.21), foi sepultado e ressuscitou vitorioso para se assentar à destra de Deus (Rm 1.16-17, 1Co 15.3-4, Hb 12.2, 1Pe 3.21-22), sem deixar qualquer dívida não paga (Jo 19.30), para o qual diremos eternamente “Digno é o cordeiro que foi morto de receber o poder, a riqueza, a sabedoria, a força, a honra, a glória e o louvor” (Ap 5.12), Amém!
Assim, reconhecer o evangelho também é reconhecer que precisamos nos arrepender e que não poderíamos e nem podemos conquistar a salvação nem o favor de Deus por nossos méritos próprios, sendo necessário que Jesus, o próprio Deus encarnado, morresse por nós para que isso fosse possível.
`

function formatBibleReferences(referencesAndText) {
  let text = ``
  for (const ref in referencesAndText) {
    text += `<p><b>${ref}:</b> ${referencesAndText[ref]}</p>\n`
  }
  return text
}

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

async function api(text, translation) {
  return formatBibleReferences(
    await buildReferencesAndText(
      await sortBibleReferences(
        await findBibleReferences(text)
      ), translation
    )
  )
}

const app = express()
const port = 3000

app.use(json())

app.post('/', async (req, res) => {
  const { text, translation } = req.body
  res.send(`<html><body>${await api(text, translation)}</body></html>`)
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
