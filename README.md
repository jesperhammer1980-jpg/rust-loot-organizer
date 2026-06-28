# Rust Loot Organizer Live - v0.9-test

Fælles Rust loot-plan til GitHub Pages med live sync via Firebase Realtime Database.

## Test-before-live workflow

Alle nye ændringer skal laves og testes på en test-branch først. Denne version ligger på:

`test/v0.9-manual-box-management`

Merge ikke til `main`, før test-versionen er godkendt. GitHub Pages live-siden deployer stadig fra `main`.

## Hvad er ændret i v0.9-test

v0.9-test gør manuel boksstyring til den primære arbejdsgang:

- opret flere bokse manuelt ud fra box type, antal og slots
- placer items manuelt i den boks, hvor gruppen vil have dem
- vælg item fra datalist/dropdown i stedet for at skrive hele linjer
- auto-fill kategori, Min og Max for kendte Rust items
- rediger current amount, Min, Max, kategori og egen note direkte på itemet
- flyt items mellem bokse med `Flyt til anden boks`
- se box type, slots og cirka brugte item-linjer på hver boks
- automatisk layout generator fra v0.8 er stadig med som valgfri helper

## Manuel boksopsætning

Brug sektionen `Manuel boksopsætning` først, hvis I vil styre layoutet selv.

1. Vælg `Box type`.
2. Vælg `Antal bokse`.
3. Skriv et `Box navn` eller prefix, fx `Loot`.
4. Tryk `Opret bokse`.

Eksempel:

- Box type: `Stor boks`
- Antal bokse: `6`
- Box navn: `Loot`

Det opretter `Loot 1` til `Loot 6`.

Standard box typer:

- Stor boks / Large Box / 48 slots
- Lille boks / Small Box / 18 slots
- Locker / 36 slots
- Køleskab / Fridge / 42 slots
- TC / Tool Cupboard / 24 slots
- Drop box / 12 slots
- Vending machine / 30 slots
- Custom med eget navn og slots

## Manuel item placering

Hver boks har en `Tilføj item`-formular:

- `Vælg item`
- `Vælg kategori`
- `Nuværende`
- `Min`
- `Max`
- `Egen note`
- `Tilføj`

Når et kendt item vælges, udfylder appen kategori og foreslåede Min/Max værdier. Alt kan stadig overskrives manuelt.

Eksempel:

`Pistol Bullets` auto-fylder `Ammo`, `Min 128` og `Max 512`.

## Flyt items

Hvert item har:

- `Flyt til anden boks`
- dropdown med box navne
- knappen `Flyt`
- knappen `Fjern`

Flytning, fjernelse og redigering syncer live via Firebase.

## Automatisk generator

Sektionen `Storage layout generator` er stadig tilgængelig som valgfri helper.

Brug den hvis I vil starte hurtigt med et automatisk Rust loot-layout. Genererede bokse er normale bokse bagefter og kan redigeres, flyttes rundt og fyldes manuelt.

## Kapacitet

Hver boks viser cirka kapacitet:

`Stor boks — 8/48 linjer`

Hvis item-linjer overstiger slots, vises `Over kapacitet`.

Slot-beregningen er vejledende og baseret på item-linjer, ikke fuld Rust stack-simulation.

## To-do og guide

To-do listen viser items hvor `Nuværende < Min`.

Den viser:

- manglende antal
- box navn
- guide med `Findes lettest`, alternativer, tip og risiko
- `Hop til box`

Manuelt tilføjede items bruger samme To-do, guide og Min/Max logik som genererede items.

## Firebase

v0.9-test bruger stadig Firebase Realtime Database uden Firebase Authentication.

Når en gruppe-link åbnes:

1. Appen læser remote Firebase-data først.
2. Hvis gruppen findes, bruges remote planen.
3. Hvis gruppen ikke findes, oprettes en tom starter-plan.

Det beskytter eksisterende grupper mod at blive overskrevet af lokal browserdata.

## Eksport, import og print

Eksport/import bevarer:

- manuelle bokse
- box type og slots
- item navne
- kategori
- current amount
- Min/Max
- egen note
- storage layout settings

Print viser box navn, box type, slots, items, current/min/max, missing to min, status og kompakt guide-linje.

## Filer

- `index.html`
- `style.css`
- `app.js`
- `firebase-config.js`
- `firebase-config.example.js`
- `database.rules.json`
- `README.md`

## Brug

1. Åbn test-preview.
2. Skriv dit navn.
3. Generér eller indtast en gruppe-kode.
4. Tryk `Start live`.
5. Brug `Manuel boksopsætning` til at oprette bokse.
6. Tilføj items manuelt i de relevante bokse.
7. Brug automatisk generator kun hvis I vil have et hurtigt forslag.
8. Tryk `Kopiér link` og send linket til gruppen.

## Fejlretning

Hvis andre ikke kan forbinde:

1. Tjek at test-preview har version-label `v0.9-test`.
2. Bed dem trykke Ctrl+F5 eller åbne linket i inkognito.
3. Tjek at reglerne fra `database.rules.json` er published i Firebase.
4. Tjek at alle bruger præcis samme gruppe-link eller samme gruppe-kode.
