# Rust Loot Organizer Live - v4 Fix

Denne version retter live-start med tom loot-plan. Den skriver en usynlig placeholder til Firebase, hvis planen stadig har 0 bokse, så ældre/stramme Realtime Database rules ikke afviser første gemning.

Vigtigt: `database.rules.json` skal stadig kopieres/publishes i Firebase Console under Realtime Database -> Rules. Upload til GitHub ændrer ikke Firebase-reglerne automatisk.

# Rust Loot Organizer Live

En statisk GitHub Pages-side til at organisere Rust loot og storage boxes — med fælles live-data via Firebase Realtime Database.

## Funktioner

- Fælles gruppe-kode/link
- Live sync mellem alle i gruppen
- Opret storage boxes med navn, kategori, placering og noter
- Liste over items pr. boks
- Markér items som mangler/skaffet
- Samlet “Mangler / To-do”-liste
- Søgning og kategorifilter
- Standard setup til våben, ammo, components, farm, byggeri, raid, medical, cards/fuses og elektronik/turrets
- Eksport/import som JSON
- Printvenlig loot-plan
- Fallback til localStorage, hvis Firebase ikke er sat op endnu

## Filer

- `index.html` — siden
- `style.css` — design
- `app.js` — app + Firebase live sync
- `firebase-config.js` — din Firebase config
- `firebase-config.example.js` — eksempel på config
- `database.rules.json` — anbefalede Realtime Database Rules

## 1. Upload til GitHub Pages

1. Opret et nyt GitHub repository, fx `rust-loot-organizer`.
2. Upload alle filerne i denne mappe.
3. Gå til **Settings → Pages**.
4. Vælg **Deploy from a branch**.
5. Vælg branch `main` og folder `/root`.
6. Gem.

Siden virker allerede lokalt i browseren, men live-deling kræver Firebase.

## 2. Opret Firebase-projekt

1. Gå til Firebase Console.
2. Opret nyt project.
3. Tilføj en Web App.
4. Kopiér Firebase config-objektet.
5. Åbn `firebase-config.js` i GitHub og indsæt værdierne.

Eksempel:

```js
window.RUST_LOOT_CONFIG = {
  firebase: {
    apiKey: "...",
    authDomain: "dit-projekt.firebaseapp.com",
    databaseURL: "https://dit-projekt-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dit-projekt",
    storageBucket: "dit-projekt.firebasestorage.app",
    messagingSenderId: "...",
    appId: "..."
  },
  defaultGroupCode: ""
};
```

## 3. Slå Firebase Authentication til

1. Gå til **Authentication → Sign-in method**.
2. Aktivér **Anonymous**.

Appen bruger anonym login, så gruppen ikke behøver brugerkonti.

## 4. Slå Realtime Database til

1. Gå til **Realtime Database**.
2. Opret database.
3. Vælg region.
4. Start gerne i locked mode og indsæt rules nedenfor bagefter.

## 5. Indsæt Database Rules

Gå til **Realtime Database → Rules** og indsæt dette:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "plans": {
      "$groupId": {
        ".read": "auth != null && $groupId.matches(/^[A-Za-z0-9_-]{6,64}$/)",
        ".write": "auth != null && $groupId.matches(/^[A-Za-z0-9_-]{6,64}$/)",
        ".validate": "newData.hasChildren(['wipeName', 'boxes']) || !newData.exists()"
      }
    },
    "presence": {
      "$groupId": {
        "$uid": {
          ".read": "auth != null && $groupId.matches(/^[A-Za-z0-9_-]{6,64}$/)",
          ".write": "auth != null && auth.uid == $uid && $groupId.matches(/^[A-Za-z0-9_-]{6,64}$/)"
        }
      }
    }
  }
}
```

## 6. Brug siden med gruppen

1. Åbn GitHub Pages-linket.
2. Skriv dit navn.
3. Tryk **Generér kode**.
4. Tryk **Start live**.
5. Tryk **Kopiér link** og send linket til gruppen.

Alle der bruger samme link/gruppkode ser samme loot-plan live.

## Sikkerhed

Firebase web config er ikke et password. Det vigtige er database rules.

Gruppe-koden fungerer som et delt hemmeligt rum. Brug derfor en genereret kode og del den kun med gruppen. Det er fint til en Rust-gruppe, men ikke til følsomme data.

## Begrænsning

Hvis to personer redigerer præcis samme boks samtidig, kan sidste gemning vinde. Til almindelig loot-sortering er det normalt fint.


## FEJLFIX 2026-06-28

Denne version indeholder en rettet `database.rules.json` uden den for stramme `.validate`-regel, som kunne forhindre første live-gemning, når planen endnu ikke havde bokse.

Hvis siden viser **Kunne ikke gemme live**, skal reglerne i Firebase opdateres:

1. Firebase Console → Realtime Database → Rules
2. Indsæt indholdet fra `database.rules.json`
3. Tryk **Publish**
4. Genindlæs GitHub Pages-siden og tryk **Start live** igen
