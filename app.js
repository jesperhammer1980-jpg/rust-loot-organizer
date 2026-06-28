import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const LOCAL_SETTINGS_KEY = "rust-loot-live-settings-v2";
const LOCAL_LANGUAGE_KEY = "rust-loot-language-v1";
const APP_VERSION = "v1.1.1-test";
const LAYOUT_PRESET_VERSION = "v0.8";
const RECOMMENDED_MIN_SLOTS = 360;
const MAX_AUTOCOMPLETE_RESULTS = 8;

const I18N = {
  da: {
    eyebrow: "Rust helper · live group planner",
    subtitle: "Fælles loot-plan for gruppen. Notér hvad der skal ligge i hver storage box, følg mængder og se ændringer live.",
    language: "Sprog",
    print: "Print",
    export: "Eksportér",
    import: "Importér",
    liveGroup: "Live gruppe",
    liveHelp: "Indsæt Firebase config i <code>firebase-config.js</code>, vælg gruppe-kode og del link/kode med resten af holdet.",
    liveHelpConfigured: "Vælg/generér en gruppe-kode. Alle med samme kode ser samme loot-plan live.",
    playerName: "Dit navn",
    playerNamePlaceholder: "Fx Jesper",
    groupCode: "Gruppe-kode",
    groupCodePlaceholder: "Fx lynaes-duo-2026 eller generér en sikker kode",
    generateCode: "Generér kode",
    startLive: "Start live",
    copyLink: "Kopiér link",
    boxes: "Bokse",
    items: "Items",
    missing: "Mangler",
    wipeServer: "Wipe / server",
    wipeServerPlaceholder: "Fx EU Monthly / Duo wipe",
    searchBoxes: "Søg i bokse/items",
    searchPlaceholder: "Søg fx scrap, ammo, meds...",
    category: "Kategori",
    allCategories: "Alle kategorier",
    addBox: "Tilføj boks",
    insertDefaultSetup: "Indsæt standard setup",
    manualSetup: "Manuel boksopsætning",
    manualSetupDesc: "Manuel opsætning er normal workflow: opret bokse, vælg box type og placer items præcis hvor I vil have dem.",
    boxType: "Box type",
    boxCount: "Antal bokse",
    boxName: "Box navn",
    boxNamePlaceholder: "Fx Loot",
    customName: "Custom navn",
    customNamePlaceholder: "Fx Ammo shelf",
    slots: "Slots",
    createBoxes: "Opret bokse",
    slotNote: "Slot-beregning er vejledende og baseret på item-linjer, ikke fuld Rust stack-simulation.",
    storageGenerator: "Storage layout generator",
    storageGeneratorDesc: "Valgfri helper: brug den når I vil starte hurtigt. Genererede bokse kan redigeres manuelt bagefter.",
    generateLayoutAuto: "Generér layout automatisk",
    recommendedSetup: "Brug anbefalet setup",
    addCustomBoxType: "+ Custom box type",
    clearLayout: "Ryd layout",
    generateLayout: "Generér layout",
    defaultSetup: "Standard setup",
    defaultSetupDesc: "Tilføjer et godt begynder/duo setup. Du kan rette alt bagefter.",
    todoMissing: "Mangler / To-do",
    todoMissingDesc: "Items under min samles her med guide og hop til box.",
    storageBoxes: "Storage boxes",
    storageBoxesDesc: "Notér præcist hvad der hører til i hver boks og hvor meget I mangler.",
    dialogDesc: "Giv boksen et tydeligt navn og en kategori.",
    customBoxType: "Custom box type",
    baseLocation: "Placering i basen",
    baseLocationPlaceholder: "Fx loot room venstre side, øverste boks",
    itemsTextLabel: "Items — navn | kategori | Nuværende | Min | Max",
    itemsTextPlaceholder: "Pistol Bullet | Ammo | Nuværende 5 | Min 20 | Max 100\nMetal Fragments | Farm | Nuværende 0 | Min 5000 | Max 15000\nMedical Syringe | Medical/Food | Nuværende 0 | Min 20 | Max 60",
    boxDialogNamePlaceholder: "Fx Ammo / Våben / Farm",
    notes: "Noter",
    notesPlaceholder: "Fx: Gem altid 2 fuses og blå kort her",
    deleteBox: "Slet boks",
    cancel: "Annullér",
    save: "Gem",
    close: "Luk",
    add: "Tilføj",
    edit: "Ret",
    copyList: "Kopiér liste",
    remove: "Fjern",
    move: "Flyt",
    moveToBox: "Flyt til anden boks",
    addItem: "Tilføj item",
    addItemHelp: "Vælg item fra dropdown eller skriv selv.",
    chooseItem: "Vælg item",
    chooseCategory: "Vælg kategori",
    itemSuggestions: "Item forslag",
    noItemSuggestions: "Ingen kendte items matcher. Custom navn kan stadig tilføjes.",
    autocompleteHint: "Brug pil op/ned og Enter for at vælge.",
    current: "Nuværende",
    min: "Min",
    max: "Max",
    missingToMin: "Mangler til min",
    customNote: "Egen note",
    customNotePlaceholder: "Server-note",
    guideLineFound: "Findes lettest",
    guideLineTip: "Tip",
    foundBest: "Findes lettest",
    alternatives: "Alternativer",
    tip: "Tip",
    risk: "Risiko",
    requirements: "Krav",
    monuments: "Monuments",
    jumpToBox: "Hop til box",
    showGuide: "Vis guide",
    hideGuide: "Skjul guide",
    overMax: "Over max",
    underMin: "Under min",
    ok: "OK",
    fulfilled: "Opfyldt",
    noMax: "Ingen max",
    noBoxes: "Ingen bokse endnu",
    noBoxesDesc: "Tryk “Indsæt standard setup” eller “Tilføj boks” for at starte jeres loot-plan.",
    noSearchMatch: "Ingen bokse matcher din søgning.",
    noLocation: "Ingen placering angivet",
    noItems: "Ingen items endnu",
    overCapacity: "Over kapacitet",
    lines: "linjer",
    totalBoxes: "Total bokse",
    totalSlots: "Total slots",
    recommendedMinSlots: "Anbefalet minimum slots",
    missingSlots: "Mangler slots",
    extraSlots: "Ekstra slots",
    storageTypeColumn: "Box type",
    countColumn: "Antal",
    capacityColumn: "Kapacitet / slots",
    totalSlotsColumn: "Total slots",
    primary: "Primær",
    layoutNotGenerated: "Ingen layout genereret endnu.",
    layoutGenerated: "genereret",
    layoutTooTiny: "Ikke nok storage til fuldt anbefalet setup",
    layoutLimited: "Ikke nok storage",
    layoutPlenty: "Ekstra storage",
    layoutReady: "Primær layout klar",
    todoEmpty: "Ingen mangler lige nu.",
    todoEmptyDetail: "Alle items er over min, og intet er over max.",
    box: "Box",
    maxLower: "max",
    overMaxWith: "over max med",
    riskUnknown: "Ukendt",
    noGuide: "Ingen guide endnu",
    noGuideAlt: "Custom item eller guide mangler endnu.",
    noGuideTip: "Tilføj en egen note hvis gruppen har en fast kilde.",
    defaultLocation: "Loot room",
    defaultTemplateAdd: "Tilføj",
    newBox: "Ny boks",
    editBox: "Rediger boks",
    deleteBoxConfirm: "Slet boksen \"{name}\"?",
    removeItemConfirm: "Fjern \"{name}\" fra boksen?",
    chooseItemFirst: "Vælg item først.",
    listCopied: "Listen er kopieret.",
    shareCopied: "Link kopieret.",
    groupCodeCopied: "Gruppe-kode kopieret.",
    importSuccess: "Plan importeret.",
    importLiveSuffix: " Den bliver nu sendt live til gruppen.",
    importInvalid: "Ugyldigt format",
    importFailed: "Kunne ikke importere filen. Tjek at det er en eksport fra Loot Organizer.",
    firebaseConfigured: "Firebase: konfigureret",
    firebaseNotConfigured: "Firebase: ikke konfigureret",
    firebaseMissingConfig: "Mangler Firebase config",
    liveOfflineLocal: "Offline/local",
    liveConnecting: "Forbinder...",
    liveConnected: "Live forbundet",
    liveError: "Live fejl / permission denied",
    liveCouldNotConnect: "Kunne ikke forbinde",
    lastUpdated: "Sidst opdateret",
    users: "Brugere",
    unknownTime: "ukendt tidspunkt",
    firebaseAlertMissing: "Firebase er ikke konfigureret endnu. Udfyld firebase-config.js først.",
    groupCodeTooShort: "Lav en gruppe-kode på mindst 6 tegn. Brug fx knappen ‘Generér kode’. Del kun koden med jeres gruppe.",
    firebaseReadFailed: "Kunne ikke læse live-planen. Tjek Firebase rules og gruppe-kode.",
    firebaseConnectFailed: "Kunne ikke forbinde til Firebase. Tjek firebase-config.js, databaseURL og at Realtime Database Rules fra v5 er publish’et.",
    firebaseSaveFailed: "Kunne ikke gemme live",
    clearLayoutConfirm: "Dette rydder det nuværende layout. Vil du fortsætte?",
    generateNeedsStorage: "Tilføj mindst én storage box før layout genereres.",
    replaceLayoutConfirm: "Dette erstatter det nuværende layout. Vil du fortsætte?",
    custom: "Brugerdefineret"
  },
  en: {
    eyebrow: "Rust helper · live group planner",
    subtitle: "Shared loot plan for the group. Track what belongs in each storage box, quantities, and live updates.",
    language: "Language",
    print: "Print",
    export: "Export",
    import: "Import",
    liveGroup: "Live group",
    liveHelp: "Add Firebase config in <code>firebase-config.js</code>, choose a group code, and share the link/code with the team.",
    liveHelpConfigured: "Choose or generate a group code. Everyone with the same code sees the same loot plan live.",
    playerName: "Your name",
    playerNamePlaceholder: "Example: Jesper",
    groupCode: "Group code",
    groupCodePlaceholder: "Example: lynaes-duo-2026 or generate a secure code",
    generateCode: "Generate code",
    startLive: "Start live",
    copyLink: "Copy link",
    boxes: "Boxes",
    items: "Items",
    missing: "Missing",
    wipeServer: "Wipe / server",
    wipeServerPlaceholder: "Example: EU Monthly / Duo wipe",
    searchBoxes: "Search boxes/items",
    searchPlaceholder: "Search scrap, ammo, meds...",
    category: "Category",
    allCategories: "All categories",
    addBox: "Add box",
    insertDefaultSetup: "Insert standard setup",
    manualSetup: "Manual box setup",
    manualSetupDesc: "Manual setup is the normal workflow: create boxes, choose box type, and place items exactly where your group wants them.",
    boxType: "Box type",
    boxCount: "Box count",
    boxName: "Box name",
    boxNamePlaceholder: "Example: Loot",
    customName: "Custom name",
    customNamePlaceholder: "Example: Ammo shelf",
    slots: "Slots",
    createBoxes: "Create boxes",
    slotNote: "Slot calculation is approximate and based on item rows, not full Rust stack simulation.",
    storageGenerator: "Storage layout generator",
    storageGeneratorDesc: "Optional helper: use it when you want a quick start. Generated boxes can be edited manually afterwards.",
    generateLayoutAuto: "Generate layout automatically",
    recommendedSetup: "Use recommended setup",
    addCustomBoxType: "+ Custom box type",
    clearLayout: "Clear layout",
    generateLayout: "Generate layout",
    defaultSetup: "Standard setup",
    defaultSetupDesc: "Adds a solid beginner/duo setup. You can edit everything afterwards.",
    todoMissing: "Missing / To-do",
    todoMissingDesc: "Items below min appear here with guide and jump-to-box controls.",
    storageBoxes: "Storage boxes",
    storageBoxesDesc: "Record exactly what belongs in each box and how much is missing.",
    dialogDesc: "Give the box a clear name and category.",
    customBoxType: "Custom box type",
    baseLocation: "Base location",
    baseLocationPlaceholder: "Example: loot room left side, top box",
    itemsTextLabel: "Items — name | category | Current | Min | Max",
    itemsTextPlaceholder: "Pistol Bullet | Ammo | Current 5 | Min 20 | Max 100\nMetal Fragments | Farming | Current 0 | Min 5000 | Max 15000\nMedical Syringe | Medical | Current 0 | Min 20 | Max 60",
    boxDialogNamePlaceholder: "Example: Ammo / Weapons / Farm",
    notes: "Notes",
    notesPlaceholder: "Example: Always keep 2 fuses and blue cards here",
    deleteBox: "Delete box",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    add: "Add",
    edit: "Edit",
    copyList: "Copy list",
    remove: "Remove",
    move: "Move",
    moveToBox: "Move to another box",
    addItem: "Add item",
    addItemHelp: "Choose an item from the dropdown or type your own.",
    chooseItem: "Choose item",
    chooseCategory: "Choose category",
    itemSuggestions: "Item suggestions",
    noItemSuggestions: "No known items match. You can still add a custom name.",
    autocompleteHint: "Use arrow up/down and Enter to choose.",
    current: "Current",
    min: "Min",
    max: "Max",
    missingToMin: "Missing to min",
    customNote: "Custom note",
    customNotePlaceholder: "Server note",
    guideLineFound: "Best found",
    guideLineTip: "Tip",
    foundBest: "Best found",
    alternatives: "Alternatives",
    tip: "Tip",
    risk: "Risk",
    requirements: "Requirements",
    monuments: "Monuments",
    jumpToBox: "Jump to box",
    showGuide: "Show guide",
    hideGuide: "Hide guide",
    overMax: "Over max",
    underMin: "Under min",
    ok: "OK",
    fulfilled: "Fulfilled",
    noMax: "No max",
    noBoxes: "No boxes yet",
    noBoxesDesc: "Press “Insert standard setup” or “Add box” to start your loot plan.",
    noSearchMatch: "No boxes match your search.",
    noLocation: "No location set",
    noItems: "No items yet",
    overCapacity: "Over capacity",
    lines: "rows",
    totalBoxes: "Total boxes",
    totalSlots: "Total slots",
    recommendedMinSlots: "Recommended minimum slots",
    missingSlots: "Missing slots",
    extraSlots: "Extra slots",
    storageTypeColumn: "Box type",
    countColumn: "Count",
    capacityColumn: "Capacity / slots",
    totalSlotsColumn: "Total slots",
    primary: "Primary",
    layoutNotGenerated: "No layout generated yet.",
    layoutGenerated: "generated",
    layoutTooTiny: "Not enough storage for the full recommended setup",
    layoutLimited: "Not enough storage",
    layoutPlenty: "Extra storage",
    layoutReady: "Primary layout ready",
    todoEmpty: "Nothing missing right now.",
    todoEmptyDetail: "All items are over min, and nothing is over max.",
    box: "Box",
    maxLower: "max",
    overMaxWith: "over max by",
    riskUnknown: "Unknown",
    noGuide: "No guide yet",
    noGuideAlt: "Custom item or guide is not available yet.",
    noGuideTip: "Add a custom note if your group has a fixed source.",
    defaultLocation: "Loot room",
    defaultTemplateAdd: "Add",
    newBox: "New box",
    editBox: "Edit box",
    deleteBoxConfirm: "Delete the box \"{name}\"?",
    removeItemConfirm: "Remove \"{name}\" from the box?",
    chooseItemFirst: "Choose an item first.",
    listCopied: "List copied.",
    shareCopied: "Link copied.",
    groupCodeCopied: "Group code copied.",
    importSuccess: "Plan imported.",
    importLiveSuffix: " It will now sync live to the group.",
    importInvalid: "Invalid format",
    importFailed: "Could not import the file. Check that it is an export from Loot Organizer.",
    firebaseConfigured: "Firebase: configured",
    firebaseNotConfigured: "Firebase: not configured",
    firebaseMissingConfig: "Missing Firebase config",
    liveOfflineLocal: "Offline/local",
    liveConnecting: "Connecting...",
    liveConnected: "Live connected",
    liveError: "Live error / permission denied",
    liveCouldNotConnect: "Could not connect",
    lastUpdated: "Last updated",
    users: "Users",
    unknownTime: "unknown time",
    firebaseAlertMissing: "Firebase is not configured yet. Fill out firebase-config.js first.",
    groupCodeTooShort: "Create a group code with at least 6 characters. Use the ‘Generate code’ button if needed. Only share the code with your group.",
    firebaseReadFailed: "Could not read the live plan. Check Firebase rules and group code.",
    firebaseConnectFailed: "Could not connect to Firebase. Check firebase-config.js, databaseURL, and that the v5 Realtime Database Rules are published.",
    firebaseSaveFailed: "Could not save live",
    clearLayoutConfirm: "This clears the current layout. Continue?",
    generateNeedsStorage: "Add at least one storage box before generating the layout.",
    replaceLayoutConfirm: "This replaces the current layout. Continue?",
    custom: "Custom"
  }
};

const CATEGORY_DEFS = [
  { id: "farm", da: "Farm", en: "Farming", aliases: ["farming", "resources", "ressourcer"] },
  { id: "ammo", da: "Ammo", en: "Ammunition", aliases: ["ammunition"] },
  { id: "weapons", da: "Våben", en: "Weapons", aliases: ["weapon", "våben", "vaaben"] },
  { id: "medical", da: "Meds", en: "Medical", aliases: ["medical/food", "meds", "healing", "medicin"] },
  { id: "components", da: "Components", en: "Components", aliases: ["componenter"] },
  { id: "tools", da: "Tools", en: "Tools", aliases: ["byggeri", "building", "tool"] },
  { id: "electrical", da: "Elektronik", en: "Electrical", aliases: ["el", "electric", "electronics"] },
  { id: "raid", da: "Raid", en: "Raid", aliases: ["explosives"] },
  { id: "cards", da: "Cards / Keycards", en: "Cards / Keycards", aliases: ["cards/fuses", "cards", "fuses", "keycards", "kort"] },
  { id: "armor", da: "Tøj / Armor", en: "Armor / Clothing", aliases: ["tøj/armor", "toj/armor", "clothing", "clothes", "armor"] },
  { id: "food", da: "Food", en: "Food", aliases: ["mad"] },
  { id: "other", da: "Diverse", en: "Other", aliases: ["andet", "misc"] }
];

