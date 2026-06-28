// Rust Loot Organizer Live config
// Udfyld firebaseConfig med værdierne fra Firebase Console → Project settings → Your apps → Web app.
// Det er okay at denne fil ligger på GitHub Pages. Firebase web config er ikke et password.
// Sikkerheden styres af Realtime Database Rules. Se README.md.
window.RUST_LOOT_CONFIG = {
  firebase: {
    apiKey: "PASTE_API_KEY_HERE",
    authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "PASTE_PROJECT_ID",
    storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "PASTE_SENDER_ID",
    appId: "PASTE_APP_ID"
  },

  // Valgfrit: sæt en fast gruppe-kode her, hvis hele siden altid skal åbne samme plan.
  // Lad den være tom hvis brugerne selv skal indtaste/generere gruppe-kode på siden.
  defaultGroupCode: ""
};
