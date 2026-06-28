# Rust Loot Organizer Live - v0.8-test

Fælles Rust loot-plan til GitHub Pages med live sync via Firebase Realtime Database.

## Test-before-live workflow

Alle nye ændringer skal laves og testes på en test-branch først. Denne version ligger på:

`test/v0.8-storage-layout-generator`

Merge ikke til `main`, før test-versionen er godkendt. GitHub Pages live-siden deployer stadig fra `main`.

## Hvad er ændret i v0.8-test

v0.8-test tilføjer en Storage layout generator:

- vælg hvilke storage bokse gruppen har
- se total bokse, total slots, anbefalet minimum og manglende/ekstra slots
- generér et realistisk Rust loot-layout ud fra kapacitet
- genererede bokse er normale redigerbare storage boxes
- genererede items bruger `Nuværende`, `Min`, `Max` og `Mangler til min`
- storage settings syncer live via Firebase og følger med eksport/import
- print viser en kompakt storage summary

## Storage layout generator

Gå til sektionen `Storage layout generator` og udfyld antal bokse:

- Stor boks: 48 slots
- Lille boks: 18 slots
- Locker: 36 slots
- Køleskab: 42 slots
- TC: 24 slots
- Drop box: 12 slots
- Vending machine: 30 slots

Du kan også tilføje en custom box type med eget navn, antal og slots.

Tryk `Brug anbefalet setup` for et godt test-setup, eller indtast egne tal. Tryk derefter `Generér layout`.

Hvis der allerede findes bokse i planen, spørger appen før layoutet erstattes.

## Kapacitet

Slot-beregningen er vejledende og baseret på item-linjer, ikke fuld Rust stack-simulation.

Appen bruger ca. 360 slots som anbefalet minimum. Hvis der er få slots, kombineres kategorier. Hvis der er ekstra slots, oprettes overflow/backup bokse.

## Genererede Min/Max værdier

Generatoren bruger samme Min/Max-system som resten af appen. Eksempler:

- Stone: Min 10000, Max 30000
- Wood: Min 5000, Max 20000
- Metal fragments: Min 5000, Max 15000
- Sulfur: Min 2500, Max 10000
- Pistol Bullets: Min 128, Max 512
- Syringe: Min 20, Max 60
- Scrap: Min 500, Max 3000
- CCTV Camera: Min 2, Max 10

`Mangler til min` beregnes altid i appen og gemmes ikke som separat felt.

## Firebase

v0.8-test bruger stadig Firebase Realtime Database uden Firebase Authentication.

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
5. Udfyld Storage layout generator.
6. Tryk `Generér layout`.
7. Tryk `Kopiér link` og send linket til gruppen.

## Fejlretning

Hvis andre ikke kan forbinde:

1. Tjek at test-preview eller GitHub Pages har den rigtige version-label.
2. Bed dem trykke Ctrl+F5 eller åbne linket i inkognito.
3. Tjek at reglerne fra `database.rules.json` er published i Firebase.
4. Tjek at alle bruger præcis samme gruppe-link eller samme gruppe-kode.