const categories = CATEGORY_DEFS.map(category => category.id);
const categoryById = new Map(CATEGORY_DEFS.map(category => [category.id, category]));
const categoryAliasToId = new Map();
CATEGORY_DEFS.forEach(category => {
  [category.id, category.da, category.en, ...(category.aliases || [])]
    .forEach(alias => categoryAliasToId.set(normalizeItemKey(alias), category.id));
});

const DEFAULT_TEMPLATE_MIN = 1;
const DEFAULT_TEMPLATE_MAX = 0;
const DEFAULT_STACK_SIZE = 100;

const defaultStorageTypes = [
  { id: "large-box", label: "Stor boks", daLabel: "Stor boks", enLabel: "Large Wood Box", name: "Large Wood Box", count: 0, slots: 48, fixed: true },
  { id: "small-box", label: "Lille boks", daLabel: "Lille boks", enLabel: "Small Wood Box", name: "Small Wood Box", count: 0, slots: 18, fixed: true },
  { id: "locker", label: "Locker", daLabel: "Locker", enLabel: "Locker", name: "Locker", count: 0, slots: 36, fixed: true },
  { id: "fridge", label: "Køleskab", daLabel: "Køleskab", enLabel: "Fridge", name: "Fridge", count: 0, slots: 42, fixed: true },
  { id: "tool-cupboard", label: "TC", daLabel: "TC", enLabel: "Tool Cupboard", name: "Tool Cupboard", count: 0, slots: 24, fixed: true },
  { id: "drop-box", label: "Drop box", daLabel: "Drop box", enLabel: "Drop Box", name: "Drop Box", count: 0, slots: 12, fixed: true },
  { id: "vending-machine", label: "Vending machine", daLabel: "Vending machine", enLabel: "Vending Machine", name: "Vending Machine", count: 0, slots: 30, fixed: true }
];

const recommendedStorageCounts = {
  "large-box": 6,
  "small-box": 2,
  "locker": 1,
  "fridge": 0,
  "tool-cupboard": 0,
  "drop-box": 0,
  "vending-machine": 0
};

const defaultItemRanges = new Map(Object.entries({
  "stone": { minAmount: 10000, maxAmount: 30000 },
  "wood": { minAmount: 5000, maxAmount: 20000 },
  "metal fragments": { minAmount: 5000, maxAmount: 15000 },
  "metal ore": { minAmount: 5000, maxAmount: 15000 },
  "sulfur": { minAmount: 2500, maxAmount: 10000 },
  "sulfur ore": { minAmount: 2500, maxAmount: 10000 },
  "charcoal": { minAmount: 2500, maxAmount: 10000 },
  "gunpowder": { minAmount: 1000, maxAmount: 5000 },
  "gun powder": { minAmount: 1000, maxAmount: 5000 },
  "pistol bullets": { minAmount: 128, maxAmount: 512 },
  "5.56 ammo": { minAmount: 128, maxAmount: 512 },
  "5.56 rifle ammo": { minAmount: 128, maxAmount: 512 },
  "shotgun shells": { minAmount: 64, maxAmount: 256 },
  "handmade shells": { minAmount: 64, maxAmount: 256 },
  "buckshot": { minAmount: 64, maxAmount: 256 },
  "arrows": { minAmount: 64, maxAmount: 256 },
  "syringe": { minAmount: 20, maxAmount: 60 },
  "medical syringe": { minAmount: 20, maxAmount: 60 },
  "bandage": { minAmount: 30, maxAmount: 100 },
  "medkit": { minAmount: 4, maxAmount: 20 },
  "large medkit": { minAmount: 4, maxAmount: 20 },
  "low grade fuel": { minAmount: 500, maxAmount: 2000 },
  "cloth": { minAmount: 500, maxAmount: 3000 },
  "animal fat": { minAmount: 200, maxAmount: 1000 },
  "gears": { minAmount: 10, maxAmount: 50 },
  "metal pipe": { minAmount: 10, maxAmount: 50 },
  "road signs": { minAmount: 10, maxAmount: 50 },
  "sheet metal": { minAmount: 10, maxAmount: 50 },
  "springs": { minAmount: 10, maxAmount: 50 },
  "metal spring": { minAmount: 10, maxAmount: 50 },
  "tech trash": { minAmount: 5, maxAmount: 30 },
  "scrap": { minAmount: 500, maxAmount: 3000 },
  "high quality metal": { minAmount: 50, maxAmount: 300 },
  "high quality metal ore": { minAmount: 50, maxAmount: 300 },
  "cctv camera": { minAmount: 2, maxAmount: 10 },
  "targeting computer": { minAmount: 2, maxAmount: 10 },
  "fuse": { minAmount: 5, maxAmount: 20 },
  "electric fuse": { minAmount: 5, maxAmount: 20 },
  "green card": { minAmount: 2, maxAmount: 10 },
  "green keycard": { minAmount: 2, maxAmount: 10 },
  "blue card": { minAmount: 2, maxAmount: 10 },
  "blue keycard": { minAmount: 2, maxAmount: 10 },
  "red card": { minAmount: 1, maxAmount: 5 },
  "red keycard": { minAmount: 1, maxAmount: 5 },
  "leather": { minAmount: 200, maxAmount: 1000 },
  "bow": { minAmount: 1, maxAmount: 4 },
  "crossbow": { minAmount: 1, maxAmount: 4 },
  "revolver": { minAmount: 1, maxAmount: 4 },
  "semi-auto rifle": { minAmount: 1, maxAmount: 4 },
  "python": { minAmount: 1, maxAmount: 3 },
  "custom smg": { minAmount: 1, maxAmount: 4 },
  "thompson": { minAmount: 1, maxAmount: 4 },
  "hazmat suit": { minAmount: 2, maxAmount: 8 },
  "metal facemask": { minAmount: 2, maxAmount: 8 },
  "metal chestplate": { minAmount: 2, maxAmount: 8 },
  "pickaxe": { minAmount: 2, maxAmount: 8 },
  "hatchet": { minAmount: 2, maxAmount: 8 },
  "jackhammer": { minAmount: 1, maxAmount: 4 },
  "satchel charge": { minAmount: 4, maxAmount: 20 },
  "explosive ammo": { minAmount: 64, maxAmount: 256 },
  "rocket": { minAmount: 2, maxAmount: 12 },
  "c4": { minAmount: 1, maxAmount: 6 }
}).map(([name, range]) => [normalizeItemKey(name), range]));

const commonItemCatalog = [
  { name: "Stone", category: "Farm" },
  { name: "Wood", category: "Farm" },
  { name: "Metal ore", category: "Farm" },
  { name: "Metal fragments", category: "Farm" },
  { name: "Sulfur ore", category: "Farm" },
  { name: "Sulfur", category: "Raid" },
  { name: "Charcoal", category: "Raid" },
  { name: "Gunpowder", category: "Raid" },
  { name: "Scrap", category: "Components" },
  { name: "High Quality Metal", category: "Components" },
  { name: "Cloth", category: "Medical/Food" },
  { name: "Leather", category: "Tøj/Armor" },
  { name: "Animal Fat", category: "Medical/Food" },
  { name: "Low Grade Fuel", category: "Medical/Food" },
  { name: "Pistol Bullets", category: "Ammo" },
  { name: "5.56 Ammo", category: "Ammo" },
  { name: "Shotgun Shells", category: "Ammo" },
  { name: "Arrows", category: "Ammo" },
  { name: "Syringe", category: "Medical/Food" },
  { name: "Bandage", category: "Medical/Food" },
  { name: "Medkit", category: "Medical/Food" },
  { name: "Gears", category: "Components" },
  { name: "Metal Pipe", category: "Components" },
  { name: "Road Signs", category: "Components" },
  { name: "Sheet Metal", category: "Components" },
  { name: "Springs", category: "Components" },
  { name: "Tech Trash", category: "Components" },
  { name: "CCTV Camera", category: "Elektronik" },
  { name: "Targeting Computer", category: "Elektronik" },
  { name: "Fuse", category: "Cards/Fuses" },
  { name: "Green Card", category: "Cards/Fuses" },
  { name: "Blue Card", category: "Cards/Fuses" },
  { name: "Red Card", category: "Cards/Fuses" },
  { name: "Bow", category: "Våben" },
  { name: "Crossbow", category: "Våben" },
  { name: "Revolver", category: "Våben" },
  { name: "Semi-Auto Rifle", category: "Våben" },
  { name: "Python", category: "Våben" },
  { name: "Custom SMG", category: "Våben" },
  { name: "Thompson", category: "Våben" },
  { name: "Hazmat Suit", category: "Tøj/Armor" },
  { name: "Metal Facemask", category: "Tøj/Armor" },
  { name: "Metal Chestplate", category: "Tøj/Armor" },
  { name: "Pickaxe", category: "Farm" },
  { name: "Hatchet", category: "Farm" },
  { name: "Jackhammer", category: "Farm" },
  { name: "Satchel Charge", category: "Raid" },
  { name: "Explosive Ammo", category: "Raid" },
  { name: "Rocket", category: "Raid" },
  { name: "C4", category: "Raid" }
];

const itemCatalog = new Map(commonItemCatalog.map(item => [normalizeItemKey(item.name), item]));

const stackSizes = new Map(Object.entries({
  "stone": 1000,
  "wood": 1000,
  "metal fragments": 1000,
  "sulfur": 1000,
  "sulfur ore": 1000,
  "metal ore": 1000,
  "charcoal": 1000,
  "gun powder": 1000,
  "pistol bullets": 128,
  "5.56 ammo": 128,
  "5.56 rifle ammo": 128,
  "arrows": 64,
  "handmade shells": 64,
  "buckshot": 64,
  "syringe": 2,
  "medical syringe": 2,
  "bandage": 3,
  "low grade fuel": 500
}).map(([name, amount]) => [normalizeItemKey(name), amount]));

const GUIDE_BY_CATEGORY = {
  farm: {
    da: { bestSource: "Farm nodes, træer, dyr eller barrels afhængigt af itemet", alternativeSources: "Recycle, outpost-handel eller loot crates afhængigt af serveren", tip: "Depotér ofte og fordel farm-loot i tydelige bokse.", riskLevel: "Lav/Mellem" },
    en: { bestSource: "Farm nodes, trees, animals, or barrels depending on the item", alternativeSources: "Recycling, outpost trades, or loot crates depending on the server", tip: "Depot often and keep farming loot in clearly named boxes.", riskLevel: "Low/Medium" }
  },
  ammo: {
    da: { bestSource: "Craft ved workbench når blueprint/resources er klar", alternativeSources: "Ammo crates, scientists og monument loot", tip: "Hold ammo adskilt fra våben, og gem nok gunpowder til raids.", riskLevel: "Mellem" },
    en: { bestSource: "Craft at a workbench once blueprint/resources are ready", alternativeSources: "Ammo crates, scientists, and monument loot", tip: "Keep ammo separate from weapons, and save enough gun powder for raids.", riskLevel: "Medium" }
  },
  weapons: {
    da: { bestSource: "Craft, loot crates eller PvP afhængigt af våbnet", alternativeSources: "Research og craft når blueprint er lært", tip: "Marker klare kits og hold våben tæt på ammo-boksen.", riskLevel: "Mellem/Høj" },
    en: { bestSource: "Crafting, loot crates, or PvP depending on the weapon", alternativeSources: "Research and craft once the blueprint is learned", tip: "Mark ready kits and keep weapons near the ammo box.", riskLevel: "Medium/High" }
  },
  medical: {
    da: { bestSource: "Medical crates, scientists og monuments", alternativeSources: "Craft hvis blueprint og resources er klar", tip: "Hold meds ved udgange og i kit-bokse.", riskLevel: "Mellem" },
    en: { bestSource: "Medical crates, scientists, and monuments", alternativeSources: "Crafting if blueprint and resources are ready", tip: "Keep meds near exits and kit boxes.", riskLevel: "Medium" }
  },
  components: {
    da: { bestSource: "Barrels, crates og recycling-ruter", alternativeSources: "Monuments, roads og safe recycle ved Outpost", tip: "Sorter research-items og recycle-rest hurtigt.", riskLevel: "Mellem" },
    en: { bestSource: "Barrels, crates, and recycling runs", alternativeSources: "Monuments, roads, and safe recycling at Outpost", tip: "Sort research items and recycle leftovers quickly.", riskLevel: "Medium" }
  },
  tools: {
    da: { bestSource: "Craft, tool crates eller køb på Outpost afhængigt af itemet", alternativeSources: "Loot barrels/crates og research", tip: "Gem ekstra farm tools i farm-bokse.", riskLevel: "Lav/Mellem" },
    en: { bestSource: "Crafting, tool crates, or Outpost purchases depending on the item", alternativeSources: "Barrel/crate loot and research", tip: "Keep spare farming tools in farming boxes.", riskLevel: "Low/Medium" }
  },
  electrical: {
    da: { bestSource: "Military crates, elite crates og high-tier monuments", alternativeSources: "Recycle eller køb afhængigt af serveren", tip: "CCTV og Targeting Computer er vigtige til turrets.", riskLevel: "Høj" },
    en: { bestSource: "Military crates, elite crates, and high-tier monuments", alternativeSources: "Recycle or buy depending on the server", tip: "CCTV Cameras and Targeting Computers are key for turrets.", riskLevel: "High" }
  },
  raid: {
    da: { bestSource: "Craft fra sulfur, charcoal, gun powder og explosives", alternativeSources: "Locked crates, elite crates og raid-loot", tip: "Raid-loot bør ligge dybt i basen og have tydelige limits.", riskLevel: "Høj" },
    en: { bestSource: "Craft from sulfur, charcoal, gun powder, and explosives", alternativeSources: "Locked crates, elite crates, and raid loot", tip: "Raid loot should sit deep in base with clear limits.", riskLevel: "High" }
  },
  cards: {
    da: { bestSource: "Monuments og keycard progression", alternativeSources: "Loot boxes og køb/handel afhængigt af serveren", tip: "Hold cards og fuses samlet til monument-runs.", riskLevel: "Mellem" },
    en: { bestSource: "Monuments and keycard progression", alternativeSources: "Loot boxes and buying/trading depending on the server", tip: "Keep cards and fuses together for monument runs.", riskLevel: "Medium" }
  },
  armor: {
    da: { bestSource: "Craft, loot crates eller PvP", alternativeSources: "Recycle/craft fra components og cloth/leather", tip: "Lav klare kit-bokse med armor, våben, ammo og meds.", riskLevel: "Mellem/Høj" },
    en: { bestSource: "Crafting, loot crates, or PvP", alternativeSources: "Recycle/craft from components and cloth/leather", tip: "Build clear kit boxes with armor, weapons, ammo, and meds.", riskLevel: "Medium/High" }
  },
  food: {
    da: { bestSource: "Farming, dyr, skove og food crates", alternativeSources: "Bandit/Outpost handel eller player farms", tip: "Hold food tæt på udgange og respawn-kits.", riskLevel: "Lav" },
    en: { bestSource: "Farming, animals, forests, and food crates", alternativeSources: "Bandit/Outpost trades or player farms", tip: "Keep food near exits and respawn kits.", riskLevel: "Low" }
  },
  other: {
    da: { bestSource: "Afhænger af serveren", alternativeSources: "Tilføj egen note for jeres wipe", tip: "Custom items virker stadig og syncer live.", riskLevel: "Ukendt" },
    en: { bestSource: "Depends on the server", alternativeSources: "Add a custom note for your wipe", tip: "Custom items still work and sync live.", riskLevel: "Unknown" }
  }
};

