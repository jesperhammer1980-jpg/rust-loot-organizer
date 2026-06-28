// Rust Loot Organizer Live config
// Firebase config indsat fra dit Firebase-projekt.
// Det er okay at denne fil ligger på GitHub Pages. Firebase web config er ikke et password.
// Sikkerheden styres af Realtime Database Rules. Se README.md.
window.RUST_LOOT_CONFIG = {
  firebase: {
    apiKey: "AIzaSyAiLkDrj9kZrGmiJa5pKRsFfMpsTIyc68M",
    authDomain: "rust-loot-organizer.firebaseapp.com",
    databaseURL: "https://rust-loot-organizer-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "rust-loot-organizer",
    storageBucket: "rust-loot-organizer.firebasestorage.app",
    messagingSenderId: "730221374181",
    appId: "1:730221374181:web:b30010fd0c88210f7a820c"
  },

  // Valgfrit: sæt en fast gruppe-kode her, hvis hele siden altid skal åbne samme plan.
  // Lad den være tom hvis brugerne selv skal indtaste/generere gruppe-kode på siden.
  defaultGroupCode: ""
};
