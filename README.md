# Rust Loot Organizer Live - v6

Fælles Rust loot-plan til GitHub Pages med live sync via Firebase Realtime Database.

## Hvad er ændret i v6

v6 tilføjer mængdestyring på hvert item i hver storage box:

- `Nuværende`, `Limit` og beregnet `Mangler`
- hurtige knapper til `-1`, `+1` og `+ stack`
- `Mangler / To-do` viser antal, fx `Pistol Bullets: mangler 64`
- topstatistikken `Mangler` tæller item-typer under deres limit
- eksport/import og print indeholder mængder
- gamle items uden mængder migreres sikkert med `Nuværende 0` og `Limit 0`

Når en gruppe-link åbnes, læser appen Firebase først. Hvis gruppen findes, bruges remote planen. Hvis gruppen ikke findes, oprettes en tom starter-plan, så lokal browserdata ikke overskriver en eksisterende gruppe.

## Hvad er ændret i v5

v5 bruger **ikke Firebase Authentication**. Det gør den lettere for hele gruppen at bruge, fordi andre brugere ikke kan blive blokeret af Anonymous Auth, authorized domains eller login-indstillinger.

Sikkerheden er simpel: alle med jeres gruppe-link/kode kan se og ændre planen. Brug derfor en lang gruppe-kode og del kun linket med gruppen.

## Filer

- `index.html`
- `style.css`
- `app.js`
- `firebase-config.js`
- `firebase-config.example.js`
- `database.rules.json`
- `README.md`

## GitHub Pages

Upload/erstat alle filer i dit GitHub repository. Commit changes.

Hvis GitHub Pages allerede er aktiveret, deployer den selv den nye version efter 1-3 minutter.

## Firebase Realtime Database Rules

Upload til GitHub ændrer ikke Firebase-reglerne automatisk. Du skal selv kopiere reglerne fra `database.rules.json` ind her:

Firebase Console → Realtime Database → Rules → indsæt regler → Publish

## Firebase config

`firebase-config.js` er udfyldt til projektet:

- projectId: `rust-loot-organizer`
- databaseURL: `https://rust-loot-organizer-default-rtdb.europe-west1.firebasedatabase.app`

Firebase web config er ikke et password. Realtime Database Rules styrer adgangen.

## Brug

1. Åbn GitHub Pages-siden.
2. Skriv dit navn.
3. Generér eller indtast en gruppe-kode.
4. Tryk `Start live`.
5. Tryk `Kopiér link` og send linket til gruppen.
6. Andre brugere åbner linket og trykker `Start live`, hvis den ikke forbinder automatisk.

## Mængder

I en boks kan items skrives som:

`Item navn | Kategori | Nuværende | Limit`

Eksempel:

`Pistol Bullets | Ammo | 5 | 20`

`Mangler` beregnes altid i appen som `max(limit - nuværende, 0)` og gemmes ikke som et separat felt.

## Fejlretning

Hvis andre ikke kan forbinde:

1. Tjek at GitHub Pages har deployet den nyeste version.
2. Bed dem trykke Ctrl+F5 eller åbne linket i inkognito.
3. Tjek at reglerne fra `database.rules.json` er published i Firebase.
4. Tjek at alle bruger præcis samme gruppe-link eller samme gruppe-kode.