const ITEM_REGISTRY = [
  itemDef("stone", "Stone", "Sten", "farm", 20000, 30000, 1000, ["sten"]),
  itemDef("wood", "Wood", "Træ", "farm", 10000, 20000, 1000, ["trae", "træ"]),
  itemDef("metal_ore", "Metal Ore", "Metalmalm", "farm", 5000, 15000, 1000, ["metalmalm"]),
  itemDef("metal_fragments", "Metal Fragments", "Metalfragmenter", "farm", 10000, 20000, 1000, ["metal fragments", "metalfragmenter", "frags"]),
  itemDef("sulfur_ore", "Sulfur Ore", "Svovlmalm", "farm", 5000, 10000, 1000, ["svovlmalm"]),
  itemDef("sulfur", "Sulfur", "Svovl", "raid", 5000, 10000, 1000, ["svovl"]),
  itemDef("charcoal", "Charcoal", "Trækul", "raid", 5000, 10000, 1000, ["traekul", "trækul"]),
  itemDef("high_quality_metal_ore", "High Quality Metal Ore", "HQM-malm", "farm", 50, 300, 1000, ["hqm ore", "hqm-malm"]),
  itemDef("high_quality_metal", "High Quality Metal", "High Quality Metal", "farm", 50, 300, 100, ["hqm"]),
  itemDef("cloth", "Cloth", "Stof", "medical", 500, 3000, 1000, ["stof"]),
  itemDef("leather", "Leather", "Læder", "armor", 200, 1000, 1000, ["laeder", "læder"]),
  itemDef("animal_fat", "Animal Fat", "Dyrefedt", "medical", 200, 1000, 1000, ["dyrefedt"]),
  itemDef("low_grade_fuel", "Low Grade Fuel", "Low Grade Fuel", "farm", 500, 2000, 500, ["lgf"]),
  itemDef("scrap", "Scrap", "Scrap", "components", 500, 3000, 1000, []),

  itemDef("pistol_bullet", "Pistol Bullet", "Pistolpatroner", "ammo", 128, 512, 128, ["pistol bullets", "pistolpatroner", "patroner"]),
  itemDef("556_rifle_ammo", "5.56 Rifle Ammo", "5.56-riffelammunition", "ammo", 128, 512, 128, ["5.56 ammo", "556 ammo", "5.56", "5.56 ammunition"]),
  itemDef("handmade_shell", "Handmade Shell", "Hjemmelavet haglpatron", "ammo", 64, 256, 64, ["handmade shells", "hjemmelavet haglpatron"]),
  itemDef("12_gauge_buckshot", "12 Gauge Buckshot", "12 gauge buckshot", "ammo", 64, 256, 64, ["buckshot", "shotgun shells"]),
  itemDef("12_gauge_slug", "12 Gauge Slug", "12 gauge slug", "ammo", 32, 128, 32, ["slug", "slugs"]),
  itemDef("wooden_arrow", "Wooden Arrow", "Træpile", "ammo", 64, 256, 64, ["arrows", "wood arrows", "træpile", "traepile"]),
  itemDef("high_velocity_arrow", "High Velocity Arrow", "High velocity pile", "ammo", 64, 256, 64, ["hv arrow", "hv arrows"]),
  itemDef("fire_arrow", "Fire Arrow", "Ildpile", "ammo", 32, 128, 64, ["fire arrows", "ildpile"]),
  itemDef("rocket", "Rocket", "Raket", "raid", 2, 12, 3, ["raket"]),
  itemDef("high_velocity_rocket", "High Velocity Rocket", "High velocity raket", "raid", 2, 12, 3, ["hv rocket", "hv rockets"]),
  itemDef("incendiary_rocket", "Incendiary Rocket", "Brandraket", "raid", 2, 12, 3, ["fire rocket", "brandraket"]),
  itemDef("explosive_556_rifle_ammo", "Explosive 5.56 Rifle Ammo", "Eksplosiv 5.56-ammunition", "raid", 64, 256, 128, ["explosive ammo", "expo ammo", "explosive 556", "eksplosiv 5.56"]),

  itemDef("bandage", "Bandage", "Bandage", "medical", 30, 100, 3, []),
  itemDef("medical_syringe", "Medical Syringe", "Medical Syringe", "medical", 20, 60, 2, ["syringe", "syringes"]),
  itemDef("large_medkit", "Large Medkit", "Stor førstehjælpskasse", "medical", 4, 20, 1, ["medkit", "large med kit", "stor førstehjælpskasse"]),
  itemDef("anti_radiation_pills", "Anti-Radiation Pills", "Strålingspiller", "medical", 5, 20, 10, ["anti-rad pills", "anti rad pills", "strålingspiller", "straalingspiller"]),

  itemDef("gears", "Gears", "Tandhjul", "components", 10, 50, 20, ["tandhjul"]),
  itemDef("metal_pipe", "Metal Pipe", "Metalrør", "components", 10, 50, 20, ["metal pipes", "metalrør", "metalroer"]),
  itemDef("road_signs", "Road Signs", "Vejskilte", "components", 10, 50, 20, ["road signs", "vejskilte"]),
  itemDef("sheet_metal", "Sheet Metal", "Plademetal", "components", 10, 50, 20, ["plademetal"]),
  itemDef("metal_spring", "Metal Spring", "Metalfjeder", "components", 10, 50, 20, ["springs", "metal springs", "metalfjeder"]),
  itemDef("tech_trash", "Tech Trash", "Tech Trash", "components", 5, 30, 20, []),
  itemDef("rope", "Rope", "Reb", "components", 10, 50, 50, ["reb"]),
  itemDef("sewing_kit", "Sewing Kit", "Sy-kit", "components", 10, 50, 20, ["sy-kit", "sykit"]),
  itemDef("tarp", "Tarp", "Presenning", "components", 10, 50, 20, ["presenning"]),
  itemDef("semi_automatic_body", "Semi Automatic Body", "Semi-auto body", "components", 2, 10, 10, ["semi-auto body", "semi auto body"]),
  itemDef("smg_body", "SMG Body", "SMG body", "components", 2, 10, 10, []),
  itemDef("rifle_body", "Rifle Body", "Rifle body", "components", 2, 10, 10, []),
  itemDef("cctv_camera", "CCTV Camera", "CCTV-kamera", "electrical", 2, 10, 64, ["cctv", "cctv-kamera"]),
  itemDef("targeting_computer", "Targeting Computer", "Targeting Computer", "electrical", 2, 10, 64, []),
  itemDef("electric_fuse", "Electric Fuse", "Sikring", "cards", 5, 20, 10, ["fuse", "fuses", "sikring"]),

  itemDef("hunting_bow", "Hunting Bow", "Jagtbue", "weapons", 1, 4, 1, ["bow", "jagtbue"]),
  itemDef("crossbow", "Crossbow", "Armbrøst", "weapons", 1, 4, 1, ["armbrøst", "armbroest"]),
  itemDef("revolver", "Revolver", "Revolver", "weapons", 1, 4, 1, []),
  itemDef("semi_automatic_pistol", "Semi-Automatic Pistol", "Semi-automatisk pistol", "weapons", 1, 4, 1, ["semi automatic pistol", "sap"]),
  itemDef("python_revolver", "Python Revolver", "Python Revolver", "weapons", 1, 3, 1, ["python"]),
  itemDef("semi_automatic_rifle", "Semi-Automatic Rifle", "Semi-automatisk riffel", "weapons", 1, 4, 1, ["semi-auto rifle", "semi auto rifle", "sar"]),
  itemDef("custom_smg", "Custom SMG", "Custom SMG", "weapons", 1, 4, 1, []),
  itemDef("thompson", "Thompson", "Thompson", "weapons", 1, 4, 1, []),
  itemDef("pickaxe", "Pickaxe", "Pickaxe", "tools", 2, 8, 1, []),
  itemDef("hatchet", "Hatchet", "Hatchet", "tools", 2, 8, 1, []),
  itemDef("salvaged_axe", "Salvaged Axe", "Salvaged Axe", "tools", 1, 4, 1, []),
  itemDef("jackhammer", "Jackhammer", "Jackhammer", "tools", 1, 4, 1, []),
  itemDef("chainsaw", "Chainsaw", "Motorsav", "tools", 1, 4, 1, ["motorsav"]),

  itemDef("hazmat_suit", "Hazmat Suit", "Hazmat Suit", "armor", 2, 8, 1, []),
  itemDef("metal_facemask", "Metal Facemask", "Metal Facemask", "armor", 2, 8, 1, []),
  itemDef("metal_chest_plate", "Metal Chest Plate", "Metal Chest Plate", "armor", 2, 8, 1, ["metal chestplate"]),
  itemDef("road_sign_jacket", "Road Sign Jacket", "Road Sign Jacket", "armor", 2, 8, 1, []),
  itemDef("road_sign_kilt", "Road Sign Kilt", "Road Sign Kilt", "armor", 2, 8, 1, []),
  itemDef("hoodie", "Hoodie", "Hoodie", "armor", 2, 8, 1, []),
  itemDef("pants", "Pants", "Bukser", "armor", 2, 8, 1, ["bukser"]),
  itemDef("boots", "Boots", "Støvler", "armor", 2, 8, 1, ["støvler", "stoevler"]),
  itemDef("gloves", "Gloves", "Handsker", "armor", 2, 8, 1, ["handsker"]),

  itemDef("green_keycard", "Green Keycard", "Grønt keycard", "cards", 2, 10, 1, ["green card", "grønt keycard", "groent keycard"]),
  itemDef("blue_keycard", "Blue Keycard", "Blåt keycard", "cards", 2, 10, 1, ["blue card", "blåt keycard", "blaat keycard"]),
  itemDef("red_keycard", "Red Keycard", "Rødt keycard", "cards", 1, 5, 1, ["red card", "rødt keycard", "roedt keycard"]),

  itemDef("satchel_charge", "Satchel Charge", "Satchel Charge", "raid", 4, 20, 10, []),
  itemDef("timed_explosive_charge", "Timed Explosive Charge", "C4", "raid", 1, 6, 10, ["c4"]),
  itemDef("beancan_grenade", "Beancan Grenade", "Beancan Grenade", "raid", 4, 20, 5, []),
  itemDef("explosives", "Explosives", "Explosives", "raid", 10, 50, 100, []),
  itemDef("gun_powder", "Gun Powder", "Gunpowder", "raid", 1000, 5000, 1000, ["gunpowder"]),

  itemDef("corn", "Corn", "Majs", "food", 20, 100, 20, ["majs"]),
  itemDef("pumpkin", "Pumpkin", "Græskar", "food", 20, 100, 10, ["græskar", "graeskar"]),
  itemDef("mushroom", "Mushroom", "Svamp", "food", 20, 100, 10, ["svamp"]),
  itemDef("apple", "Apple", "Æble", "food", 20, 100, 10, ["æble", "aeble"]),
  itemDef("cooked_meat", "Cooked Meat", "Tilberedt kød", "food", 20, 100, 20, ["tilberedt kød", "tilberedt koed"])
];

const itemRegistry = new Map(ITEM_REGISTRY.map(item => [item.id, item]));
const itemAliasRegistry = new Map();
ITEM_REGISTRY.forEach(item => {
  [
    item.id,
    item.rustName,
    item.daName,
    item.enName,
    getDanishItemOptionLabel(item),
    ...(item.aliases || [])
  ].forEach(alias => itemAliasRegistry.set(normalizeItemKey(alias), item));
});

const layoutBoxRecipes = {
  plenty: [
    { name: "Farm — Stone", category: "Farm", items: ["Stone"], role: "Primær" },
    { name: "Farm — Wood", category: "Farm", items: ["Wood", "Low Grade Fuel"], role: "Primær" },
    { name: "Farm — Metal", category: "Farm", items: ["Metal Ore", "Metal Fragments", "High Quality Metal"], role: "Primær" },
    { name: "Farm — Sulfur", category: "Farm", items: ["Sulfur Ore", "Sulfur", "Charcoal"], role: "Primær" },
    { name: "Components 1", category: "Components", items: ["Scrap", "Gears", "Metal Pipe", "Road Signs"], role: "Primær" },
    { name: "Components 2", category: "Components", items: ["Sheet Metal", "Metal Spring", "Tech Trash"], role: "Backup" },
    { name: "Ammo", category: "Ammo", items: ["Pistol Bullets", "5.56 Ammo", "Shotgun Shells", "Arrows", "Gunpowder"], role: "Primær" },
    { name: "Weapons", category: "Våben", items: ["Revolver", "Semi-Auto Rifle", "Shotgun", "Bue/Crossbow"], role: "Primær" },
    { name: "Meds", category: "Medical/Food", items: ["Syringe", "Bandage", "Medkit", "Cloth", "Animal Fat"], role: "Primær" },
    { name: "Tools", category: "Byggeri", items: ["Tool Cupboard", "Hammer", "Building Plan", "Doors", "Code Locks"], role: "Primær" },
    { name: "Electrical", category: "Elektronik", items: ["CCTV Camera", "Targeting Computer", "Auto Turret", "Wire Tool"], role: "Primær" },
    { name: "Raid", category: "Raid", items: ["Gunpowder", "Explosive Ammo", "Rocket", "C4"], role: "Primær" },
    { name: "Cards", category: "Cards/Fuses", items: ["Green Card", "Blue Card", "Red Card", "Fuse"], role: "Primær" }
  ],
  limited: [
    { name: "Farm", category: "Farm", items: ["Stone", "Wood", "Metal Ore", "Metal Fragments", "Sulfur Ore", "Sulfur", "Charcoal", "Low Grade Fuel"], role: "Primær" },
    { name: "Components", category: "Components", items: ["Scrap", "Gears", "Metal Pipe", "Road Signs", "Sheet Metal", "Metal Spring", "Tech Trash"], role: "Primær" },
    { name: "Ammo / Weapons", category: "Ammo", items: ["Pistol Bullets", "5.56 Ammo", "Shotgun Shells", "Arrows", "Gunpowder", "Revolver", "Semi-Auto Rifle"], role: "Primær" },
    { name: "Meds / Food / Clothes", category: "Medical/Food", items: ["Syringe", "Bandage", "Medkit", "Cloth", "Animal Fat"], role: "Primær" },
    { name: "Tools / Electrical", category: "Elektronik", items: ["Tool Cupboard", "Hammer", "Building Plan", "CCTV Camera", "Targeting Computer", "Fuse"], role: "Primær" },
    { name: "Raid / Cards", category: "Raid", items: ["Gunpowder", "Explosive Ammo", "Rocket", "Green Card", "Blue Card", "Red Card"], role: "Backup" }
  ],
  tiny: [
    { name: "Mixed farm", category: "Farm", items: ["Stone", "Wood", "Metal Fragments", "Sulfur", "Charcoal"], role: "Primær" },
    { name: "Mixed combat", category: "Ammo", items: ["Pistol Bullets", "5.56 Ammo", "Syringe", "Bandage", "Revolver"], role: "Primær" },
    { name: "Mixed components/tools", category: "Components", items: ["Scrap", "Gears", "Metal Pipe", "Sheet Metal", "Tool Cupboard", "Hammer"], role: "Primær" }
  ]
};

const itemGuides = new Map(Object.entries({
  "stone": {
    category: "Farm",
    bestSource: "Stone nodes ved klipper, bjerge og stenede områder",
    alternativeSources: "Små sten-pickups fra jorden",
    tip: "Brug stone pickaxe eller pickaxe. Følg glimtpunktet på noden.",
    riskLevel: "Lav"
  },
  "wood": {
    category: "Farm",
    bestSource: "Træer",
    alternativeSources: "Stumps eller handel ved Outpost hvis serveren tillader det",
    tip: "Brug hatchet eller chainsaw for hurtigere farming.",
    riskLevel: "Lav"
  },
  "metal ore": {
    category: "Farm",
    bestSource: "Metal nodes",
    alternativeSources: "Mining Outpost / quarry hvis serveren bruger det",
    tip: "Skal smeltes i furnace til metal fragments.",
    riskLevel: "Lav/Mellem"
  },
  "metal fragments": {
    category: "Farm",
    bestSource: "Smelt metal ore i furnace",
    alternativeSources: "Recycle components, loot crates/barrels",
    tip: "Recycle road signs, sheet metal, metal pipes osv.",
    riskLevel: "Lav/Mellem"
  },
  "sulfur": {
    category: "Raid",
    bestSource: "Sulfur nodes",
    alternativeSources: "Mining quarry hvis serveren bruger det",
    tip: "Sulfur er raid-materiale, så farm diskret og depotér ofte.",
    riskLevel: "Mellem"
  },
  "sulfur ore": {
    category: "Farm",
    bestSource: "Sulfur nodes",
    alternativeSources: "Mining quarry hvis serveren bruger det",
    tip: "Sulfur er raid-materiale, så farm diskret og depotér ofte.",
    riskLevel: "Mellem"
  },
  "charcoal": {
    category: "Farm",
    bestSource: "Brænd wood i furnace/campfire",
    alternativeSources: "Loot",
    tip: "Charcoal + sulfur bruges til gunpowder.",
    riskLevel: "Lav"
  },
  "gunpowder": {
    category: "Raid",
    bestSource: "Craft af sulfur + charcoal",
    alternativeSources: "Ammo crates, military crates",
    tip: "Bruges til ammo og explosives.",
    riskLevel: "Mellem"
  },
  "gun powder": {
    category: "Raid",
    bestSource: "Craft af sulfur + charcoal",
    alternativeSources: "Ammo crates, military crates",
    tip: "Bruges til ammo og explosives.",
    riskLevel: "Mellem"
  },
  "pistol bullets": {
    category: "Ammo",
    bestSource: "Craft ved workbench med metal fragments + gunpowder",
    alternativeSources: "Ammo crates, scientists, monuments",
    tip: "Hvis I mangler gunpowder, farm sulfur og lav charcoal.",
    riskLevel: "Mellem",
    requirements: "Workbench, blueprint, metal fragments og gunpowder"
  },
  "5.56 ammo": {
    category: "Ammo",
    bestSource: "Craft ved workbench når blueprint er lært",
    alternativeSources: "Military crates, locked crates, scientists",
    tip: "Bruges til SAR, LR, AK osv.",
    riskLevel: "Mellem/Høj",
    requirements: "Workbench og blueprint"
  },
  "5.56 rifle ammo": {
    category: "Ammo",
    bestSource: "Craft ved workbench når blueprint er lært",
    alternativeSources: "Military crates, locked crates, scientists",
    tip: "Bruges til SAR, LR, AK osv.",
    riskLevel: "Mellem/Høj",
    requirements: "Workbench og blueprint"
  },
  "syringe": {
    category: "Medical/Food",
    bestSource: "Medical crates, scientists, monuments",
    alternativeSources: "Craft hvis blueprint og workbench/resources er klar",
    tip: "Prioritér medical crates ved Supermarket, Gas Station og Sewer Branch.",
    riskLevel: "Mellem",
    monuments: "Supermarket, Gas Station, Sewer Branch"
  },
  "medical syringe": {
    category: "Medical/Food",
    bestSource: "Medical crates, scientists, monuments",
    alternativeSources: "Craft hvis blueprint og workbench/resources er klar",
    tip: "Prioritér medical crates ved Supermarket, Gas Station og Sewer Branch.",
    riskLevel: "Mellem",
    monuments: "Supermarket, Gas Station, Sewer Branch"
  },
  "bandage": {
    category: "Medical/Food",
    bestSource: "Craft af cloth",
    alternativeSources: "Medical crates",
    tip: "Cloth fås fra hemp, dyr og recycling af tøj.",
    riskLevel: "Lav"
  },
  "low grade fuel": {
    category: "Farm",
    bestSource: "Craft af animal fat + cloth",
    alternativeSources: "Red barrels, refinery, monuments",
    tip: "Bruges til furnace, meds og køretøjer afhængigt af server/version.",
    riskLevel: "Lav/Mellem"
  },
  "scrap": {
    category: "Components",
    bestSource: "Slå barrels langs veje og recycle components",
    alternativeSources: "Monuments, crates, safe recycling ved Outpost",
    tip: "Lav korte ture og depotér scrap ofte.",
    riskLevel: "Mellem",
    monuments: "Outpost, veje, monuments"
  },
  "high quality metal": {
    category: "Farm",
    bestSource: "Recycle high-end components eller smelt HQM ore",
    alternativeSources: "Military/elite crates",
    tip: "Bruges til turrets, våben og avancerede ting.",
    riskLevel: "Mellem/Høj"
  },
  "high quality metal ore": {
    category: "Farm",
    bestSource: "HQM nodes eller high-tier loot afhængigt af server",
    alternativeSources: "Military/elite crates",
    tip: "Smelt HQM ore til high quality metal.",
    riskLevel: "Mellem/Høj"
  },
  "targeting computer": {
    category: "Elektronik",
    bestSource: "Military/elite crates, locked crates, helicopter/bradley loot",
    alternativeSources: "High-tier monuments",
    tip: "Bruges til Auto Turret.",
    riskLevel: "Høj",
    monuments: "Launch Site, Military Tunnels, Oil Rig"
  },
  "cctv camera": {
    category: "Elektronik",
    bestSource: "Military/elite crates, locked crates",
    alternativeSources: "High-tier monuments",
    tip: "Bruges til Auto Turret og kamera-system.",
    riskLevel: "Høj",
    monuments: "Launch Site, Military Tunnels, Oil Rig"
  }
}).map(([name, guide]) => [normalizeItemKey(name), guide]));

