# Rust Loot Organizer Live - v0.7-test

Fælles Rust loot-plan til GitHub Pages med live sync via Firebase Realtime Database.

## Test-before-live workflow

Alle nye ændringer skal laves og testes på en test-branch først. Denne version ligger på:

`test/v0.7-minmax-guide-todo-links`

Merge ikke til `main`, før test-versionen er godkendt. GitHub Pages live-siden deployer stadig fra `main`.

## Hvad er ændret i v0.7-test

v0.7-test udvider mængdestyringen med Min/Max, guide og direkte navigation:

- `Nuværende`, `Min`, `Max` og beregnet `Mangler til min`
- status: `Under min`, `OK` eller `Over max`
- hurtige knapper til `-1`, `+1` og `+ stack`
- To-do listen viser kun items under `Min`
- To-do items har `Hop til box`, som scroller til boksen og markerer den
- To-do items har `Vis guide` / `Skjul guide`
- guide viser `Findes lettest`, `Alternativer`, `Tip` og `Risiko`
- `Egen note` pr. item syncer live og er med i eksport/import/print
- gamle v0.6 items med `limit` migreres sikkert til `minAmount`

## Min/Max

I en boks kan items skrives som:

`Item navn | Kategori | Nuværende 5 | Min 20 | Max 100`

Eksempel:

`Pistol Bullets | Ammo | Nuværende 5 | Min 20 | Max 100`

`Mangler til min` beregnes altid i appen som `max(minAmount - currentAmount, 0)` og gemmes ikke som separat felt.

Hvis `Max` er `0` eller tom, bliver itemet ikke markeret som `Over max`.

## Missing item guide

Guiden ligger som en statisk lookup-table i `app.js` (`itemGuides`). Tilføj flere entries ved at bruge item-navnet som nøgle:

```js
"item name": {
  category: "Farm",
  bestSource: "Findes lettest ...",
  alternativeSources: "Alternativer ...",
  tip: "Tip ...",
  riskLevel: "Lav"
}
```

Ukendte items viser `Ingen guide endnu` og en note om at tilføje itemet til guide-listen i `app.js`.

## Firebase

v0.7-test bruger stadig Firebase Realtime Database uden Firebase Authentication.

Når en gruppe-link åbnes:

1. Appen læser remote Firebase-data først.
2. Hvis gruppen findes, bruges remote planen.
3. Hvis gruppen ikke findes, oprettes en tom starter-plan.

Det beskytter eksisterende grupper mod at blive overskrevet af lokal browserdata.

## Filer

- `index.html`
- `style.css`
- `app.js`
- `firebase-config.js`
- `firebase-config.example.js`
- `database.rules.json`
- `README.md`

## Brug

1. Åbn test-preview eller GitHub Pages-siden.
2. Skriv dit navn.
3. Generér eller indtast en gruppe-kode.
4. Tryk `Start live`.
5. Tilføj bokse og items.
6. Tryk `Kopiér link` og send linket til gruppen.

## Fejlretning

Hvis andre ikke kan forbinde:

1. Tjek at test-preview eller GitHub Pages har den rigtige version-label.
2. Bed dem trykke Ctrl+F5 eller åbne linket i inkognito.
3. Tjek at reglerne fra `database.rules.json` er published i Firebase.
4. Tjek at alle bruger præcis samme gruppe-link eller samme gruppe-kode.
