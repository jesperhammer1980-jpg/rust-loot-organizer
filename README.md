# Rust Loot Organizer Live - v1.0-test

Fælles Rust loot-plan til GitHub Pages med live sync via Firebase Realtime Database.

## Test-before-live workflow

Alle nye ændringer skal laves og testes på en test-branch først. Denne version ligger på:

`test/v1.0-bilingual-items`

Merge ikke til `main`, før test-versionen er godkendt. GitHub Pages live-siden deployer stadig fra `main`.

## Hvad er ændret i v1.0-test

v1.0-test tilføjer bilingual Danish/English support oven på v0.9 manual box workflow:

- sprogskifter mellem `Dansk` og `English`
- valgt sprog gemmes kun lokalt i browserens `localStorage`
- UI labels, kategorier, box type navne, To-do guide og print følger valgt sprog
- central item registry med stabile `itemId` værdier og korrekte canonical Rust item names
- item dropdown viser danske navne plus Rust-navn i dansk mode, fx `Pistolpatroner (Pistol Bullet)`
- engelsk mode viser canonical Rust item names, fx `Pistol Bullet`
- søgning finder både danske og engelske/Rust navne, fx `patroner`, `bullet`, `svovl`, `sulfur`
- gamle Firebase/export items uden `itemId` migreres sikkert ved load/import, hvis navnet kan matches
- ukendte custom items bliver ved med at virke og vises med originalt navn

## Manuel boksopsætning

Brug sektionen `Manuel boksopsætning` / `Manual box setup` først, hvis I vil styre layoutet selv.

1. Vælg `Box type`.
2. Vælg antal bokse.
3. Skriv et box navn eller prefix, fx `Loot`.
4. Tryk `Opret bokse` / `Create boxes`.

Kendte box typer vises bilingualt:

- Stor boks / Large Wood Box / 48 slots
- Lille boks / Small Wood Box / 18 slots
- Locker / 36 slots
- Køleskab / Fridge / 42 slots
- TC / Tool Cupboard / 24 slots
- Drop box / Drop Box / 12 slots
- Vending machine / Vending Machine / 30 slots
- Brugerdefineret / Custom

## Items, Min/Max og To-do

Hver boks har en `Tilføj item` / `Add item` form med:

- item dropdown eller custom navn
- kategori
- `Nuværende` / `Current`
- `Min`
- `Max`
- egen note

Kendte items får auto-fill af kategori, Min og Max. Eksempel:

`Pistol Bullet` auto-fylder `Ammo`, `Min 128` og `Max 512`.

To-do listen viser items hvor `Nuværende < Min` / `Current < Min`, inklusive manglende antal og `Hop til box` / `Jump to box`.

## Live sync

Firebase Realtime Database bruges stadig uden Firebase Authentication.

Når en gruppe-link åbnes:

1. Appen læser remote Firebase-data først.
2. Hvis gruppen findes, bruges remote planen.
3. Hvis gruppen ikke findes, oprettes en tom starter-plan.

Sprogvalg syncer ikke via Firebase. To brugere kan derfor se samme gruppe på forskellige sprog.

## Eksport, import og print

Eksport/import bevarer:

- `itemId` for kendte items
- originalt navn for custom items
- current amount
- Min/Max
- kategori
- noter
- box type og slots
- storage layout settings

Import håndterer gamle exports uden `itemId` og forsøger at matche item-navne mod registry aliases.

Print viser box navn, box type, slots, item, current/min/max, missing to min og status på det valgte sprog.

## Brug

1. Åbn test-preview.
2. Vælg `Dansk` eller `English`.
3. Skriv dit navn.
4. Generér eller indtast en gruppe-kode.
5. Tryk `Start live`.
6. Brug manuel boksopsætning til at oprette bokse.
7. Tilføj items manuelt i de relevante bokse.
8. Tryk `Kopiér link` / `Copy link` og send linket til gruppen.

## Fejlretning

Hvis andre ikke kan forbinde:

1. Tjek at test-preview har version-label `v1.0-test`.
2. Bed dem trykke Ctrl+F5 eller åbne linket i inkognito.
3. Tjek at reglerne fra `database.rules.json` er published i Firebase.
4. Tjek at alle bruger præcis samme gruppe-link eller samme gruppe-kode.