const defaultTemplates = [
  {
    name: "Våben",
    category: "Våben",
    location: "Loot room - øverste våbenboks",
    items: ["Revolver", "Semi-Auto Rifle", "Python", "Thompson", "Shotgun", "Bue/Crossbow", "Melee weapons"],
    notes: "Hold våben og ammo adskilt hvis I ofte bliver doorcamped."
  },
  {
    name: "Ammo",
    category: "Ammo",
    location: "Ved siden af våben",
    items: ["Pistol Bullets", "5.56 Ammo", "Handmade Shells", "Buckshot", "Arrows", "Gun Powder"],
    notes: "Lav ikke al gunpowder om til ammo. Gem noget til raid/eksplosiver."
  },
  {
    name: "Components",
    category: "Components",
    location: "Loot room - recycle boks",
    items: ["Scrap", "Tech Trash", "Rifle Body", "SMG Body", "Semi-Auto Body", "Metal Spring", "Metal Pipe", "Gears", "Road Signs", "Sheet Metal", "Tarp", "Rope"],
    notes: "Sorter ting der skal researches øverst i boksen."
  },
  {
    name: "Farm",
    category: "Farm",
    location: "Tæt på furnace room",
    items: ["Stone", "Metal Ore", "Sulfur Ore", "Wood", "Charcoal", "Low Grade Fuel", "High Quality Metal Ore"],
    notes: "Sulfur er raid-magnet. Gem det dybt i basen."
  },
  {
    name: "Byggeri",
    category: "Byggeri",
    location: "Ved TC / base core",
    items: ["Wood", "Stone", "Metal Fragments", "High Quality Metal", "Doors", "Code Locks", "Tool Cupboard", "Hammer", "Building Plan"],
    notes: "Hav altid materialer nok til emergency repairs."
  },
  {
    name: "Raid",
    category: "Raid",
    location: "Core / låst raid-boks",
    items: ["Sulfur", "Gun Powder", "Satchel Charge", "Beancan Grenade", "Explosive Ammo", "Rocket", "C4"],
    notes: "Skriv tydeligt hvem der må bruge raid-loot."
  },
  {
    name: "Medical / Food",
    category: "Medical/Food",
    location: "Ved udgang / kits",
    items: ["Medical Syringe", "Bandage", "Large Medkit", "Anti-Rad Pills", "Food", "Water Jug"],
    notes: "Lav små klar-til-tur kits før I logger ud."
  },
  {
    name: "Cards / Fuses",
    category: "Cards/Fuses",
    location: "Lille låst boks i core",
    items: ["Green Keycard", "Blue Keycard", "Red Keycard", "Electric Fuse", "Flashlight", "Hazmat Suit"],
    notes: "God boks til monument-runs."
  },
  {
    name: "Elektronik / Turrets",
    category: "Elektronik",
    location: "Ved el-rum",
    items: ["Wire Tool", "Solar Panel", "Battery", "Switch", "CCTV Camera", "Targeting Computer", "Auto Turret", "Computer Station"],
    notes: "Marker Auto Turret, CCTV og Targeting Computer som mangler indtil I har dem."
  }
];

const els = {
  versionLabel: document.getElementById("versionLabel"),
  languageSelect: document.getElementById("languageSelect"),
  liveHelp: document.getElementById("liveHelp"),
  liveStatus: document.getElementById("liveStatus"),
  firebaseConfigStatus: document.getElementById("firebaseConfigStatus"),
  lastUpdated: document.getElementById("lastUpdated"),
  userCount: document.getElementById("userCount"),
  playerName: document.getElementById("playerName"),
  groupCode: document.getElementById("groupCode"),
  btnGenerateCode: document.getElementById("btnGenerateCode"),
  btnJoinLive: document.getElementById("btnJoinLive"),
  btnCopyShare: document.getElementById("btnCopyShare"),
  wipeName: document.getElementById("wipeName"),
  statBoxes: document.getElementById("statBoxes"),
  statItems: document.getElementById("statItems"),
  statMissing: document.getElementById("statMissing"),
  searchInput: document.getElementById("searchInput"),
  filterCategory: document.getElementById("filterCategory"),
  manualBoxType: document.getElementById("manualBoxType"),
  manualBoxCount: document.getElementById("manualBoxCount"),
  manualBoxPrefix: document.getElementById("manualBoxPrefix"),
  manualCustomType: document.getElementById("manualCustomType"),
  manualCustomSlots: document.getElementById("manualCustomSlots"),
  btnCreateManualBoxes: document.getElementById("btnCreateManualBoxes"),
  storageTable: document.getElementById("storageTable"),
  storageSummary: document.getElementById("storageSummary"),
  layoutStatus: document.getElementById("layoutStatus"),
  boxGrid: document.getElementById("boxGrid"),
  missingList: document.getElementById("missingList"),
  boxDialog: document.getElementById("boxDialog"),
  boxForm: document.getElementById("boxForm"),
  dialogTitle: document.getElementById("dialogTitle"),
  boxId: document.getElementById("boxId"),
  boxName: document.getElementById("boxName"),
  boxCategory: document.getElementById("boxCategory"),
  boxType: document.getElementById("boxType"),
  boxCustomType: document.getElementById("boxCustomType"),
  boxSlots: document.getElementById("boxSlots"),
  boxLocation: document.getElementById("boxLocation"),
  boxItems: document.getElementById("boxItems"),
  boxNotes: document.getElementById("boxNotes"),
  btnAddBox: document.getElementById("btnAddBox"),
  btnRecommendedStorage: document.getElementById("btnRecommendedStorage"),
  btnAddStorageType: document.getElementById("btnAddStorageType"),
  btnClearStorage: document.getElementById("btnClearStorage"),
  btnGenerateLayout: document.getElementById("btnGenerateLayout"),
  btnDeleteBox: document.getElementById("btnDeleteBox"),
  btnTemplates: document.getElementById("btnTemplates"),
  btnCloseTemplates: document.getElementById("btnCloseTemplates"),
  templatesPanel: document.getElementById("templatesPanel"),
  templateGrid: document.getElementById("templateGrid"),
  btnExport: document.getElementById("btnExport"),
  importFile: document.getElementById("importFile"),
  btnPrint: document.getElementById("btnPrint"),
  itemOptions: document.getElementById("itemOptions")
};

const appSettings = loadSettings();
let currentLanguage = loadLanguage();
const firebaseConfig = window.RUST_LOOT_CONFIG?.firebase ?? {};
const defaultGroupCode = window.RUST_LOOT_CONFIG?.defaultGroupCode ?? "";
const queryGroup = new URLSearchParams(location.search).get("group") ?? "";
const firebaseConfigured = isFirebaseConfigured(firebaseConfig);

let state = loadState("local");
let currentSearch = "";
let currentCategory = "all";
let applyingRemote = false;
let saveTimer = null;
let lastLocalChangeAt = 0;
let lastSeenUpdatedAt = 0;
let lastSeenUpdatedBy = "";
let lastPresenceCount = null;

let firebaseApp = null;
let db = null;
let activeGroup = "";
let planRef = null;
let presenceRef = null;
let unlistenPlan = null;
let unlistenPresence = null;

init();

function init() {
  bindEvents();
  applyLanguage({ rerender: false });

  els.playerName.value = appSettings.playerName || "";
  els.groupCode.value = cleanGroupCode(queryGroup || defaultGroupCode || appSettings.groupCode || "");

  if (firebaseConfigured && els.groupCode.value) {
    state = createStarterState();
  }

  setFirebaseConfigStatus();
  render();

  if (firebaseConfigured && els.groupCode.value) {
    connectLive();
  }
}

function bindEvents() {
  els.languageSelect?.addEventListener("change", () => {
    currentLanguage = els.languageSelect.value === "en" ? "en" : "da";
    saveLanguage();
    applyLanguage();
  });

  els.playerName.addEventListener("input", () => {
    appSettings.playerName = els.playerName.value.trim();
    saveSettings();
    updatePresence();
  });

  els.groupCode.addEventListener("input", () => {
    els.groupCode.value = cleanGroupCode(els.groupCode.value);
  });

  els.btnGenerateCode.addEventListener("click", () => {
    els.groupCode.value = generateGroupCode();
    appSettings.groupCode = els.groupCode.value;
    saveSettings();
  });

  els.btnJoinLive.addEventListener("click", connectLive);
  els.btnCopyShare.addEventListener("click", copyShareLink);

  els.wipeName.addEventListener("input", () => {
    state.wipeName = els.wipeName.value;
    saveState();
  });

  els.searchInput.addEventListener("input", () => {
    currentSearch = normalizeItemKey(els.searchInput.value);
    renderBoxes();
  });

  els.filterCategory.addEventListener("change", () => {
    currentCategory = els.filterCategory.value;
    renderBoxes();
  });

  els.btnAddBox.addEventListener("click", () => openBoxDialog());
  els.manualBoxType.addEventListener("change", syncManualCustomFields);
  els.btnCreateManualBoxes.addEventListener("click", createManualBoxes);
  els.boxType.addEventListener("change", () => syncDialogBoxTypeFields(true));
  els.btnRecommendedStorage.addEventListener("click", applyRecommendedStorage);
  els.btnAddStorageType.addEventListener("click", addCustomStorageType);
  els.btnClearStorage.addEventListener("click", clearStorageLayout);
  els.btnGenerateLayout.addEventListener("click", generateStorageLayout);
  els.btnTemplates.addEventListener("click", () => els.templatesPanel.classList.toggle("hidden"));
  els.btnCloseTemplates.addEventListener("click", () => els.templatesPanel.classList.add("hidden"));
  els.btnExport.addEventListener("click", exportData);
  els.importFile.addEventListener("change", importData);
  els.btnPrint.addEventListener("click", () => window.print());
  document.addEventListener("click", event => {
    if (!event.target.closest(".autocomplete-wrap")) {
      closeAllItemAutocompletes();
    }
  });

  els.boxForm.addEventListener("submit", event => {
    event.preventDefault();
    saveBoxFromDialog();
  });
  els.boxGrid.addEventListener("submit", event => {
    const form = event.target.closest(".manual-add-item");
    if (!form) return;
    event.preventDefault();
    addManualItem(form.dataset.addBoxId);
  });
  els.boxGrid.addEventListener("click", event => {
    const moveButton = event.target.closest("[data-move-item]");
    if (moveButton) {
      moveItemToBox(moveButton.dataset.boxId, moveButton.dataset.itemId);
      return;
    }
    const removeButton = event.target.closest("[data-remove-item]");
    if (removeButton) {
      removeItemFromBox(removeButton.dataset.boxId, removeButton.dataset.itemId);
    }
  });

  els.btnDeleteBox.addEventListener("click", () => {
    const id = els.boxId.value;
    if (!id) return;
    const box = state.boxes.find(b => b.id === id);
    if (confirm(`Slet boksen "${box?.name ?? ""}"?`)) {
      state.boxes = state.boxes.filter(b => b.id !== id);
      saveState();
      els.boxDialog.close();
      render();
    }
  });
}

function itemDef(id, rustName, daName, categoryId, minAmount, maxAmount, stackSize = DEFAULT_STACK_SIZE, aliases = [], guide = {}) {
  const categoryGuide = GUIDE_BY_CATEGORY[categoryId] || GUIDE_BY_CATEGORY.other;
  return {
    id,
    rustName,
    daName,
    enName: rustName,
    categoryId,
    minAmount,
    maxAmount,
    stackSize,
    aliases,
    guide: {
      da: { ...categoryGuide.da, ...(guide.da || {}) },
      en: { ...categoryGuide.en, ...(guide.en || {}) }
    }
  };
}

function loadLanguage() {
  try {
    return localStorage.getItem(LOCAL_LANGUAGE_KEY) === "en" ? "en" : "da";
  } catch (error) {
    console.error("Kunne ikke læse valgt sprog", error);
    return "da";
  }
}

function saveLanguage() {
  try {
    localStorage.setItem(LOCAL_LANGUAGE_KEY, currentLanguage);
  } catch (error) {
    console.error("Kunne ikke gemme valgt sprog", error);
  }
}

function t(key, replacements = {}) {
  const dictionary = I18N[currentLanguage] || I18N.da;
  const fallback = I18N.da[key] ?? key;
  const template = dictionary[key] ?? fallback;
  return String(template).replace(/\{(\w+)\}/g, (_, name) => replacements[name] ?? "");
}

function applyLanguage({ rerender = true } = {}) {
  document.documentElement.lang = currentLanguage;
  if (els.languageSelect) {
    els.languageSelect.value = currentLanguage;
    els.languageSelect.setAttribute("aria-label", t("language"));
  }
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(element => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  if (els.versionLabel) {
    els.versionLabel.textContent = `Rust Loot Organizer — ${APP_VERSION}`;
  }
  fillCategorySelects();
  fillBoxTypeControls();
  fillItemDatalist();
  renderTemplates();
  setFirebaseConfigStatus();
  refreshLiveStatusText();
  if (lastSeenUpdatedAt) {
    updateLastUpdated(lastSeenUpdatedAt, lastSeenUpdatedBy);
  }
  if (lastPresenceCount !== null) {
    updateUserCount(lastPresenceCount);
  }
  if (rerender) render();
}

function refreshLiveStatusText() {
  if (!els.liveStatus) return;
  if (els.liveStatus.classList.contains("online") && activeGroup) {
    setFirebaseStatus("online", `${t("liveConnected")}: ${activeGroup}`);
    return;
  }
  if (els.liveStatus.classList.contains("connecting")) {
    setFirebaseStatus("connecting", t("liveConnecting"));
    return;
  }
  if (!activeGroup) {
    setFirebaseStatus("offline", t("liveOfflineLocal"));
    if (els.lastUpdated) els.lastUpdated.textContent = `${t("lastUpdated")}: —`;
    if (els.userCount) els.userCount.textContent = `${t("users")}: —`;
  }
}

function getCategoryLabel(value, language = currentLanguage) {
  const categoryId = normalizeCategory(value, "other");
  const category = categoryById.get(categoryId);
  return category?.[language] || category?.da || String(value || "");
}

function getItemDefinition(itemOrName) {
  if (!itemOrName) return null;
  if (typeof itemOrName === "object") {
    if (itemOrName.itemId && itemRegistry.has(itemOrName.itemId)) {
      return itemRegistry.get(itemOrName.itemId);
    }
    return resolveItemName(itemOrName.name || itemOrName.originalName || itemOrName.rustName);
  }
  return resolveItemName(itemOrName);
}

function resolveItemName(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (itemRegistry.has(raw)) return itemRegistry.get(raw);

  const direct = itemAliasRegistry.get(normalizeItemKey(raw));
  if (direct) return direct;

  const parenthetical = raw.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (parenthetical) {
    return resolveItemName(parenthetical[2]) || resolveItemName(parenthetical[1]);
  }

  return null;
}

function getDanishItemOptionLabel(item) {
  return item.daName && item.daName !== item.rustName
    ? `${item.daName} (${item.rustName})`
    : item.rustName;
}

function getItemOptionLabel(item) {
  return currentLanguage === "da" ? getDanishItemOptionLabel(item) : item.enName;
}

function getItemDisplayNameFromValue(value) {
  const item = resolveItemName(value);
  return item ? getItemOptionLabel(item) : String(value || "");
}

function getItemDisplayName(itemOrName) {
  const item = getItemDefinition(itemOrName);
  if (item) return getItemOptionLabel(item);
  if (typeof itemOrName === "object") {
    return String(itemOrName.originalName || itemOrName.name || "Item");
  }
  return String(itemOrName || "Item");
}

function getItemSearchText(item) {
  const definition = getItemDefinition(item);
  if (!definition) {
    return [item?.name, item?.originalName].filter(Boolean).join(" ");
  }
  return [
    definition.id,
    definition.rustName,
    definition.daName,
    definition.enName,
    getDanishItemOptionLabel(definition),
    ...(definition.aliases || []),
    item?.name,
    item?.originalName
  ].filter(Boolean).join(" ");
}

function getCategorySearchText(categoryId) {
  const category = categoryById.get(normalizeCategory(categoryId, "other"));
  if (!category) return "";
  return [
    category.id,
    category.da,
    category.en,
    ...(category.aliases || [])
  ].filter(Boolean).join(" ");
}

function getItemSuggestionSearchText(item) {
  return [
    item.id,
    item.rustName,
    item.daName,
    item.enName,
    getDanishItemOptionLabel(item),
    getItemOptionLabel(item),
    ...(item.aliases || []),
    getCategorySearchText(item.categoryId)
  ].filter(Boolean).join(" ");
}

function getItemSuggestions(query) {
  const normalizedQuery = normalizeItemKey(query);
  if (!normalizedQuery) return [];
  const tokens = normalizedQuery.split(" ").filter(Boolean);
  return ITEM_REGISTRY
    .map(item => {
      const searchText = normalizeItemKey(getItemSuggestionSearchText(item));
      if (!tokens.every(token => searchText.includes(token))) return null;
      const labels = [
        item.rustName,
        item.daName,
        item.enName,
        getDanishItemOptionLabel(item),
        ...(item.aliases || [])
      ].map(normalizeItemKey);
      const categoryText = normalizeItemKey(getCategorySearchText(item.categoryId));
      let score = 20;
      if (labels.some(label => label === normalizedQuery)) score = 0;
      else if (labels.some(label => label.startsWith(normalizedQuery))) score = 1;
      else if (labels.some(label => tokens.every(token => label.includes(token)))) score = 5;
      else if (categoryText.includes(normalizedQuery)) score = 10;
      return { item, score, label: getItemOptionLabel(item) };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label, currentLanguage === "da" ? "da" : "en"))
    .slice(0, MAX_AUTOCOMPLETE_RESULTS)
    .map(result => result.item);
}

function getStorageTypeDisplayLabel(type, language = currentLanguage) {
  if (!type) return t("custom");
  if (language === "en") return type.enLabel || type.name || type.label || t("custom");
  return type.daLabel || type.label || type.name || t("custom");
}

function getBoxTypeOptionLabel(type) {
  const primary = getStorageTypeDisplayLabel(type);
  const secondary = currentLanguage === "da" ? type.name : (type.daLabel || type.label);
  return `${primary} / ${secondary} / ${type.slots} slots`;
}

function getLocalizedLayoutStatus(status) {
  const key = normalizeItemKey(status);
  if (!status || key === normalizeItemKey("Ingen layout genereret endnu.")) return t("layoutNotGenerated");
  if (key.includes("fuldt") || key.includes("full recommended")) return t("layoutTooTiny");
  if (key.includes("ikke nok") || key.includes("not enough")) return t("layoutLimited");
  if (key.includes("ekstra") || key.includes("extra")) return t("layoutPlenty");
  if (key.includes("prim")) return t("layoutReady");
  return String(status);
}

function fillCategorySelects() {
  els.filterCategory.innerHTML = `<option value="all">${escapeHtml(t("allCategories"))}</option>` + categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(getCategoryLabel(c))}</option>`).join("");
  els.boxCategory.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(getCategoryLabel(c))}</option>`).join("");
  if (currentCategory !== "all") {
    currentCategory = normalizeCategory(currentCategory, "all");
    els.filterCategory.value = currentCategory;
  }
}

