import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const LOCAL_SETTINGS_KEY = "rust-loot-live-settings-v2";
const APP_VERSION = "v0.9-test";
const LAYOUT_PRESET_VERSION = "v0.8";
const RECOMMENDED_MIN_SLOTS = 360;

const categories = [
  "Våben", "Ammo", "Components", "Farm", "Byggeri", "Raid", "Medical/Food",
  "Cards/Fuses", "Tøj/Armor", "Elektronik", "Diverse"
];

const DEFAULT_TEMPLATE_MIN = 1;
const DEFAULT_TEMPLATE_MAX = 0;
const DEFAULT_STACK_SIZE = 100;

const defaultStorageTypes = [
  { id: "large-box", label: "Stor boks", name: "Large Box", count: 0, slots: 48, fixed: true },
  { id: "small-box", label: "Lille boks", name: "Small Box", count: 0, slots: 18, fixed: true },
  { id: "locker", label: "Locker", name: "Locker", count: 0, slots: 36, fixed: true },
  { id: "fridge", label: "Køleskab", name: "Fridge", count: 0, slots: 42, fixed: true },
  { id: "tool-cupboard", label: "TC", name: "Tool Cupboard", count: 0, slots: 24, fixed: true },
  { id: "drop-box", label: "Drop box", name: "Drop Box", count: 0, slots: 12, fixed: true },
  { id: "vending-machine", label: "Vending machine", name: "Vending Machine", count: 0, slots: 30, fixed: true }
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

let firebaseApp = null;
let db = null;
let activeGroup = "";
let planRef = null;
let presenceRef = null;
let unlistenPlan = null;
let unlistenPresence = null;

init();

function init() {
  fillCategorySelects();
  fillBoxTypeControls();
  fillItemDatalist();
  renderTemplates();
  bindEvents();

  if (els.versionLabel) {
    els.versionLabel.textContent = `Rust Loot Organizer — ${APP_VERSION}`;
  }

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
    currentSearch = els.searchInput.value.trim().toLowerCase();
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

function fillCategorySelects() {
  els.filterCategory.innerHTML = `<option value="all">Alle kategorier</option>` + categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  els.boxCategory.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
}

function fillBoxTypeControls() {
  const options = getBoxTypeOptions();
  const html = options.map(type => `<option value="${escapeHtml(type.id)}">${escapeHtml(type.label)} / ${escapeHtml(type.name)} / ${type.slots} slots</option>`).join("")
    + `<option value="custom">Custom</option>`;
  els.manualBoxType.innerHTML = html;
  els.boxType.innerHTML = html;
  syncManualCustomFields();
  syncDialogBoxTypeFields();
}

function fillItemDatalist() {
  els.itemOptions.innerHTML = commonItemCatalog
    .map(item => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.category)}</option>`)
    .join("");
}

function renderTemplates() {
  els.templateGrid.innerHTML = defaultTemplates.map((template, index) => `
    <article class="template-card">
      <strong>${escapeHtml(template.name)}</strong>
      <p>${escapeHtml(template.items.slice(0, 4).join(", "))}${template.items.length > 4 ? "..." : ""}</p>
      <button class="secondary" data-template-index="${index}">Tilføj</button>
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
      <span>Box type</span>
      <span>Antal</span>
      <span>Kapacitet / slots</span>
      <span>Total slots</span>
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

  const balanceLabel = summary.missingSlots > 0 ? "Mangler slots" : "Ekstra slots";
  const balanceValue = summary.missingSlots > 0 ? summary.missingSlots : summary.extraSlots;
  const balanceClass = summary.missingSlots > 0 ? "warning" : "ok";
  els.storageSummary.innerHTML = `
    <article><span>Total bokse</span><strong>${summary.totalBoxes}</strong></article>
    <article><span>Total slots</span><strong>${summary.totalSlots}</strong></article>
    <article><span>Anbefalet minimum slots</span><strong>${RECOMMENDED_MIN_SLOTS}</strong></article>
    <article class="${balanceClass}"><span>${balanceLabel}</span><strong>${balanceValue}</strong></article>
  `;

  const status = storage.layoutStatus || getLayoutStatus(summary).label;
  els.layoutStatus.textContent = storage.generatedAt
    ? `${status} · genereret ${formatDateTime(storage.generatedAt)}`
    : status;
}

function renderStorageRow(type) {
  const total = toAmount(type.count) * toAmount(type.slots);
  const nameInput = type.fixed
    ? `<strong>${escapeHtml(type.label)}</strong><small>${escapeHtml(type.name)}</small>`
    : `<input type="text" value="${escapeHtml(type.label || type.name || "")}" data-storage-id="${escapeHtml(type.id)}" data-storage-field="label" aria-label="Box type" />`;

  return `
    <div class="storage-row" data-storage-id="${escapeHtml(type.id)}">
      <div class="storage-name">${nameInput}</div>
      <input type="number" min="0" step="1" inputmode="numeric" value="${toAmount(type.count)}" data-storage-id="${escapeHtml(type.id)}" data-storage-field="count" aria-label="Antal ${escapeHtml(type.label)}" />
      <input type="number" min="1" step="1" inputmode="numeric" value="${toAmount(type.slots)}" data-storage-id="${escapeHtml(type.id)}" data-storage-field="slots" aria-label="Slots ${escapeHtml(type.label)}" ${type.fixed ? "readonly" : ""} />
      <strong>${total}</strong>
      ${type.fixed ? `<span class="storage-fixed">Primær</span>` : `<button class="ghost storage-remove" type="button" data-remove-storage="${escapeHtml(type.id)}">Fjern</button>`}
    </div>
  `;
}

function createManualBoxes() {
  const count = Math.max(toAmount(els.manualBoxCount.value), 1);
  const selectedType = getSelectedManualBoxType();
  const prefix = (els.manualBoxPrefix.value.trim() || selectedType.label || "Boks").slice(0, 60);
  const boxes = Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    return {
      id: newId(),
      name: `${prefix} ${number}`.trim(),
      category: "Diverse",
      boxType: selectedType.label,
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
    return {
      id: "custom",
      label: (els.manualCustomType.value.trim() || "Custom").slice(0, 60),
      name: "Custom",
      slots: Math.max(toAmount(els.manualCustomSlots.value), 1)
    };
  }
  return getBoxTypeById(selectedId) || getBoxTypeOptions()[0];
}

function syncManualCustomFields() {
  const isCustom = els.manualBoxType.value === "custom";
  document.querySelectorAll(".manual-custom-field").forEach(field => field.classList.toggle("hidden", !isCustom));
  const selectedType = getBoxTypeById(els.manualBoxType.value);
  if (selectedType && els.manualBoxPrefix.value.trim() === "") {
    els.manualBoxPrefix.placeholder = `Fx ${selectedType.label}`;
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
    const clear = confirm("Dette rydder det nuværende layout. Vil du fortsætte?");
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
    alert("Tilføj mindst én storage box før layout genereres.");
    return;
  }

  if (state.boxes.length) {
    const replace = confirm("Dette erstatter det nuværende layout. Vil du fortsætte?");
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
  const role = recipe.role || "Primær";
  return {
    id: newId(),
    name: recipe.name,
    category: normalizeCategory(recipe.category, "Diverse"),
    boxType: assignedStorage?.baseLabel || "Custom",
    slots: assignedStorage?.slots || 48,
    location: assignedStorage ? `${assignedStorage.label} · ${assignedStorage.slots} slots · ${role}` : role,
    items: recipe.items.map(itemName => createGeneratedItem(itemName, recipe.category)),
    notes: `Genereret layout (${role}). ${assignedStorage ? `Planlagt i ${assignedStorage.label}.` : ""}`
  };
}

function createGeneratedItem(itemName, category) {
  const range = getDefaultRange(itemName);
  return {
    id: newId(),
    name: itemName,
    category: normalizeCategory(getItemGuide(itemName).category, category || "Diverse"),
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
    els.missingList.innerHTML = `<li class="todo-empty">Ingen mangler lige nu.<small>Alle items er over min, og intet er over max.</small></li>`;
    return;
  }

  const missingHtml = missing.map(item => renderTodoItem(item)).join("");
  const overMaxHtml = overMax.map(item => `
    <li class="todo-overmax">
      <strong>${escapeHtml(item.name)} — ${toAmount(item.currentAmount)} / max ${toAmount(item.maxAmount)}</strong>
      <small>Box: ${escapeHtml(item.boxName)} — over max med ${item.overMaxAmount}</small>
      <button class="ghost todo-action" type="button" data-jump-box="${escapeHtml(item.boxId)}" data-jump-item="${escapeHtml(item.id)}">Hop til box</button>
    </li>
  `).join("");

  els.missingList.innerHTML = `
    ${missingHtml}
    ${overMaxHtml ? `<li class="todo-section-label">Over max</li>${overMaxHtml}` : ""}
  `;

  els.missingList.querySelectorAll("[data-jump-box]").forEach(button => {
    button.addEventListener("click", () => jumpToBox(button.dataset.jumpBox, button.dataset.jumpItem));
  });
  els.missingList.querySelectorAll("[data-toggle-guide]").forEach(button => {
    button.addEventListener("click", () => toggleGuide(button.dataset.toggleGuide));
  });
}

function renderTodoItem(item) {
  const guide = getItemGuide(item.name);
  const guideId = `guide-${item.boxId}-${item.id}`;
  const riskClass = `risk-${normalizeRiskClass(guide.riskLevel)}`;

  return `
    <li class="todo-item">
      <div class="todo-topline">
        <strong>${escapeHtml(item.name)} — Mangler til min: ${item.missingToMin}</strong>
        <span class="risk-badge ${riskClass}">Risiko: ${escapeHtml(guide.riskLevel)}</span>
      </div>
      <small>Box: ${escapeHtml(item.boxName)} · ${escapeHtml(item.category)} · Nuværende ${toAmount(item.currentAmount)} / Min ${toAmount(item.minAmount)} / Max ${formatMaxAmount(item.maxAmount)}</small>
      <div class="todo-actions">
        <button class="ghost todo-action" type="button" data-jump-box="${escapeHtml(item.boxId)}" data-jump-item="${escapeHtml(item.id)}">Hop til box</button>
        <button class="ghost todo-action" type="button" data-toggle-guide="${escapeHtml(guideId)}">Vis guide</button>
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
      <div><dt>Findes lettest</dt><dd>${escapeHtml(guide.bestSource)}</dd></div>
      <div><dt>Alternativer</dt><dd>${escapeHtml(guide.alternativeSources)}</dd></div>
      <div><dt>Tip</dt><dd>${escapeHtml(guide.tip)}</dd></div>
      <div><dt>Risiko</dt><dd>${escapeHtml(guide.riskLevel)}</dd></div>
      ${guide.monuments ? `<div><dt>Monuments</dt><dd>${escapeHtml(guide.monuments)}</dd></div>` : ""}
      ${guide.requirements ? `<div><dt>Krav</dt><dd>${escapeHtml(guide.requirements)}</dd></div>` : ""}
      ${customNote ? `<div><dt>Egen note</dt><dd>${escapeHtml(customNote)}</dd></div>` : ""}
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
  button.textContent = isHidden ? "Vis guide" : "Skjul guide";
}

function getItemGuide(itemName) {
  return itemGuides.get(normalizeItemKey(itemName)) || {
    category: "Diverse",
    bestSource: "Ingen guide endnu",
    alternativeSources: "Tilføj itemet til guide-listen i app.js",
    tip: "Tilføj itemet til guide-listen i app.js",
    riskLevel: "Ukendt"
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
    const categoryOk = currentCategory === "all" || box.category === currentCategory;
    const haystack = [
      box.name,
      box.category,
      box.boxType,
      box.location,
      box.notes,
      ...(box.items || []).flatMap(item => [
        item.name,
        item.category,
        item.customNote,
        getGuideSearchText(item.name)
      ])
    ].join(" ").toLowerCase();
    const searchOk = !currentSearch || haystack.includes(currentSearch);
    return categoryOk && searchOk;
  });

  if (!state.boxes.length) {
    els.boxGrid.innerHTML = `
      <div class="panel empty-state">
        <h2>Ingen bokse endnu</h2>
        <p>Tryk “Indsæt standard setup” eller “Ny boks” for at starte jeres loot-plan.</p>
      </div>
    `;
    return;
  }

  if (!filtered.length) {
    els.boxGrid.innerHTML = `<div class="panel empty-state">Ingen bokse matcher din søgning.</div>`;
    return;
  }

  els.boxGrid.innerHTML = filtered.map(box => `
    <article class="panel loot-box" data-box-id="${escapeHtml(box.id)}" id="box-${escapeHtml(box.id)}">
      <header>
        <div>
          <h3>${escapeHtml(box.name)}</h3>
          <div class="location">${escapeHtml(box.location || "Ingen placering angivet")}</div>
          ${renderBoxCapacity(box)}
        </div>
        <span class="category-pill">${escapeHtml(box.category)}</span>
      </header>

      <ul class="item-list">
        ${(box.items || []).map(item => renderItemRow(item, box)).join("") || `<li class="empty-item">Ingen items endnu</li>`}
      </ul>

      ${renderAddItemForm(box)}

      ${box.notes ? `<div class="notes">${escapeHtml(box.notes)}</div>` : ""}

      <div class="box-actions">
        <button class="ghost" data-edit-box="${box.id}">Rediger</button>
        <button class="ghost" data-copy-box="${box.id}">Kopiér liste</button>
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
    input.addEventListener("input", () => applyItemDefaultsToForm(input.closest(".manual-add-item"), input.value));
    input.addEventListener("change", () => applyItemDefaultsToForm(input.closest(".manual-add-item"), input.value));
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

function renderItemRow(item, box) {
  const currentAmount = toAmount(item.currentAmount);
  const minAmount = toAmount(item.minAmount);
  const maxAmount = toAmount(item.maxAmount);
  const missingToMin = getMissingToMin(item);
  const status = getItemStatus(item);
  const guide = getItemGuide(item.name);

  return `
    <li class="item-row ${status.className}" data-item-id="${escapeHtml(item.id)}">
      <div class="item-main">
        <span class="item-name">${escapeHtml(item.name)}</span>
        <span class="item-category">${escapeHtml(item.category || box.category)}</span>
      </div>
      <div class="item-quantity-grid">
        <label>
          <span>Nuværende</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${currentAmount}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-quantity-field="currentAmount" aria-label="Nuværende for ${escapeHtml(item.name)}" />
        </label>
        <label>
          <span>Min</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${minAmount}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-quantity-field="minAmount" aria-label="Min for ${escapeHtml(item.name)}" />
        </label>
        <label>
          <span>Max</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${maxAmount}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-quantity-field="maxAmount" aria-label="Max for ${escapeHtml(item.name)}" />
        </label>
        <span class="missing-badge ${status.badgeClass}">
          <span>${escapeHtml(status.label)}</span>
          <strong>${missingToMin}</strong>
          <em>Mangler til min</em>
        </span>
      </div>
      <label class="item-note">
        <span>Egen note</span>
        <input type="text" value="${escapeHtml(item.customNote || "")}" placeholder="Server-note, fx køb ved Outpost" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-note-field="customNote" aria-label="Egen note for ${escapeHtml(item.name)}" />
      </label>
      <label class="item-category-edit">
        <span>Vælg kategori</span>
        <select data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-item-meta-field="category" aria-label="Kategori for ${escapeHtml(item.name)}">
          ${renderCategoryOptions(item.category || box.category)}
        </select>
      </label>
      <div class="item-guide-line">Findes lettest: ${escapeHtml(guide.bestSource)} · Tip: ${escapeHtml(guide.tip)}</div>
      <div class="item-actions">
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-adjust-item="-1">-1</button>
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-adjust-item="1">+1</button>
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-adjust-item="stack">+ stack</button>
        <button class="ghost qty-btn" type="button" data-edit-box="${escapeHtml(box.id)}">Ret</button>
        <label class="move-target">
          <span>Flyt til anden boks</span>
          <select data-move-target="${escapeHtml(item.id)}" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}">
            ${renderMoveBoxOptions(box.id)}
          </select>
        </label>
        <button class="ghost qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-move-item="true">Flyt</button>
        <button class="danger qty-btn" type="button" data-box-id="${escapeHtml(box.id)}" data-item-id="${escapeHtml(item.id)}" data-remove-item="true">Fjern</button>
      </div>
    </li>
  `;
}

function renderBoxCapacity(box) {
  const usedLines = (box.items || []).length;
  const slots = getBoxSlots(box);
  const overCapacity = slots > 0 && usedLines > slots;
  const label = `${getBoxTypeLabel(box)} — ${usedLines}/${slots} linjer`;
  return `<div class="box-capacity ${overCapacity ? "over-capacity" : ""}">${escapeHtml(label)}${overCapacity ? ` <strong>Over kapacitet</strong>` : ""}</div>`;
}

function renderAddItemForm(box) {
  return `
    <form class="manual-add-item" data-add-box-id="${escapeHtml(box.id)}">
      <div class="manual-add-heading">
        <strong>Tilføj item</strong>
        <small>Vælg item fra dropdown eller skriv selv.</small>
      </div>
      <label>
        <span>Vælg item</span>
        <input type="text" list="itemOptions" data-add-item-name="${escapeHtml(box.id)}" placeholder="Fx Pistol Bullets" autocomplete="off" />
      </label>
      <label>
        <span>Vælg kategori</span>
        <select data-add-field="category">${renderCategoryOptions(box.category)}</select>
      </label>
      <label>
        <span>Nuværende</span>
        <input type="number" min="0" step="1" inputmode="numeric" value="0" data-add-field="currentAmount" />
      </label>
      <label>
        <span>Min</span>
        <input type="number" min="0" step="1" inputmode="numeric" value="0" data-add-field="minAmount" />
      </label>
      <label>
        <span>Max</span>
        <input type="number" min="0" step="1" inputmode="numeric" value="0" data-add-field="maxAmount" />
      </label>
      <label class="manual-note">
        <span>Egen note</span>
        <input type="text" data-add-field="customNote" placeholder="Server-note" />
      </label>
      <button class="secondary" type="submit">Tilføj</button>
    </form>
  `;
}

function renderCategoryOptions(selectedCategory) {
  const selected = normalizeCategory(selectedCategory, "Diverse");
  return categories.map(category => `<option value="${escapeHtml(category)}" ${category === selected ? "selected" : ""}>${escapeHtml(category)}</option>`).join("");
}

function renderMoveBoxOptions(currentBoxId) {
  return state.boxes.map(box => `<option value="${escapeHtml(box.id)}" ${box.id === currentBoxId ? "selected" : ""}>${escapeHtml(box.name)}</option>`).join("");
}

function openBoxDialog(id = null) {
  const box = id ? state.boxes.find(b => b.id === id) : null;
  els.dialogTitle.textContent = box ? "Rediger boks" : "Ny boks";
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
    category: els.boxCategory.value,
    boxType: selectedBoxType.label,
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
    category: template.category,
    boxType: "Stor boks",
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
      ? normalizeCategory(value, "Diverse")
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
    alert("Vælg item først.");
    return;
  }

  const category = normalizeCategory(form.querySelector('[data-add-field="category"]')?.value, getSuggestedCategory(itemName));
  const item = {
    id: newId(),
    name: itemName.slice(0, 80),
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

function applyItemDefaultsToForm(form, itemName) {
  if (!form || !itemName) return;
  const exactItem = itemCatalog.get(normalizeItemKey(itemName));
  if (!exactItem && !defaultItemRanges.has(normalizeItemKey(itemName))) return;
  const categoryInput = form.querySelector('[data-add-field="category"]');
  const minInput = form.querySelector('[data-add-field="minAmount"]');
  const maxInput = form.querySelector('[data-add-field="maxAmount"]');
  const range = getDefaultRange(itemName);
  if (categoryInput) categoryInput.value = getSuggestedCategory(itemName);
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
  if (!confirm(`Fjern "${item.name}" fra boksen?`)) return;
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
        const delta = adjustment === "stack" ? getStackSize(item.name) : Number(adjustment);
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
    const customNote = i.customNote ? ` - Egen note: ${i.customNote}` : "";
    return `- ${i.name} (${i.category}) - Nuværende ${toAmount(i.currentAmount)} / Min ${toAmount(i.minAmount)} / Max ${formatMaxAmount(i.maxAmount)} - ${status}${missingToMin > 0 ? `, mangler ${missingToMin} til min` : ""}${customNote}`;
  }).join("\n")}`;
  copyText(text, "Listen er kopieret.");
}

function parseItemLine(line, oldBox, fallbackCategory) {
  const cleanLine = line.replace(/^\[mangler\]\s*/i, "").trim();
  const parts = cleanLine.split("|").map(part => part.trim());
  const name = parts[0];
  if (!name) return null;

  const oldItem = oldBox?.items?.find(item => item.name.toLowerCase() === name.toLowerCase());
  let category = oldItem?.category || fallbackCategory || "Diverse";
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

    if (categories.includes(part)) {
      category = part;
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
    name,
    category: normalizeCategory(category, fallbackCategory || "Diverse"),
    currentAmount: toAmount(currentAmount),
    minAmount: toAmount(minAmount),
    maxAmount: toAmount(maxAmount),
    customNote: String(customNote || "").slice(0, 240)
  };
}

function formatItemLine(item, fallbackCategory) {
  const category = normalizeCategory(item.category, fallbackCategory || "Diverse");
  const note = item.customNote ? ` | Egen note ${item.customNote}` : "";
  return `${item.name} | ${category} | Nuværende ${toAmount(item.currentAmount)} | Min ${toAmount(item.minAmount)} | Max ${toAmount(item.maxAmount)}${note}`;
}

function createTemplateItem(itemName, category) {
  const range = getDefaultRange(itemName);
  return {
    id: newId(),
    name: itemName,
    category,
    currentAmount: 0,
    minAmount: range.minAmount,
    maxAmount: range.maxAmount,
    customNote: ""
  };
}

function getDefaultRange(itemName) {
  return defaultItemRanges.get(normalizeItemKey(itemName)) || {
    minAmount: DEFAULT_TEMPLATE_MIN,
    maxAmount: DEFAULT_TEMPLATE_MAX
  };
}

function getStackSize(itemName) {
  return stackSizes.get(normalizeItemKey(itemName)) ?? DEFAULT_STACK_SIZE;
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
    return { label: "Under min", className: "is-under-min", badgeClass: "warning" };
  }
  if (getOverMaxAmount(item) > 0) {
    return { label: "Over max", className: "is-over-max", badgeClass: "danger" };
  }
  return { label: "OK", className: "is-ok", badgeClass: "ok" };
}

function formatMaxAmount(value) {
  const amount = toAmount(value);
  return amount ? String(amount) : "Ingen max";
}

function parseLabeledValue(part) {
  const raw = String(part || "").trim();
  const lower = raw.toLowerCase();
  const multiWordLabels = [
    ["egen note", "customNote"],
    ["custom note", "customNote"],
    ["mangler til min", "minAmount"]
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

function getGuideSearchText(itemName) {
  const guide = getItemGuide(itemName);
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
    label: type.label || type.name || "Custom box",
    baseLabel: type.label || type.name || "Custom box",
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
  if (Number.isNaN(date.getTime())) return "ukendt tidspunkt";
  return date.toLocaleString("da-DK", {
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
    normalizeItemKey(type.name) === normalized ||
    normalizeItemKey(type.id) === normalized
  );
}

function sanitizeBoxTypeLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "Custom";
  const type = getBoxTypeByLabel(raw);
  return type?.label || raw.slice(0, 60);
}

function getBoxTypeSlots(label) {
  return getBoxTypeByLabel(label)?.slots || 48;
}

function getBoxSlots(box) {
  return Math.max(toAmount(box?.slots ?? getBoxTypeSlots(box?.boxType)), 1);
}

function getBoxTypeLabel(box) {
  return sanitizeBoxTypeLabel(box?.boxType || "Custom");
}

function getSuggestedCategory(itemName) {
  const key = normalizeItemKey(itemName);
  const catalogItem = itemCatalog.get(key);
  const guide = itemGuides.get(key);
  return normalizeCategory(catalogItem?.category || guide?.category, "Diverse");
}

function getSelectedDialogBoxType() {
  if (els.boxType.value === "custom") {
    return {
      label: (els.boxCustomType.value.trim() || "Custom").slice(0, 60),
      slots: Math.max(toAmount(els.boxSlots.value), 1)
    };
  }
  const selectedType = getBoxTypeById(els.boxType.value) || getBoxTypeOptions()[0];
  return {
    label: selectedType.label,
    slots: Math.max(toAmount(els.boxSlots.value || selectedType.slots), 1)
  };
}

function setDialogBoxType(box) {
  const boxType = sanitizeBoxTypeLabel(box?.boxType || "Stor boks");
  const matchedType = getBoxTypeByLabel(boxType);
  els.boxType.value = matchedType?.id || "custom";
  els.boxCustomType.value = matchedType ? "" : boxType;
  els.boxSlots.value = Math.max(toAmount(box?.slots ?? matchedType?.slots ?? 48), 1);
  syncDialogBoxTypeFields();
}

function normalizeCategory(value, fallback = "Diverse") {
  return categories.includes(value) ? value : fallback;
}

function normalizeItemKey(value) {
  return String(value || "").trim().toLowerCase();
}

function exportData() {
  const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString(), groupCode: activeGroup || null }, null, 2)], { type: "application/json" });
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
      if (!Array.isArray(imported.boxes)) throw new Error("Ugyldigt format");
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
      alert("Plan importeret." + (activeGroup ? " Den bliver nu sendt live til gruppen." : ""));
    } catch (error) {
      console.error("Kunne ikke importere loot-plan", error);
      alert("Kunne ikke importere filen. Tjek at det er en eksport fra Loot Organizer.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

async function connectLive() {
  if (!firebaseConfigured) {
    alert("Firebase er ikke konfigureret endnu. Udfyld firebase-config.js først.");
    setFirebaseStatus("offline", "Mangler Firebase config");
    return;
  }

  const group = cleanGroupCode(els.groupCode.value);
  if (group.length < 6) {
    alert("Lav en gruppe-kode på mindst 6 tegn. Brug fx knappen ‘Generér kode’. Del kun koden med jeres gruppe.");
    return;
  }

  activeGroup = group;
  appSettings.groupCode = group;
  appSettings.playerName = els.playerName.value.trim();
  saveSettings();
  updateUrlGroup(group);

  setFirebaseStatus("connecting", "Forbinder...");

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

      setFirebaseStatus("online", `Live: ${activeGroup}`);
      updateLastUpdated(value.updatedAt, value.updatedBy);
    }, error => {
      console.error("Kunne ikke læse live-plan fra Firebase", { group: activeGroup, error });
      setFirebaseStatus("offline", "Live fejl / permission denied");
      alert("Kunne ikke læse live-planen. Tjek Firebase rules og gruppe-kode.");
    });

    setupPresence();
  } catch (error) {
    console.error("Kunne ikke forbinde til Firebase", { group: activeGroup, error });
    const code = error?.code ? ` (${error.code})` : "";
    setFirebaseStatus("offline", `Kunne ikke forbinde${code}`);
    alert("Kunne ikke forbinde til Firebase. Tjek firebase-config.js, databaseURL og at Realtime Database Rules fra v5 er publish’et.");
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
    els.userCount.textContent = `Brugere: ${Object.keys(users).length}`;
  });
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
    version: 9
  };

  try {
    await set(planRef, payload);
    if (lastLocalChangeAt <= payload.updatedAt) {
      lastLocalChangeAt = 0;
    }
    setFirebaseStatus("online", `Live: ${activeGroup}`);
    updateLastUpdated(payload.updatedAt, payload.updatedBy);
  } catch (error) {
    console.error("Kunne ikke gemme live", error);
    const code = error?.code ? ` (${error.code})` : "";
    const message = error?.message ? `: ${error.message}` : "";
    setFirebaseStatus("offline", `Kunne ikke gemme live${code}`);
    alert(`Kunne ikke gemme live${code}${message}\n\nHvis fejlen er PERMISSION_DENIED, er Firebase Rules ikke publish'et eller for stramme.`);
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
  const category = normalizeCategory(box?.category, "Diverse");
  const boxType = sanitizeBoxTypeLabel(box?.boxType ?? box?.type ?? box?.storageType);
  return {
    id: String(box?.id || newId()),
    name: String(box?.name || "Unavngivet boks").slice(0, 80),
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
  return {
    id: String(item?.id || newId()),
    name: String(item?.name || "Item").slice(0, 80),
    category: normalizeCategory(item?.category, fallbackCategory || "Diverse"),
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
    els.firebaseConfigStatus.textContent = "Firebase: konfigureret";
    els.liveHelp.innerHTML = "Vælg/generér en gruppe-kode. Alle med samme kode ser samme loot-plan live.";
  } else {
    els.firebaseConfigStatus.textContent = "Firebase: ikke konfigureret";
    els.liveHelp.innerHTML = "Appen virker lokalt nu. Udfyld <code>firebase-config.js</code> for rigtig fælles live-plan.";
  }
}

function setFirebaseStatus(kind, text) {
  els.liveStatus.className = `status-badge ${kind}`;
  els.liveStatus.textContent = text;
}

function updateLastUpdated(updatedAt, updatedBy) {
  if (!updatedAt) {
    els.lastUpdated.textContent = "Sidst opdateret: —";
    return;
  }
  const date = new Date(updatedAt);
  const time = Number.isNaN(date.getTime()) ? "ukendt" : date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  els.lastUpdated.textContent = `Sidst opdateret: ${time}${updatedBy ? ` af ${updatedBy}` : ""}`;
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
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
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
    alert("Vælg eller generér en gruppe-kode først.");
    return;
  }
  const url = new URL(location.href);
  url.searchParams.set("group", group);
  copyText(url.toString(), "Link kopieret. Send det til gruppen.");
}

function getPlayerName() {
  return els.playerName.value.trim() || "Ukendt spiller";
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