function fillBoxTypeControls() {
  const options = getBoxTypeOptions();
  const html = options.map(type => `<option value="${escapeHtml(type.id)}">${escapeHtml(getBoxTypeOptionLabel(type))}</option>`).join("")
    + `<option value="custom">${escapeHtml(t("custom"))}</option>`;
  els.manualBoxType.innerHTML = html;
  els.boxType.innerHTML = html;
  syncManualCustomFields();
  syncDialogBoxTypeFields();
}

function fillItemDatalist() {
  els.itemOptions.innerHTML = ITEM_REGISTRY
    .map(item => `<option value="${escapeHtml(getItemOptionLabel(item))}">${escapeHtml(getCategoryLabel(item.categoryId))}</option>`)
    .join("");
}

function renderTemplates() {
  els.templateGrid.innerHTML = defaultTemplates.map((template, index) => `
    <article class="template-card">
      <strong>${escapeHtml(template.name)}</strong>
      <p>${escapeHtml(template.items.slice(0, 4).map(getItemDisplayNameFromValue).join(", "))}${template.items.length > 4 ? "..." : ""}</p>
      <button class="secondary" data-template-index="${index}">${escapeHtml(t("defaultTemplateAdd"))}</button>
    </article>
  `).join("");

  els.templateGrid.querySelectorAll("[data-template-index]").forEach(button => {
    button.addEventListener("click", () => {
      const template = defaultTemplates[Number(button.dataset.templateIndex)];
      addTemplate(template);
    });
  });
}

function render() {
  els.wipeName.value = state.wipeName ?? "";
  renderStorageGenerator();
  renderStats();
  renderMissingList();
  renderBoxes();
}

function renderStorageGenerator() {
  const storage = getStorageLayout();
  const summary = getStorageSummary(storage.storageTypes);
  els.storageTable.innerHTML = `
    <div class="storage-row storage-header">
      <span>${escapeHtml(t("storageTypeColumn"))}</span>
      <span>${escapeHtml(t("countColumn"))}</span>
      <span>${escapeHtml(t("capacityColumn"))}</span>
      <span>${escapeHtml(t("totalSlotsColumn"))}</span>
      <span></span>
    </div>
    ${storage.storageTypes.map(type => renderStorageRow(type)).join("")}
  `;

  els.storageTable.querySelectorAll("[data-storage-field]").forEach(input => {
    input.addEventListener("input", () => updateStorageType(input.dataset.storageId, input.dataset.storageField, input.value));
  });
  els.storageTable.querySelectorAll("[data-remove-storage]").forEach(button => {
    button.addEventListener("click", () => removeStorageType(button.dataset.removeStorage));
  });

  const balanceLabel = summary.missingSlots > 0 ? t("missingSlots") : t("extraSlots");
  const balanceValue = summary.missingSlots > 0 ? summary.missingSlots : summary.extraSlots;
  const balanceClass = summary.missingSlots > 0 ? "warning" : "ok";
  els.storageSummary.innerHTML = `
    <article><span>${escapeHtml(t("totalBoxes"))}</span><strong>${summary.totalBoxes}</strong></article>
    <article><span>${escapeHtml(t("totalSlots"))}</span><strong>${summary.totalSlots}</strong></article>
    <article><span>${escapeHtml(t("recommendedMinSlots"))}</span><strong>${RECOMMENDED_MIN_SLOTS}</strong></article>
    <article class="${balanceClass}"><span>${balanceLabel}</span><strong>${balanceValue}</strong></article>
  `;

  const status = getLocalizedLayoutStatus(storage.layoutStatus || getLayoutStatus(summary).label);
  els.layoutStatus.textContent = storage.generatedAt
    ? `${status} · ${t("layoutGenerated")} ${formatDateTime(storage.generatedAt)}`
    : status;
}

function renderStorageRow(type) {
  const total = toAmount(type.count) * toAmount(type.slots);
  const displayLabel = getStorageTypeDisplayLabel(type);
  const nameInput = type.fixed
    ? `<strong>${escapeHtml(displayLabel)}</strong><small>${escapeHtml(type.name)}</small>`
    : `<input type="text" value="${escapeHtml(type.label || type.name || "")}" data-storage-id="${escapeHtml(type.id)}" data-storage-field="label" aria-label="${escapeHtml(t("boxType"))}" />`;

  return `
    <div class="storage-row" data-storage-id="${escapeHtml(type.id)}">
      <div class="storage-name">${nameInput}</div>
      <input type="number" min="0" step="1" inputmode="numeric" value="${toAmount(type.count)}" data-storage-id="${escapeHtml(type.id)}" data-storage-field="count" aria-label="${escapeHtml(t("countColumn"))} ${escapeHtml(displayLabel)}" />
      <input type="number" min="1" step="1" inputmode="numeric" value="${toAmount(type.slots)}" data-storage-id="${escapeHtml(type.id)}" data-storage-field="slots" aria-label="${escapeHtml(t("slots"))} ${escapeHtml(displayLabel)}" ${type.fixed ? "readonly" : ""} />
      <strong>${total}</strong>
      ${type.fixed ? `<span class="storage-fixed">${escapeHtml(t("primary"))}</span>` : `<button class="ghost storage-remove" type="button" data-remove-storage="${escapeHtml(type.id)}">${escapeHtml(t("remove"))}</button>`}
    </div>
  `;
}

function createManualBoxes() {
  const count = Math.max(toAmount(els.manualBoxCount.value), 1);
  const selectedType = getSelectedManualBoxType();
  const prefix = (els.manualBoxPrefix.value.trim() || selectedType.displayLabel || t("box")).slice(0, 60);
  const boxes = Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    return {
      id: newId(),
      name: `${prefix} ${number}`.trim(),
      category: "other",
      boxType: selectedType.boxType,
      slots: selectedType.slots,
      location: "",
      items: [],
      notes: ""
    };
  });

  state.boxes = [...state.boxes, ...boxes];
  saveState();
  render();
}

function getSelectedManualBoxType() {
  const selectedId = els.manualBoxType.value;
  if (selectedId === "custom") {
    const label = (els.manualCustomType.value.trim() || t("custom")).slice(0, 60);
    return {
      id: "custom",
      label,
      displayLabel: label,
      boxType: label,
      name: "Custom",
      slots: Math.max(toAmount(els.manualCustomSlots.value), 1)
    };
  }
  const selectedType = getBoxTypeById(selectedId) || getBoxTypeOptions()[0];
  return {
    ...selectedType,
    displayLabel: getStorageTypeDisplayLabel(selectedType),
    boxType: selectedType.id
  };
}

function syncManualCustomFields() {
  const isCustom = els.manualBoxType.value === "custom";
  document.querySelectorAll(".manual-custom-field").forEach(field => field.classList.toggle("hidden", !isCustom));
  const selectedType = getBoxTypeById(els.manualBoxType.value);
  if (selectedType && els.manualBoxPrefix.value.trim() === "") {
    els.manualBoxPrefix.placeholder = `Fx ${getStorageTypeDisplayLabel(selectedType)}`;
  }
}

function syncDialogBoxTypeFields(updateSlots = false) {
  const isCustom = els.boxType.value === "custom";
  document.querySelectorAll(".box-custom-type-field").forEach(field => field.classList.toggle("hidden", !isCustom));
  const selectedType = getBoxTypeById(els.boxType.value);
  if (selectedType && updateSlots) {
    els.boxSlots.value = selectedType.slots;
  }
}

function updateStorageType(id, field, value) {
  if (!["label", "count", "slots"].includes(field)) return;
  const storage = getStorageLayout();
  storage.storageTypes = storage.storageTypes.map(type => {
    if (type.id !== id) return type;
    const nextValue = field === "label" ? String(value || "").slice(0, 60) : toAmount(value);
    return { ...type, [field]: nextValue, name: field === "label" ? nextValue : type.name };
  });
  refreshStorageDraftStatus(storage);
  state.storageLayout = sanitizeStorageLayout(storage);
  saveState();
  renderStorageGenerator();
}

function applyRecommendedStorage() {
  const storage = getStorageLayout();
  storage.storageTypes = storage.storageTypes.map(type => ({
    ...type,
    count: recommendedStorageCounts[type.id] ?? type.count
  }));
  refreshStorageDraftStatus(storage);
  state.storageLayout = sanitizeStorageLayout(storage);
  saveState();
  render();
}

function addCustomStorageType() {
  const storage = getStorageLayout();
  storage.storageTypes.push({
    id: newId(),
    label: "Ammo shelf",
    name: "Ammo shelf",
    count: 1,
    slots: 24,
    fixed: false
  });
  refreshStorageDraftStatus(storage);
  state.storageLayout = sanitizeStorageLayout(storage);
  saveState();
  render();
}

function removeStorageType(id) {
  const storage = getStorageLayout();
  storage.storageTypes = storage.storageTypes.filter(type => type.id !== id);
  refreshStorageDraftStatus(storage);
  state.storageLayout = sanitizeStorageLayout(storage);
  saveState();
  render();
}

function clearStorageLayout() {
  if (state.boxes.length) {
    const clear = confirm(t("clearLayoutConfirm"));
    if (!clear) return;
  }
  state.storageLayout = createDefaultStorageLayout();
  state.boxes = [];
  saveState();
  render();
}

function generateStorageLayout() {
  const storage = getStorageLayout();
  const summary = getStorageSummary(storage.storageTypes);
  if (summary.totalBoxes <= 0 || summary.totalSlots <= 0) {
    alert(t("generateNeedsStorage"));
    return;
  }

  if (state.boxes.length) {
    const replace = confirm(t("replaceLayoutConfirm"));
    if (!replace) return;
  }

  const result = buildGeneratedLayout(storage.storageTypes);
  state.boxes = result.boxes;
  state.storageLayout = sanitizeStorageLayout({
    ...storage,
    generatedAt: Date.now(),
    layoutPresetVersion: LAYOUT_PRESET_VERSION,
    layoutStatus: result.status,
    totalBoxes: summary.totalBoxes,
    totalSlots: summary.totalSlots,
    recommendedMinSlots: RECOMMENDED_MIN_SLOTS
  });
  saveState();
  render();
}

function buildGeneratedLayout(storageTypes) {
  const summary = getStorageSummary(storageTypes);
  const status = getLayoutStatus(summary);
  const baseRecipes = layoutBoxRecipes[status.kind];
  const capacityBoxCount = Math.max(summary.totalBoxes, 1);
  const targetCount = Math.min(baseRecipes.length, capacityBoxCount);
  const selectedRecipes = baseRecipes.slice(0, targetCount);
  const boxes = selectedRecipes.map((recipe, index) => createGeneratedBox(recipe, index, storageTypes));
  const extraBoxCount = Math.max(capacityBoxCount - boxes.length, 0);
  const extraSlots = Math.max(summary.totalSlots - RECOMMENDED_MIN_SLOTS, 0);

  for (let index = 0; index < extraBoxCount; index += 1) {
    const name = index === 0 && extraSlots > 96 ? "Backup ammo" : index === 1 && extraSlots > 144 ? "Backup farm" : `Overflow ${index + 1}`;
    boxes.push(createGeneratedBox({
      name,
      category: index % 2 ? "Farm" : "Diverse",
      items: index === 0 ? ["Pistol Bullets", "5.56 Ammo", "Gunpowder"] : index === 1 ? ["Stone", "Wood", "Metal Fragments"] : [],
      role: index < 2 ? "Backup" : "Overflow"
    }, boxes.length, storageTypes));
  }

  if (capacityBoxCount > boxes.length && !boxes.some(box => box.name.toLowerCase().includes("overflow"))) {
    boxes.push(createGeneratedBox({ name: "Overflow", category: "Diverse", items: [], role: "Overflow" }, boxes.length, storageTypes));
  }

  return {
    boxes,
    status: status.label
  };
}

function createGeneratedBox(recipe, index, storageTypes) {
  const assignedStorage = getNthPhysicalStorage(storageTypes, index);
  const role = recipe.role || t("primary");
  return {
    id: newId(),
    name: recipe.name,
    category: normalizeCategory(recipe.category, "other"),
    boxType: assignedStorage?.baseType || assignedStorage?.baseLabel || "custom",
    slots: assignedStorage?.slots || 48,
    location: assignedStorage ? `${assignedStorage.label} · ${assignedStorage.slots} slots · ${role}` : role,
    items: recipe.items.map(itemName => createGeneratedItem(itemName, recipe.category)),
    notes: currentLanguage === "en"
      ? `Generated layout (${role}). ${assignedStorage ? `Planned in ${assignedStorage.label}.` : ""}`
      : `Genereret layout (${role}). ${assignedStorage ? `Planlagt i ${assignedStorage.label}.` : ""}`
  };
}

function createGeneratedItem(itemName, category) {
  const resolved = resolveItemName(itemName);
  const range = getDefaultRange(itemName);
  return {
    id: newId(),
    itemId: resolved?.id || "",
    name: resolved?.rustName || itemName,
    originalName: resolved ? "" : itemName,
    category: normalizeCategory(resolved?.categoryId || getItemGuide(itemName).category, category || "other"),
    currentAmount: 0,
    minAmount: range.minAmount,
    maxAmount: range.maxAmount,
    customNote: ""
  };
}

function renderStats() {
  const allItems = state.boxes.flatMap(box => box.items || []);
  const missing = allItems.filter(item => getMissingToMin(item) > 0).length;
  els.statBoxes.textContent = state.boxes.length;
  els.statItems.textContent = allItems.length;
  els.statMissing.textContent = missing;
}

function renderMissingList() {
  const allItems = state.boxes.flatMap(box => (box.items || []).map(item => ({
    ...item,
    missingToMin: getMissingToMin(item),
    overMaxAmount: getOverMaxAmount(item),
    boxName: box.name,
    boxId: box.id
  })));
  const missing = allItems.filter(item => item.missingToMin > 0);
  const overMax = allItems.filter(item => item.overMaxAmount > 0);

  if (!missing.length && !overMax.length) {
    els.missingList.innerHTML = `<li class="todo-empty">${escapeHtml(t("todoEmpty"))}<small>${escapeHtml(t("todoEmptyDetail"))}</small></li>`;
    return;
  }

  const missingHtml = missing.map(item => renderTodoItem(item)).join("");
  const overMaxHtml = overMax.map(item => `
    <li class="todo-overmax">
      <strong>${escapeHtml(getItemDisplayName(item))} — ${toAmount(item.currentAmount)} / ${escapeHtml(t("maxLower"))} ${toAmount(item.maxAmount)}</strong>
      <small>${escapeHtml(t("box"))}: ${escapeHtml(item.boxName)} — ${escapeHtml(t("overMaxWith"))} ${item.overMaxAmount}</small>
      <button class="ghost todo-action" type="button" data-jump-box="${escapeHtml(item.boxId)}" data-jump-item="${escapeHtml(item.id)}">${escapeHtml(t("jumpToBox"))}</button>
    </li>
  `).join("");

  els.missingList.innerHTML = `
    ${missingHtml}
    ${overMaxHtml ? `<li class="todo-section-label">${escapeHtml(t("overMax"))}</li>${overMaxHtml}` : ""}
  `;

  els.missingList.querySelectorAll("[data-jump-box]").forEach(button => {
    button.addEventListener("click", () => jumpToBox(button.dataset.jumpBox, button.dataset.jumpItem));
  });
  els.missingList.querySelectorAll("[data-toggle-guide]").forEach(button => {
    button.addEventListener("click", () => toggleGuide(button.dataset.toggleGuide));
  });
}

function renderTodoItem(item) {
  const guide = getItemGuide(item);
  const guideId = `guide-${item.boxId}-${item.id}`;
  const riskClass = `risk-${normalizeRiskClass(guide.riskLevel)}`;
  const displayName = getItemDisplayName(item);

  return `
    <li class="todo-item">
      <div class="todo-topline">
        <strong>${escapeHtml(displayName)} — ${escapeHtml(t("missingToMin"))}: ${item.missingToMin}</strong>
        <span class="risk-badge ${riskClass}">${escapeHtml(t("risk"))}: ${escapeHtml(guide.riskLevel)}</span>
      </div>
      <small>${escapeHtml(t("box"))}: ${escapeHtml(item.boxName)} · ${escapeHtml(getCategoryLabel(item.category))} · ${escapeHtml(t("current"))} ${toAmount(item.currentAmount)} / ${escapeHtml(t("min"))} ${toAmount(item.minAmount)} / ${escapeHtml(t("max"))} ${formatMaxAmount(item.maxAmount)}</small>
      <div class="todo-actions">
        <button class="ghost todo-action" type="button" data-jump-box="${escapeHtml(item.boxId)}" data-jump-item="${escapeHtml(item.id)}">${escapeHtml(t("jumpToBox"))}</button>
        <button class="ghost todo-action" type="button" data-toggle-guide="${escapeHtml(guideId)}">${escapeHtml(t("showGuide"))}</button>
      </div>
      <div id="${escapeHtml(guideId)}" class="guide-panel hidden">
        ${renderGuideDetails(guide, item.customNote)}
      </div>
    </li>
  `;
}

function renderGuideDetails(guide, customNote = "") {
  return `
    <dl>
      <div><dt>${escapeHtml(t("foundBest"))}</dt><dd>${escapeHtml(guide.bestSource)}</dd></div>
      <div><dt>${escapeHtml(t("alternatives"))}</dt><dd>${escapeHtml(guide.alternativeSources)}</dd></div>
      <div><dt>${escapeHtml(t("tip"))}</dt><dd>${escapeHtml(guide.tip)}</dd></div>
      <div><dt>${escapeHtml(t("risk"))}</dt><dd>${escapeHtml(guide.riskLevel)}</dd></div>
      ${guide.monuments ? `<div><dt>${escapeHtml(t("monuments"))}</dt><dd>${escapeHtml(guide.monuments)}</dd></div>` : ""}
      ${guide.requirements ? `<div><dt>${escapeHtml(t("requirements"))}</dt><dd>${escapeHtml(guide.requirements)}</dd></div>` : ""}
      ${customNote ? `<div><dt>${escapeHtml(t("customNote"))}</dt><dd>${escapeHtml(customNote)}</dd></div>` : ""}
    </dl>
  `;
}

function jumpToBox(boxId, itemId) {
  const ensureVisible = () => {
    const boxEl = els.boxGrid.querySelector(`[data-box-id="${cssEscape(boxId)}"]`);
    if (!boxEl) return;
    boxEl.scrollIntoView({ behavior: "smooth", block: "center" });
    boxEl.classList.add("box-highlight");
    const itemEl = boxEl.querySelector(`[data-item-id="${cssEscape(itemId)}"]`);
    itemEl?.classList.add("item-highlight");
    window.setTimeout(() => {
      boxEl.classList.remove("box-highlight");
      itemEl?.classList.remove("item-highlight");
    }, 1800);
  };

  if (currentSearch || currentCategory !== "all") {
    currentSearch = "";
    currentCategory = "all";
    els.searchInput.value = "";
    els.filterCategory.value = "all";
    renderBoxes();
    window.requestAnimationFrame(ensureVisible);
  } else {
    ensureVisible();
  }
}

function toggleGuide(guideId) {
  const panel = document.getElementById(guideId);
  const button = els.missingList.querySelector(`[data-toggle-guide="${cssEscape(guideId)}"]`);
  if (!panel || !button) return;
  const isHidden = panel.classList.toggle("hidden");
  button.textContent = isHidden ? t("showGuide") : t("hideGuide");
}

function getItemGuide(itemOrName) {
  const item = getItemDefinition(itemOrName);
  if (item?.guide?.[currentLanguage]) {
    return { ...item.guide[currentLanguage], category: item.categoryId };
  }
  const legacyGuide = itemGuides.get(normalizeItemKey(typeof itemOrName === "string" ? itemOrName : itemOrName?.name));
  if (legacyGuide) {
    return {
      ...legacyGuide,
      category: normalizeCategory(legacyGuide.category, "other")
    };
  }
  return {
    category: "other",
    bestSource: t("noGuide"),
    alternativeSources: t("noGuideAlt"),
    tip: t("noGuideTip"),
    riskLevel: t("riskUnknown")
  };
}

function normalizeRiskClass(value) {
  return String(value || "ukendt")
    .toLowerCase()
    .replaceAll("ø", "oe")
    .replaceAll("å", "aa")
    .replaceAll("æ", "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(String(value));
  return String(value).replaceAll('"', '\\"');
}

function renderBoxes() {
  const filtered = state.boxes.filter(box => {
    const boxCategory = normalizeCategory(box.category, "other");
    const categoryOk = currentCategory === "all" || boxCategory === currentCategory;
    const haystack = [
      box.name,
      getCategoryLabel(boxCategory, "da"),
      getCategoryLabel(boxCategory, "en"),
      getBoxTypeLabel(box, "da"),
      getBoxTypeLabel(box, "en"),
      box.location,
      box.notes,
      ...(box.items || []).flatMap(item => [
        getItemSearchText(item),
        getCategoryLabel(item.category, "da"),
        getCategoryLabel(item.category, "en"),
        item.customNote,
        getGuideSearchText(item)
      ])
    ].join(" ");
    const searchable = normalizeItemKey(haystack);
    const normalizedSearchOk = !currentSearch || searchable.includes(currentSearch);
    return categoryOk && normalizedSearchOk;
  });

  if (!state.boxes.length) {
    els.boxGrid.innerHTML = `
      <div class="panel empty-state">
        <h2>${escapeHtml(t("noBoxes"))}</h2>
        <p>${escapeHtml(t("noBoxesDesc"))}</p>
      </div>
    `;
    return;
  }

  if (!filtered.length) {
    els.boxGrid.innerHTML = `<div class="panel empty-state">${escapeHtml(t("noSearchMatch"))}</div>`;
    return;
  }

  els.boxGrid.innerHTML = filtered.map(box => `
    <article class="panel loot-box" data-box-id="${escapeHtml(box.id)}" id="box-${escapeHtml(box.id)}">
      <header>
        <div>
          <h3>${escapeHtml(box.name)}</h3>
          <div class="location">${escapeHtml(box.location || t("noLocation"))}</div>
          ${renderBoxCapacity(box)}
        </div>
        <span class="category-pill">${escapeHtml(getCategoryLabel(box.category))}</span>
      </header>

      <ul class="item-list">
        ${(box.items || []).map(item => renderItemRow(item, box)).join("") || `<li class="empty-item">${escapeHtml(t("noItems"))}</li>`}
      </ul>

      ${renderAddItemForm(box)}

      ${box.notes ? `<div class="notes">${escapeHtml(box.notes)}</div>` : ""}

      <div class="box-actions">
        <button class="ghost" data-edit-box="${box.id}">${escapeHtml(t("edit"))}</button>
        <button class="ghost" data-copy-box="${box.id}">${escapeHtml(t("copyList"))}</button>
      </div>
    </article>
  `).join("");

  els.boxGrid.querySelectorAll("[data-edit-box]").forEach(btn => btn.addEventListener("click", () => openBoxDialog(btn.dataset.editBox)));
  els.boxGrid.querySelectorAll("[data-copy-box]").forEach(btn => btn.addEventListener("click", () => copyBoxList(btn.dataset.copyBox)));
  els.boxGrid.querySelectorAll("[data-adjust-item]").forEach(button => {
    button.addEventListener("click", () => adjustItemAmount(button.dataset.boxId, button.dataset.itemId, button.dataset.adjustItem));
  });
  els.boxGrid.querySelectorAll("[data-quantity-field]").forEach(input => {
    input.addEventListener("input", () => updateItemField(input.dataset.boxId, input.dataset.itemId, input.dataset.quantityField, input.value, false));
    input.addEventListener("change", () => updateItemField(input.dataset.boxId, input.dataset.itemId, input.dataset.quantityField, input.value));
  });
  els.boxGrid.querySelectorAll("[data-note-field]").forEach(input => {
    input.addEventListener("input", () => updateItemField(input.dataset.boxId, input.dataset.itemId, input.dataset.noteField, input.value, false));
    input.addEventListener("change", () => updateItemField(input.dataset.boxId, input.dataset.itemId, input.dataset.noteField, input.value));
  });
  els.boxGrid.querySelectorAll("[data-item-meta-field]").forEach(input => {
    input.addEventListener("change", () => updateItemField(input.dataset.boxId, input.dataset.itemId, input.dataset.itemMetaField, input.value));
  });
  els.boxGrid.querySelectorAll("[data-add-item-name]").forEach(input => {
    input.addEventListener("input", () => handleItemAutocompleteInput(input));
    input.addEventListener("focus", () => updateItemAutocomplete(input));
    input.addEventListener("keydown", event => handleItemAutocompleteKeydown(event, input));
    input.addEventListener("blur", () => window.setTimeout(() => closeItemAutocomplete(input), 120));
    input.addEventListener("change", () => applyItemDefaultsToForm(input.closest(".manual-add-item"), input.value));
  });
  els.boxGrid.querySelectorAll("[data-autocomplete-list]").forEach(list => {
    list.addEventListener("mousedown", event => event.preventDefault());
    list.addEventListener("click", event => {
      const option = event.target.closest("[data-suggestion-id]");
      if (!option) return;
      const form = option.closest(".manual-add-item");
      const input = form?.querySelector("[data-add-item-name]");
      if (input) selectItemSuggestion(input, option.dataset.suggestionId);
    });
  });
  els.boxGrid.querySelectorAll(".manual-add-item").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      addManualItem(form.dataset.addBoxId);
    });
    form.querySelector('button[type="submit"]')?.addEventListener("click", event => {
      event.preventDefault();
      addManualItem(form.dataset.addBoxId);
    });
  });
}

function handleItemAutocompleteInput(input) {
  const form = input.closest(".manual-add-item");
  const selectedIdInput = form?.querySelector('[data-add-field="itemId"]');
  if (selectedIdInput) selectedIdInput.value = "";
  input.dataset.selectedItemId = "";
  updateItemAutocomplete(input);
  applyItemDefaultsToForm(form, input.value);
}

function handleItemAutocompleteKeydown(event, input) {
  const form = input.closest(".manual-add-item");
  const list = form?.querySelector("[data-autocomplete-list]");
  if (!list) return;
  const options = Array.from(list.querySelectorAll("[data-suggestion-id]"));
  const isOpen = !list.classList.contains("hidden");

  if (event.key === "Escape") {
    closeItemAutocomplete(input);
    return;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!isOpen) {
      updateItemAutocomplete(input);
    }
    const nextOptions = Array.from(list.querySelectorAll("[data-suggestion-id]"));
    if (!nextOptions.length) return;
    const currentIndex = getActiveAutocompleteIndex(form);
    const offset = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = currentIndex < 0
      ? (offset > 0 ? 0 : nextOptions.length - 1)
      : (currentIndex + offset + nextOptions.length) % nextOptions.length;
    setActiveAutocompleteIndex(form, nextIndex);
    return;
  }

  if (event.key === "Enter" && isOpen && options.length) {
    event.preventDefault();
    const activeIndex = Math.max(getActiveAutocompleteIndex(form), 0);
    selectItemSuggestion(input, options[Math.min(activeIndex, options.length - 1)].dataset.suggestionId);
  }
}

function updateItemAutocomplete(input) {
  const form = input.closest(".manual-add-item");
  const list = form?.querySelector("[data-autocomplete-list]");
  if (!form || !list) return;
  const query = input.value.trim();
  if (!query) {
    closeItemAutocomplete(input);
    return;
  }

  const suggestions = getItemSuggestions(query);
  if (!suggestions.length) {
    form.dataset.autocompleteActiveIndex = "-1";
    input.setAttribute("aria-expanded", "true");
    input.removeAttribute("aria-activedescendant");
    list.classList.remove("hidden");
    list.innerHTML = `<div class="autocomplete-empty">${escapeHtml(t("noItemSuggestions"))}</div>`;
    return;
  }

  const listId = list.id || `item-suggestions-${newId()}`;
  list.id = listId;
  input.setAttribute("aria-controls", listId);
  list.innerHTML = suggestions.map((item, index) => renderItemSuggestionOption(item, index, listId)).join("");
  list.classList.remove("hidden");
  input.setAttribute("aria-expanded", "true");
  setActiveAutocompleteIndex(form, 0);
}

function renderItemSuggestionOption(item, index, listId) {
  const displayName = getItemOptionLabel(item);
  const metaParts = currentLanguage === "da" && displayName !== item.rustName
    ? [item.rustName, getCategoryLabel(item.categoryId)]
    : [getCategoryLabel(item.categoryId)];
  const range = `${t("min")} ${item.minAmount} / ${t("max")} ${formatMaxAmount(item.maxAmount)}`;
  return `
    <button class="autocomplete-option" id="${escapeHtml(listId)}-option-${index}" type="button" role="option" data-suggestion-id="${escapeHtml(item.id)}" aria-selected="false">
      <span>${escapeHtml(displayName)}</span>
      <small>${escapeHtml([...metaParts, range].join(" · "))}</small>
    </button>
  `;
}

function selectItemSuggestion(input, itemId) {
  const item = itemRegistry.get(itemId);
  if (!item) return;
  const form = input.closest(".manual-add-item");
  input.value = getItemOptionLabel(item);
  input.dataset.selectedItemId = item.id;
  const selectedIdInput = form?.querySelector('[data-add-field="itemId"]');
  if (selectedIdInput) selectedIdInput.value = item.id;
  applyItemDefaultsToForm(form, input.value, item);
  closeItemAutocomplete(input);
  input.focus();
}

function closeItemAutocomplete(input) {
  const form = input?.closest(".manual-add-item");
  const list = form?.querySelector("[data-autocomplete-list]");
  if (!list) return;
  list.classList.add("hidden");
  list.innerHTML = "";
  form.dataset.autocompleteActiveIndex = "-1";
  input.setAttribute("aria-expanded", "false");
  input.removeAttribute("aria-activedescendant");
}

function closeAllItemAutocompletes() {
  els.boxGrid.querySelectorAll("[data-add-item-name]").forEach(input => closeItemAutocomplete(input));
}

function getActiveAutocompleteIndex(form) {
  const index = Number(form?.dataset.autocompleteActiveIndex);
  return Number.isFinite(index) ? index : -1;
}

function setActiveAutocompleteIndex(form, index) {
  const list = form?.querySelector("[data-autocomplete-list]");
  const input = form?.querySelector("[data-add-item-name]");
  if (!form || !list || !input) return;
  const options = Array.from(list.querySelectorAll("[data-suggestion-id]"));
  form.dataset.autocompleteActiveIndex = String(index);
  options.forEach((option, optionIndex) => {
    const isActive = optionIndex === index;
    option.classList.toggle("is-active", isActive);
    option.setAttribute("aria-selected", String(isActive));
    if (isActive) {
      input.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView({ block: "nearest" });
    }
  });
}

function renderItemRow(item, box) {
  const currentAmount = toAmount(item.currentAmount);
  const minAmount = toAmount(item.minAmount);
  const maxAmount = toAmount(item.maxAmount);
  const missingToMin = getMissingToMin(item);
  const status = getItemStatus(item);
  const guide = getItemGuide(item);
  const displayName = getItemDisplayName(item);
  const categoryLabel = getCategoryLabel(item.category || box.category);

  return `
    <li class="item-row ${status.className}" data-item-id="${escapeHtml(item.id)}">
      <div class="item-main">
        <span class="item-name">${escapeHtml(displayName)}</span>
        <span class="item-category">${escapeHtml(categoryLabel)}</span>
      </div>
      <div class="item-quantity-grid">
        <label>
          <span>${escapeHtml(t("current"))}</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${currentAmount}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-quantity-field="currentAmount" aria-label="${escapeHtml(t("current"))} ${escapeHtml(displayName)}" />
        </label>
        <label>
          <span>${escapeHtml(t("min"))}</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${minAmount}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-quantity-field="minAmount" aria-label="${escapeHtml(t("min"))} ${escapeHtml(displayName)}" />
        </label>
        <label>
          <span>${escapeHtml(t("max"))}</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${maxAmount}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-quantity-field="maxAmount" aria-label="${escapeHtml(t("max"))} ${escapeHtml(displayName)}" />
        </label>
        <span class="missing-badge ${status.badgeClass}">
          <span>${escapeHtml(status.label)}</span>
          <strong>${missingToMin}</strong>
          <em>${escapeHtml(t("missingToMin"))}</em>
        </span>
      </div>
      <label class="item-note">
        <span>${escapeHtml(t("customNote"))}</span>
        <input type="text" value="${escapeHtml(item.customNote || "")}" placeholder="${escapeHtml(t("customNotePlaceholder"))}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-note-field="customNote" aria-label="${escapeHtml(t("customNote"))} ${escapeHtml(displayName)}" />
      </label>
      <label class="item-category-edit">
        <span>${escapeHtml(t("chooseCategory"))}</span>
        <select data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-item-meta-field="category" aria-label="${escapeHtml(t("category"))} ${escapeHtml(displayName)}">
          ${renderCategoryOptions(item.category || box.category)}
        </select>
      </label>
      <div class="item-guide-line">${escapeHtml(t("guideLineFound"))}: ${escapeHtml(guide.bestSource)} · ${escapeHtml(t("guideLineTip"))}: ${escapeHtml(guide.tip)}</div>
      <div class="item-actions">
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-adjust-item="-1">-1</button>
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-adjust-item="1">+1</button>
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-adjust-item="stack">+ stack</button>
        <button class="ghost qty-btn" type="button" data-edit-box="${escapeHtml(box.id)}">${escapeHtml(t("edit"))}</button>
        <label class="move-target">
          <span>${escapeHtml(t("moveToBox"))}</span>
          <select data-move-target="${escapeHtml(item.id)}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}">
            ${renderMoveBoxOptions(box.id)}
          </select>
        </label>
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-move-item="true">${escapeHtml(t("move"))}</button>
        <button class="danger qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-remove-item="true">${escapeHtml(t("remove"))}</button>
      </div>
    </li>
  `;
}

function renderBoxCapacity(box) {
  const usedLines = (box.items || []).length;
  const slots = getBoxSlots(box);
  const overCapacity = slots > 0 && usedLines > slots;
  const label = `${getBoxTypeLabel(box)} — ${usedLines}/${slots} ${t("lines")}`;
  return `<div class="box-capacity ${overCapacity ? "over-capacity" : ""}">${escapeHtml(label)}${overCapacity ? ` <strong>${escapeHtml(t("overCapacity"))}</strong>` : ""}</div>`;
}

function renderAddItemForm(box) {
  return `
    <form class="manual-add-item" data-add-box-id="${escapeHtml(box.id)}">
      <div class="manual-add-heading">
        <strong>${escapeHtml(t("addItem"))}</strong>
        <small>${escapeHtml(t("addItemHelp"))}</small>
      </div>
      <label class="item-autocomplete-field">
        <span>${escapeHtml(t("chooseItem"))}</span>
        <div class="autocomplete-wrap">
          <input type="text" data-add-item-name="${escapeHtml(box.id)}" placeholder="${escapeHtml(currentLanguage === "da" ? "Fx Pistolpatroner (Pistol Bullet)" : "Example: Pistol Bullet")}" autocomplete="off" aria-autocomplete="list" aria-expanded="false" aria-controls="item-suggestions-${escapeHtml(box.id)}" />
          <input type="hidden" data-add-field="itemId" />
          <div class="autocomplete-list hidden" id="item-suggestions-${escapeHtml(box.id)}" data-autocomplete-list role="listbox" aria-label="${escapeHtml(t("itemSuggestions"))}"></div>
        </div>
      </label>
      <label>
        <span>${escapeHtml(t("chooseCategory"))}</span>
        <select data-add-field="category">${renderCategoryOptions(box.category)}</select>
      </label>
      <label>
        <span>${escapeHtml(t("current"))}</span>
        <input type="number" min="0" step="1" inputmode="numeric" value="0" data-add-field="currentAmount" />
      </label>
      <label>
        <span>${escapeHtml(t("min"))}</span>
        <input type="number" min="0" step="1" inputmode="numeric" value="0" data-add-field="minAmount" />
      </label>
      <label>
        <span>${escapeHtml(t("max"))}</span>
        <input type="number" min="0" step="1" inputmode="numeric" value="0" data-add-field="maxAmount" />
      </label>
      <label class="manual-note">
        <span>${escapeHtml(t("customNote"))}</span>
        <input type="text" data-add-field="customNote" placeholder="${escapeHtml(t("customNotePlaceholder"))}" />
      </label>
      <button class="secondary" type="submit">${escapeHtml(t("add"))}</button>
    </form>
  `;
}

function renderCategoryOptions(selectedCategory) {
  const selected = normalizeCategory(selectedCategory, "other");
  return categories.map(category => `<option value="${escapeHtml(category)}" ${category === selected ? "selected" : ""}>${escapeHtml(getCategoryLabel(category))}</option>`).join("");
}

function renderMoveBoxOptions(currentBoxId) {
  return state.boxes.map(box => `<option value="${escapeHtml(box.id)}" ${box.id === currentBoxId ? "selected" : ""}>${escapeHtml(box.name)}</option>`).join("");
}

function openBoxDialog(id = null) {
  const box = id ? state.boxes.find(b => b.id === id) : null;
  els.dialogTitle.textContent = box ? t("editBox") : t("newBox");
  els.boxId.value = box?.id ?? "";
  els.boxName.value = box?.name ?? "";
  els.boxCategory.value = box?.category ?? categories[0];
  setDialogBoxType(box);
  els.boxLocation.value = box?.location ?? "";
  els.boxItems.value = box ? (box.items || []).map(item => formatItemLine(item, box.category)).join("\n") : "";
  els.boxNotes.value = box?.notes ?? "";
  els.btnDeleteBox.classList.toggle("hidden", !box);
  els.boxDialog.showModal();
  setTimeout(() => els.boxName.focus(), 50);
}

function saveBoxFromDialog() {
  const id = els.boxId.value || newId();
  const oldBox = state.boxes.find(box => box.id === id);
  const items = els.boxItems.value
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => parseItemLine(line, oldBox, els.boxCategory.value))
    .filter(Boolean);

  const selectedBoxType = getSelectedDialogBoxType();
  const box = {
    id,
    name: els.boxName.value.trim(),
    category: normalizeCategory(els.boxCategory.value, "other"),
    boxType: selectedBoxType.boxType,
    slots: selectedBoxType.slots,
    location: els.boxLocation.value.trim(),
    items,
    notes: els.boxNotes.value.trim()
  };

  if (oldBox) {
    state.boxes = state.boxes.map(b => b.id === id ? box : b);
  } else {
    state.boxes.unshift(box);
  }

  saveState();
  els.boxDialog.close();
  render();
}

function addTemplate(template) {
  const exists = state.boxes.some(box => box.name.toLowerCase() === template.name.toLowerCase());
  const name = exists ? `${template.name} 2` : template.name;
  state.boxes.unshift({
    id: newId(),
    name,
    category: normalizeCategory(template.category, "other"),
    boxType: "large-box",
    slots: 48,
    location: template.location,
    items: template.items.map(item => createTemplateItem(item, template.category)),
    notes: template.notes
  });
  saveState();
  render();
}

function updateItemField(boxId, itemId, field, value, rerender = true) {
  if (!["currentAmount", "minAmount", "maxAmount", "customNote", "category"].includes(field)) return;
  const nextValue = field === "customNote"
    ? String(value || "").slice(0, 240)
    : field === "category"
      ? normalizeCategory(value, "other")
      : toAmount(value);
  state.boxes = state.boxes.map(box => {
    if (box.id !== boxId) return box;
    return {
      ...box,
      items: (box.items || []).map(item => item.id === itemId ? { ...item, [field]: nextValue } : item)
    };
  });
  saveState();
  if (rerender) {
    render();
  } else {
    renderStats();
    renderMissingList();
  }
}

function addManualItem(boxId) {
  const form = els.boxGrid.querySelector(`.manual-add-item[data-add-box-id="${cssEscape(boxId)}"]`);
  if (!form) return;
  const itemName = form.querySelector("[data-add-item-name]")?.value.trim();
  if (!itemName) {
    alert(t("chooseItemFirst"));
    return;
  }

  const selectedItemId = form.querySelector('[data-add-field="itemId"]')?.value;
  const selectedItem = selectedItemId ? itemRegistry.get(selectedItemId) : null;
  const resolved = selectedItem || resolveItemName(itemName);
  const category = normalizeCategory(form.querySelector('[data-add-field="category"]')?.value, resolved?.categoryId || getSuggestedCategory(itemName));
  const item = {
    id: newId(),
    itemId: resolved?.id || "",
    name: (resolved?.rustName || itemName).slice(0, 80),
    originalName: resolved ? "" : itemName.slice(0, 80),
    category,
    currentAmount: toAmount(form.querySelector('[data-add-field="currentAmount"]')?.value),
    minAmount: toAmount(form.querySelector('[data-add-field="minAmount"]')?.value),
    maxAmount: toAmount(form.querySelector('[data-add-field="maxAmount"]')?.value),
    customNote: String(form.querySelector('[data-add-field="customNote"]')?.value || "").slice(0, 240)
  };

  state.boxes = state.boxes.map(box => {
    if (box.id !== boxId) return box;
    return { ...box, items: [...(box.items || []), item] };
  });
  saveState();
  render();
}

function applyItemDefaultsToForm(form, itemName, itemOverride = null) {
  if (!form || !itemName) return;
  const exactItem = itemOverride || resolveItemName(itemName);
  if (!exactItem && !defaultItemRanges.has(normalizeItemKey(itemName))) return;
  const categoryInput = form.querySelector('[data-add-field="category"]');
  const minInput = form.querySelector('[data-add-field="minAmount"]');
  const maxInput = form.querySelector('[data-add-field="maxAmount"]');
  const range = exactItem ? { minAmount: exactItem.minAmount, maxAmount: exactItem.maxAmount } : getDefaultRange(itemName);
  if (categoryInput) categoryInput.value = exactItem?.categoryId || getSuggestedCategory(itemName);
  if (minInput) minInput.value = range.minAmount;
  if (maxInput) maxInput.value = range.maxAmount;
}

function moveItemToBox(boxId, itemId) {
  const targetSelect = els.boxGrid.querySelector(`select[data-move-target="${cssEscape(itemId)}"][data-box-id="${cssEscape(boxId)}"]`);
  const targetBoxId = targetSelect?.value;
  if (!targetBoxId || targetBoxId === boxId) return;
  const sourceBox = state.boxes.find(box => box.id === boxId);
  const item = sourceBox?.items?.find(entry => entry.id === itemId);
  if (!item) return;

  state.boxes = state.boxes.map(box => {
    if (box.id === boxId) {
      return { ...box, items: (box.items || []).filter(entry => entry.id !== itemId) };
    }
    if (box.id === targetBoxId) {
      return { ...box, items: [...(box.items || []), item] };
    }
    return box;
  });
  saveState();
  render();
}

function removeItemFromBox(boxId, itemId) {
  const sourceBox = state.boxes.find(box => box.id === boxId);
  const item = sourceBox?.items?.find(entry => entry.id === itemId);
  if (!item) return;
  if (!confirm(t("removeItemConfirm", { name: getItemDisplayName(item) }))) return;
  state.boxes = state.boxes.map(box => box.id === boxId
    ? { ...box, items: (box.items || []).filter(entry => entry.id !== itemId) }
    : box);
  saveState();
  render();
}

function adjustItemAmount(boxId, itemId, adjustment) {
  state.boxes = state.boxes.map(box => {
    if (box.id !== boxId) return box;
    return {
      ...box,
      items: (box.items || []).map(item => {
        if (item.id !== itemId) return item;
        const currentAmount = toAmount(item.currentAmount);
        const maxAmount = toAmount(item.maxAmount);
        const delta = adjustment === "stack" ? getStackSize(item) : Number(adjustment);
        if (!Number.isFinite(delta)) return item;
        const nextAmount = adjustment === "stack" && maxAmount > currentAmount
          ? Math.min(currentAmount + delta, maxAmount)
          : Math.max(currentAmount + delta, 0);
        return { ...item, currentAmount: nextAmount };
      })
    };
  });
  saveState();
  render();
}

function copyBoxList(boxId) {
  const box = state.boxes.find(b => b.id === boxId);
  if (!box) return;
  const text = `${box.name}\n${(box.items || []).map(i => {
    const missingToMin = getMissingToMin(i);
    const status = getItemStatus(i).label;
    const customNote = i.customNote ? ` - ${t("customNote")}: ${i.customNote}` : "";
    return `- ${getItemDisplayName(i)} (${getCategoryLabel(i.category)}) - ${t("current")} ${toAmount(i.currentAmount)} / ${t("min")} ${toAmount(i.minAmount)} / ${t("max")} ${formatMaxAmount(i.maxAmount)} - ${status}${missingToMin > 0 ? `, ${t("missingToMin").toLowerCase()} ${missingToMin}` : ""}${customNote}`;
  }).join("\n")}`;
  copyText(text, t("listCopied"));
}

function parseItemLine(line, oldBox, fallbackCategory) {
  const cleanLine = line.replace(/^\[mangler\]\s*/i, "").trim();
  const parts = cleanLine.split("|").map(part => part.trim());
  const name = parts[0];
  if (!name) return null;

  const resolved = resolveItemName(name);
  const oldItem = oldBox?.items?.find(item => {
    const sameRowName = normalizeItemKey(item.name) === normalizeItemKey(name);
    const sameItemId = resolved?.id && item.itemId === resolved.id;
    return sameRowName || sameItemId;
  });
  let category = oldItem?.category || resolved?.categoryId || fallbackCategory || "other";
  let currentAmount = oldItem?.currentAmount ?? 0;
  let minAmount = oldItem?.minAmount ?? oldItem?.limit ?? 0;
  let maxAmount = oldItem?.maxAmount ?? 0;
  let customNote = oldItem?.customNote ?? "";
  const numericParts = [];

  parts.slice(1).forEach(part => {
    const labelValue = parseLabeledValue(part);
    if (labelValue) {
      if (labelValue.key === "currentAmount") currentAmount = labelValue.value;
      if (labelValue.key === "minAmount") minAmount = labelValue.value;
      if (labelValue.key === "maxAmount") maxAmount = labelValue.value;
      if (labelValue.key === "customNote") customNote = labelValue.value;
      return;
    }

    const normalizedPartCategory = normalizeCategory(part, "");
    if (normalizedPartCategory) {
      category = normalizedPartCategory;
    } else if (isAmountLike(part)) {
      numericParts.push(part);
    } else if (!customNote) {
      category = normalizeCategory(part, category);
    }
  });

  if (numericParts.length) currentAmount = numericParts[0];
  if (numericParts.length > 1) minAmount = numericParts[1];
  if (numericParts.length > 2) maxAmount = numericParts[2];

  return {
    id: oldItem?.id ?? newId(),
    itemId: resolved?.id || oldItem?.itemId || "",
    name: (resolved?.rustName || name).slice(0, 80),
    originalName: resolved ? (oldItem?.originalName || "") : (oldItem?.originalName || name).slice(0, 80),
    category: normalizeCategory(category, fallbackCategory || "other"),
    currentAmount: toAmount(currentAmount),
    minAmount: toAmount(minAmount),
    maxAmount: toAmount(maxAmount),
    customNote: String(customNote || "").slice(0, 240)
  };
}

function formatItemLine(item, fallbackCategory) {
  const category = normalizeCategory(item.category, fallbackCategory || "other");
  const note = item.customNote ? ` | ${t("customNote")} ${item.customNote}` : "";
  return `${getItemDisplayName(item)} | ${getCategoryLabel(category)} | ${t("current")} ${toAmount(item.currentAmount)} | ${t("min")} ${toAmount(item.minAmount)} | ${t("max")} ${toAmount(item.maxAmount)}${note}`;
}

function createTemplateItem(itemName, category) {
  const resolved = resolveItemName(itemName);
  const range = getDefaultRange(itemName);
  return {
    id: newId(),
    itemId: resolved?.id || "",
    name: resolved?.rustName || itemName,
    originalName: resolved ? "" : itemName,
    category: normalizeCategory(resolved?.categoryId || category, "other"),
    currentAmount: 0,
    minAmount: range.minAmount,
    maxAmount: range.maxAmount,
    customNote: ""
  };
}

function getDefaultRange(itemName) {
  const item = getItemDefinition(itemName) || resolveItemName(itemName);
  if (item) {
    return { minAmount: item.minAmount, maxAmount: item.maxAmount };
  }
  return defaultItemRanges.get(normalizeItemKey(itemName)) || {
    minAmount: DEFAULT_TEMPLATE_MIN,
    maxAmount: DEFAULT_TEMPLATE_MAX
  };
}

function getStackSize(itemOrName) {
  const item = getItemDefinition(itemOrName) || resolveItemName(itemOrName);
  if (item?.stackSize) return item.stackSize;
  const name = typeof itemOrName === "string" ? itemOrName : itemOrName?.name;
  return stackSizes.get(normalizeItemKey(name)) ?? DEFAULT_STACK_SIZE;
}

function getMissingToMin(item) {
  return Math.max(toAmount(item.minAmount) - toAmount(item.currentAmount), 0);
}

function getOverMaxAmount(item) {
  const maxAmount = toAmount(item.maxAmount);
  if (!maxAmount) return 0;
  return Math.max(toAmount(item.currentAmount) - maxAmount, 0);
}

function getItemStatus(item) {
  if (getMissingToMin(item) > 0) {
    return { label: t("underMin"), className: "is-under-min", badgeClass: "warning" };
  }
  if (getOverMaxAmount(item) > 0) {
    return { label: t("overMax"), className: "is-over-max", badgeClass: "danger" };
  }
  return { label: t("ok"), className: "is-ok", badgeClass: "ok" };
}

function formatMaxAmount(value) {
  const amount = toAmount(value);
  return amount ? String(amount) : t("noMax");
}

function parseLabeledValue(part) {
  const raw = String(part || "").trim();
  const lower = raw.toLowerCase();
  const multiWordLabels = [
    ["egen note", "customNote"],
    ["custom note", "customNote"],
    ["mangler til min", "minAmount"],
    ["missing to min", "minAmount"]
  ];

  for (const [label, key] of multiWordLabels) {
    if (lower.startsWith(`${label} `) || lower.startsWith(`${label}:`) || lower.startsWith(`${label}=`)) {
      return { key, value: raw.slice(label.length).replace(/^[:=\s]+/, "") };
    }
  }

  const match = raw.match(/^([^:]+?)(?:\s*[:=]\s*|\s+)(.+)$/);
  if (!match) return null;
  const label = match[1].trim().toLowerCase();
  const value = match[2].trim();

  if (["nuværende", "nuvaerende", "current", "currentamount", "amount", "antal"].includes(label)) {
    return { key: "currentAmount", value };
  }
  if (["min", "minimum", "minamount"].includes(label)) {
    return { key: "minAmount", value };
  }
  if (["max", "maximum", "maxamount"].includes(label)) {
    return { key: "maxAmount", value };
  }
  if (["egen note", "note", "custom note", "customnote"].includes(label)) {
    return { key: "customNote", value };
  }
  return null;
}

function getGuideSearchText(itemOrName) {
  const guide = getItemGuide(itemOrName);
  return [
    guide.bestSource,
    guide.alternativeSources,
    guide.tip,
    guide.riskLevel,
    guide.monuments,
    guide.requirements
  ].filter(Boolean).join(" ");
}

function getStorageLayout() {
  return sanitizeStorageLayout(state.storageLayout);
}

function createDefaultStorageLayout() {
  return {
    storageTypes: defaultStorageTypes.map(type => ({ ...type })),
    generatedAt: null,
    layoutPresetVersion: LAYOUT_PRESET_VERSION,
    layoutStatus: "Ingen layout genereret endnu."
  };
}

function refreshStorageDraftStatus(storage) {
  const summary = getStorageSummary(storage.storageTypes || []);
  storage.generatedAt = null;
  storage.layoutStatus = getLayoutStatus(summary).label;
  storage.totalBoxes = summary.totalBoxes;
  storage.totalSlots = summary.totalSlots;
  storage.recommendedMinSlots = RECOMMENDED_MIN_SLOTS;
}

function getStorageSummary(storageTypes) {
  const totalBoxes = storageTypes.reduce((sum, type) => sum + toAmount(type.count), 0);
  const totalSlots = storageTypes.reduce((sum, type) => sum + (toAmount(type.count) * toAmount(type.slots)), 0);
  return {
    totalBoxes,
    totalSlots,
    missingSlots: Math.max(RECOMMENDED_MIN_SLOTS - totalSlots, 0),
    extraSlots: Math.max(totalSlots - RECOMMENDED_MIN_SLOTS, 0)
  };
}

function getLayoutStatus(summary) {
  if (summary.totalSlots < 120 || summary.totalBoxes < 3) {
    return { kind: "tiny", label: "Ikke nok storage til fuldt anbefalet setup" };
  }
  if (summary.totalSlots < RECOMMENDED_MIN_SLOTS) {
    return { kind: "limited", label: "Ikke nok storage" };
  }
  if (summary.totalSlots >= RECOMMENDED_MIN_SLOTS + 96 || summary.totalBoxes >= 14) {
    return { kind: "plenty", label: "Ekstra storage" };
  }
  return { kind: "plenty", label: "Primær layout klar" };
}

function getNthPhysicalStorage(storageTypes, index) {
  const expanded = storageTypes.flatMap(type => Array.from({ length: toAmount(type.count) }, (_, countIndex) => ({
    label: getStorageTypeDisplayLabel(type),
    baseLabel: type.label || type.name || "Custom box",
    baseType: getBoxTypeByLabel(type.id || type.label || type.name)?.id || type.id || type.label || type.name || "custom",
    slots: toAmount(type.slots),
    number: countIndex + 1
  })));
  const storage = expanded[index];
  if (!storage) return null;
  return {
    ...storage,
    label: `${storage.label} ${storage.number}`
  };
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return t("unknownTime");
  return date.toLocaleString(currentLanguage === "en" ? "en-US" : "da-DK", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function toAmount(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 0;
  return Math.max(Math.floor(amount), 0);
}

function isAmountLike(value) {
  return value !== "" && Number.isFinite(Number(value));
}

function getBoxTypeOptions() {
  return defaultStorageTypes.map(type => ({ ...type }));
}

function getBoxTypeById(id) {
  return getBoxTypeOptions().find(type => type.id === id);
}

function getBoxTypeByLabel(label) {
  const normalized = normalizeItemKey(label);
  return getBoxTypeOptions().find(type =>
    normalizeItemKey(type.label) === normalized ||
    normalizeItemKey(type.daLabel) === normalized ||
    normalizeItemKey(type.enLabel) === normalized ||
    normalizeItemKey(type.name) === normalized ||
    normalizeItemKey(type.id) === normalized
  );
}

function sanitizeBoxTypeLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "custom";
  const type = getBoxTypeByLabel(raw);
  return type?.id || raw.slice(0, 60);
}

function getBoxTypeSlots(label) {
  return getBoxTypeByLabel(label)?.slots || 48;
}

function getBoxSlots(box) {
  return Math.max(toAmount(box?.slots ?? getBoxTypeSlots(box?.boxType)), 1);
}

function getBoxTypeLabel(box) {
  const value = box?.boxType || "custom";
  const type = getBoxTypeByLabel(value);
  return type ? getStorageTypeDisplayLabel(type) : sanitizeBoxTypeLabel(value);
}

function getSuggestedCategory(itemName) {
  const item = resolveItemName(itemName);
  if (item) return item.categoryId;
  const key = normalizeItemKey(itemName);
  const catalogItem = itemCatalog.get(key);
  const guide = itemGuides.get(key);
  return normalizeCategory(catalogItem?.category || guide?.category, "other");
}

function getSelectedDialogBoxType() {
  if (els.boxType.value === "custom") {
    const label = (els.boxCustomType.value.trim() || t("custom")).slice(0, 60);
    return {
      label,
      boxType: label,
      slots: Math.max(toAmount(els.boxSlots.value), 1)
    };
  }
  const selectedType = getBoxTypeById(els.boxType.value) || getBoxTypeOptions()[0];
  return {
    label: getStorageTypeDisplayLabel(selectedType),
    boxType: selectedType.id,
    slots: Math.max(toAmount(els.boxSlots.value || selectedType.slots), 1)
  };
}

function setDialogBoxType(box) {
  const boxType = sanitizeBoxTypeLabel(box?.boxType || "large-box");
  const matchedType = getBoxTypeByLabel(boxType);
  els.boxType.value = matchedType?.id || "custom";
  els.boxCustomType.value = matchedType ? "" : boxType;
  els.boxSlots.value = Math.max(toAmount(box?.slots ?? matchedType?.slots ?? 48), 1);
  syncDialogBoxTypeFields();
}

function normalizeCategory(value, fallback = "other") {
  if (fallback === "all" && value === "all") return "all";
  const key = normalizeItemKey(value);
  if (categories.includes(value)) return value;
  if (categoryAliasToId.has(key)) return categoryAliasToId.get(key);
  return fallback;
}

function normalizeItemKey(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("æ", "ae")
    .replaceAll("ø", "o")
    .replaceAll("å", "a")
    .replaceAll("Æ", "ae")
    .replaceAll("Ø", "o")
    .replaceAll("Å", "a")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function exportData() {
  const exportState = sanitizeState(state);
  const blob = new Blob([JSON.stringify({ ...exportState, appVersion: APP_VERSION, exportedAt: new Date().toISOString(), groupCode: activeGroup || null }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rust-loot-plan-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.boxes) && typeof imported.boxes !== "object") throw new Error(t("importInvalid"));
      state = sanitizeState({
        wipeName: imported.wipeName ?? "",
        boxes: imported.boxes,
        storageLayout: imported.storageLayout || {
          storageTypes: imported.storageTypes,
          generatedAt: imported.generatedAt,
          layoutPresetVersion: imported.layoutPresetVersion
        }
      });
      saveState();
      render();
      alert(t("importSuccess") + (activeGroup ? t("importLiveSuffix") : ""));
    } catch (error) {
      console.error("Kunne ikke importere loot-plan", error);
      alert(t("importFailed"));
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

async function connectLive() {
  if (!firebaseConfigured) {
    alert(t("firebaseAlertMissing"));
    setFirebaseStatus("offline", t("firebaseMissingConfig"));
    return;
  }

  const group = cleanGroupCode(els.groupCode.value);
  if (group.length < 6) {
    alert(t("groupCodeTooShort"));
    return;
  }

  activeGroup = group;
  appSettings.groupCode = group;
  appSettings.playerName = els.playerName.value.trim();
  saveSettings();
  updateUrlGroup(group);

  setFirebaseStatus("connecting", t("liveConnecting"));

  try {
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
      db = getDatabase(firebaseApp, firebaseConfig.databaseURL);
    }

    planRef = ref(db, `plans/${activeGroup}`);

    if (unlistenPlan) unlistenPlan();
    let hasHandledInitialSnapshot = false;
    unlistenPlan = onValue(planRef, snapshot => {
      const value = snapshot.val();
      if (!value) {
        if (!hasHandledInitialSnapshot) {
          hasHandledInitialSnapshot = true;
          applyingRemote = true;
          state = createStarterState();
          localStorage.setItem(localStateKey(activeGroup), JSON.stringify(state));
          render();
          applyingRemote = false;
          pushStateNow();
          return;
        }
        console.error("Firebase load returned empty plan after initial sync", { group: activeGroup });
        pushStateNow();
        return;
      }

      hasHandledInitialSnapshot = true;
      const remoteUpdatedAt = toAmount(value.updatedAt);
      if (lastLocalChangeAt && (!remoteUpdatedAt || remoteUpdatedAt < lastLocalChangeAt)) {
        return;
      }
      applyingRemote = true;
      state = sanitizeState(value);
      localStorage.setItem(localStateKey(activeGroup), JSON.stringify(state));
      render();
      applyingRemote = false;

      setFirebaseStatus("online", `${t("liveConnected")}: ${activeGroup}`);
      updateLastUpdated(value.updatedAt, value.updatedBy);
    }, error => {
      console.error("Kunne ikke læse live-plan fra Firebase", { group: activeGroup, error });
      setFirebaseStatus("offline", t("liveError"));
      alert(t("firebaseReadFailed"));
    });

    setupPresence();
  } catch (error) {
    console.error("Kunne ikke forbinde til Firebase", { group: activeGroup, error });
    const code = error?.code ? ` (${error.code})` : "";
    setFirebaseStatus("offline", `${t("liveCouldNotConnect")}${code}`);
    alert(t("firebaseConnectFailed"));
  }
}

function setupPresence() {
  if (!db || !activeGroup) return;

  const clientId = getClientId();
  presenceRef = ref(db, `presence/${activeGroup}/${clientId}`);
  updatePresence();
  onDisconnect(presenceRef).remove();

  if (unlistenPresence) unlistenPresence();
  const groupPresenceRef = ref(db, `presence/${activeGroup}`);
  unlistenPresence = onValue(groupPresenceRef, snapshot => {
    const users = snapshot.val() || {};
    updateUserCount(Object.keys(users).length);
  });
}

function updateUserCount(count) {
  lastPresenceCount = count;
  els.userCount.textContent = `${t("users")}: ${count}`;
}

function updatePresence() {
  if (!presenceRef) return;
  set(presenceRef, {
    name: getPlayerName(),
    online: true,
    updatedAt: Date.now()
  }).catch(error => console.warn("Presence kunne ikke opdateres", error));
}

function saveState() {
  state = sanitizeState(state);
  localStorage.setItem(localStateKey(activeGroup || "local"), JSON.stringify(state));
  if (activeGroup && planRef && !applyingRemote) {
    lastLocalChangeAt = Date.now();
    queueRemoteSave();
  }
}

function toFirebaseBoxes(boxes) {
  // Firebase Realtime Database can treat empty arrays as missing/null.
  // Some older rules also require the child "boxes" to exist.
  // This placeholder keeps first live-save valid while still showing 0 boxes in the app.
  const cleanBoxes = Array.isArray(boxes) ? boxes : [];
  if (!cleanBoxes.length) return { __empty: true };
  return cleanBoxes;
}

function fromFirebaseBoxes(rawBoxes) {
  return fromFirebaseList(rawBoxes);
}

function fromFirebaseList(rawValue) {
  if (Array.isArray(rawValue)) return rawValue;
  if (rawValue && typeof rawValue === "object") {
    return Object.entries(rawValue)
      .filter(([key]) => key !== "__empty")
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, value]) => value);
  }
  return [];
}

function queueRemoteSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(pushStateNow, 350);
}

async function pushStateNow() {
  if (!planRef) return;
  const payload = {
    wipeName: state.wipeName || "",
    boxes: toFirebaseBoxes(state.boxes),
    storageLayout: sanitizeStorageLayout(state.storageLayout),
    updatedAt: Date.now(),
    updatedBy: getPlayerName(),
    version: 10
  };

  try {
    await set(planRef, payload);
    if (lastLocalChangeAt <= payload.updatedAt) {
      lastLocalChangeAt = 0;
    }
    setFirebaseStatus("online", `${t("liveConnected")}: ${activeGroup}`);
    updateLastUpdated(payload.updatedAt, payload.updatedBy);
  } catch (error) {
    console.error("Kunne ikke gemme live", error);
    const code = error?.code ? ` (${error.code})` : "";
    const message = error?.message ? `: ${error.message}` : "";
    setFirebaseStatus("offline", `${t("firebaseSaveFailed")}${code}`);
    alert(`${t("firebaseSaveFailed")}${code}${message}\n\nHvis fejlen er PERMISSION_DENIED, er Firebase Rules ikke publish'et eller for stramme.`);
  }
}

function loadState(group) {
  try {
    const groupSaved = localStorage.getItem(localStateKey(group));
    if (groupSaved) return sanitizeState(JSON.parse(groupSaved));
    const oldSaved = localStorage.getItem("rust-loot-organizer-v1");
    if (oldSaved) return sanitizeState(JSON.parse(oldSaved));
  } catch (error) {
    console.error("Kunne ikke læse gemt lokal loot-plan", { group, error });
  }
  return createStarterState();
}

function sanitizeState(value) {
  const boxes = fromFirebaseBoxes(value?.boxes);
  return {
    wipeName: typeof value?.wipeName === "string" ? value.wipeName : "",
    storageLayout: sanitizeStorageLayout(value?.storageLayout),
    boxes: boxes.map(sanitizeBox).slice(0, 80)
  };
}

function sanitizeBox(box) {
  const category = normalizeCategory(box?.category, "other");
  const boxType = sanitizeBoxTypeLabel(box?.boxType ?? box?.type ?? box?.storageType);
  return {
    id: String(box?.id || newId()),
    name: String(box?.name || (currentLanguage === "en" ? "Unnamed box" : "Unavngivet boks")).slice(0, 80),
    category,
    boxType,
    slots: Math.max(toAmount(box?.slots ?? box?.capacity ?? getBoxTypeSlots(boxType)), 1),
    location: String(box?.location || "").slice(0, 140),
    notes: String(box?.notes || "").slice(0, 1000),
    items: fromFirebaseList(box?.items).map(item => sanitizeItem(item, category)).slice(0, 80)
  };
}

function sanitizeStorageLayout(value) {
  const storedTypes = Array.isArray(value?.storageTypes) ? value.storageTypes : [];
  const byId = new Map(storedTypes.map(type => [String(type?.id || newId()), type]));
  const fixedTypes = defaultStorageTypes.map(defaultType => {
    const stored = byId.get(defaultType.id) || {};
    return {
      ...defaultType,
      count: toAmount(stored.count ?? defaultType.count),
      slots: toAmount(stored.slots ?? defaultType.slots) || defaultType.slots
    };
  });
  const customTypes = storedTypes
    .filter(type => !defaultStorageTypes.some(defaultType => defaultType.id === type?.id))
    .map(type => ({
      id: String(type?.id || newId()),
      label: String(type?.label || type?.name || "Custom box").slice(0, 60),
      name: String(type?.name || type?.label || "Custom box").slice(0, 60),
      count: toAmount(type?.count),
      slots: Math.max(toAmount(type?.slots), 1),
      fixed: false
    }))
    .slice(0, 20);

  return {
    storageTypes: [...fixedTypes, ...customTypes],
    generatedAt: Number.isFinite(Number(value?.generatedAt)) ? Number(value.generatedAt) : null,
    layoutPresetVersion: String(value?.layoutPresetVersion || LAYOUT_PRESET_VERSION),
    layoutStatus: String(value?.layoutStatus || "Ingen layout genereret endnu.").slice(0, 160),
    totalBoxes: toAmount(value?.totalBoxes),
    totalSlots: toAmount(value?.totalSlots),
    recommendedMinSlots: toAmount(value?.recommendedMinSlots || RECOMMENDED_MIN_SLOTS)
  };
}

function sanitizeItem(item, fallbackCategory) {
  const migratedMin = item?.minAmount ?? item?.min ?? item?.minimum ?? item?.limit ?? item?.targetAmount ?? item?.desiredLimit;
  const migratedMax = item?.maxAmount ?? item?.max ?? item?.maximum;
  const rawName = String(item?.name ?? item?.originalName ?? item?.rustName ?? "Item").slice(0, 80);
  const resolved = item?.itemId && itemRegistry.has(item.itemId)
    ? itemRegistry.get(item.itemId)
    : resolveItemName(rawName);
  const itemId = resolved?.id || "";
  const isKnown = Boolean(resolved);
  return {
    id: String(item?.id || newId()),
    itemId,
    name: (resolved?.rustName || rawName || "Item").slice(0, 80),
    originalName: isKnown ? String(item?.originalName || "").slice(0, 80) : String(item?.originalName || rawName || "Item").slice(0, 80),
    category: normalizeCategory(item?.category ?? resolved?.categoryId, fallbackCategory || "other"),
    currentAmount: toAmount(item?.currentAmount ?? item?.current ?? item?.amount),
    minAmount: toAmount(migratedMin),
    maxAmount: toAmount(migratedMax),
    customNote: String(item?.customNote ?? item?.guideNote ?? item?.note ?? "").slice(0, 240)
  };
}

function createStarterState() {
  return { wipeName: "", storageLayout: createDefaultStorageLayout(), boxes: [] };
}

function setFirebaseConfigStatus() {
  if (firebaseConfigured) {
    els.firebaseConfigStatus.textContent = t("firebaseConfigured");
    els.liveHelp.innerHTML = t("liveHelpConfigured");
  } else {
    els.firebaseConfigStatus.textContent = t("firebaseNotConfigured");
    els.liveHelp.innerHTML = t("liveHelp");
  }
}

function setFirebaseStatus(kind, text) {
  els.liveStatus.className = `status-badge ${kind}`;
  els.liveStatus.textContent = text;
}

function updateLastUpdated(updatedAt, updatedBy) {
  lastSeenUpdatedAt = toAmount(updatedAt);
  lastSeenUpdatedBy = updatedBy || "";
  if (!updatedAt) {
    els.lastUpdated.textContent = `${t("lastUpdated")}: —`;
    return;
  }
  const date = new Date(updatedAt);
  const time = Number.isNaN(date.getTime()) ? t("unknownTime") : date.toLocaleTimeString(currentLanguage === "en" ? "en-US" : "da-DK", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  els.lastUpdated.textContent = `${t("lastUpdated")}: ${time}${updatedBy ? ` ${currentLanguage === "en" ? "by" : "af"} ${updatedBy}` : ""}`;
}

function isFirebaseConfigured(config) {
  return Boolean(
    config &&
    typeof config.apiKey === "string" &&
    config.apiKey &&
    !config.apiKey.includes("PASTE") &&
    typeof config.projectId === "string" &&
    config.projectId &&
    !config.projectId.includes("PASTE") &&
    typeof config.databaseURL === "string" &&
    config.databaseURL.startsWith("https://") &&
    !config.databaseURL.includes("PASTE")
  );
}

function cleanGroupCode(value) {
  return normalizeItemKey(value)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);
}

function generateGroupCode() {
  const part = () => Math.random().toString(36).slice(2, 8);
  return `rust-${part()}-${part()}`;
}

function localStateKey(group) {
  return `rust-loot-organizer-live-v2-${group || "local"}`;
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveSettings() {
  localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(appSettings));
}

function updateUrlGroup(group) {
  const url = new URL(location.href);
  url.searchParams.set("group", group);
  history.replaceState(null, "", url.toString());
}

function copyShareLink() {
  const group = cleanGroupCode(els.groupCode.value || activeGroup);
  if (!group) {
    alert(t("groupCodeTooShort"));
    return;
  }
  const url = new URL(location.href);
  url.searchParams.set("group", group);
  copyText(url.toString(), t("shareCopied"));
}

function getPlayerName() {
  return els.playerName.value.trim() || (currentLanguage === "en" ? "Unknown player" : "Ukendt spiller");
}

function copyText(text, successMessage) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => alert(successMessage)).catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  alert(successMessage);
}

function getClientId() {
  if (!appSettings.clientId) {
    appSettings.clientId = newId();
    saveSettings();
  }
  return appSettings.clientId;
}

function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
