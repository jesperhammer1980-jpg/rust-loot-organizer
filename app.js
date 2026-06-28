import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, onValue, set, onDisconnect, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const LOCAL_SETTINGS_KEY = "rust-loot-live-settings-v2";

const categories = [
  "Våben", "Ammo", "Components", "Farm", "Byggeri", "Raid", "Medical/Food",
  "Cards/Fuses", "Tøj/Armor", "Elektronik", "Diverse"
];

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
    items: ["Pistol Bullets", "5.56 Rifle Ammo", "Handmade Shells", "Buckshot", "Arrows", "Gun Powder"],
    notes: "Lav ikke al gunpowder om til ammo. Gem noget til raid/eksplosiver."
  },
  {
    name: "Components",
    category: "Components",
    location: "Loot room - recycle boks",
    items: ["Tech Trash", "Rifle Body", "SMG Body", "Semi-Auto Body", "Metal Spring", "Metal Pipe", "Gears", "Road Signs", "Sheet Metal", "Tarp", "Rope"],
    notes: "Sorter ting der skal researches øverst i boksen."
  },
  {
    name: "Farm",
    category: "Farm",
    location: "Tæt på furnace room",
    items: ["Stone", "Metal Ore", "Sulfur Ore", "Wood", "Charcoal", "High Quality Metal Ore"],
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
  boxGrid: document.getElementById("boxGrid"),
  missingList: document.getElementById("missingList"),
  boxDialog: document.getElementById("boxDialog"),
  boxForm: document.getElementById("boxForm"),
  dialogTitle: document.getElementById("dialogTitle"),
  boxId: document.getElementById("boxId"),
  boxName: document.getElementById("boxName"),
  boxCategory: document.getElementById("boxCategory"),
  boxLocation: document.getElementById("boxLocation"),
  boxItems: document.getElementById("boxItems"),
  boxNotes: document.getElementById("boxNotes"),
  btnAddBox: document.getElementById("btnAddBox"),
  btnDeleteBox: document.getElementById("btnDeleteBox"),
  btnTemplates: document.getElementById("btnTemplates"),
  btnCloseTemplates: document.getElementById("btnCloseTemplates"),
  templatesPanel: document.getElementById("templatesPanel"),
  templateGrid: document.getElementById("templateGrid"),
  btnExport: document.getElementById("btnExport"),
  importFile: document.getElementById("importFile"),
  btnPrint: document.getElementById("btnPrint")
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

let firebaseApp = null;
let auth = null;
let db = null;
let activeGroup = "";
let planRef = null;
let presenceRef = null;
let unlistenPlan = null;
let unlistenPresence = null;
let currentUser = null;

init();

function init() {
  fillCategorySelects();
  renderTemplates();
  bindEvents();

  els.playerName.value = appSettings.playerName || "";
  els.groupCode.value = cleanGroupCode(queryGroup || defaultGroupCode || appSettings.groupCode || "");

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
  els.btnTemplates.addEventListener("click", () => els.templatesPanel.classList.toggle("hidden"));
  els.btnCloseTemplates.addEventListener("click", () => els.templatesPanel.classList.add("hidden"));
  els.btnExport.addEventListener("click", exportData);
  els.importFile.addEventListener("change", importData);
  els.btnPrint.addEventListener("click", () => window.print());

  els.boxForm.addEventListener("submit", event => {
    event.preventDefault();
    saveBoxFromDialog();
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
  renderStats();
  renderMissingList();
  renderBoxes();
}

function renderStats() {
  const allItems = state.boxes.flatMap(box => box.items || []);
  const missing = allItems.filter(item => item.missing).length;
  els.statBoxes.textContent = state.boxes.length;
  els.statItems.textContent = allItems.length;
  els.statMissing.textContent = missing;
}

function renderMissingList() {
  const missing = state.boxes.flatMap(box => (box.items || [])
    .filter(item => item.missing)
    .map(item => ({ ...item, boxName: box.name, boxId: box.id }))
  );

  if (!missing.length) {
    els.missingList.innerHTML = `<li>Ingen mangler markeret endnu.<small>Fjern flueben ved et item for at markere det som mangler.</small></li>`;
    return;
  }

  els.missingList.innerHTML = missing.map(item => `
    <li>
      ${escapeHtml(item.name)}
      <small>${escapeHtml(item.boxName)}</small>
    </li>
  `).join("");
}

function renderBoxes() {
  const filtered = state.boxes.filter(box => {
    const categoryOk = currentCategory === "all" || box.category === currentCategory;
    const haystack = [box.name, box.category, box.location, box.notes, ...(box.items || []).map(i => i.name)].join(" ").toLowerCase();
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
    <article class="panel loot-box" data-box-id="${box.id}">
      <header>
        <div>
          <h3>${escapeHtml(box.name)}</h3>
          <div class="location">${escapeHtml(box.location || "Ingen placering angivet")}</div>
        </div>
        <span class="category-pill">${escapeHtml(box.category)}</span>
      </header>

      <ul class="item-list">
        ${(box.items || []).map(item => `
          <li>
            <input type="checkbox" ${item.missing ? "" : "checked"} data-item-id="${item.id}" aria-label="${escapeHtml(item.name)}" />
            <span class="${item.missing ? "missing" : ""}">${escapeHtml(item.name)}</span>
          </li>
        `).join("") || `<li>Ingen items endnu</li>`}
      </ul>

      ${box.notes ? `<div class="notes">${escapeHtml(box.notes)}</div>` : ""}

      <div class="box-actions">
        <button class="ghost" data-edit-box="${box.id}">Rediger</button>
        <button class="ghost" data-copy-box="${box.id}">Kopiér liste</button>
      </div>
    </article>
  `).join("");

  els.boxGrid.querySelectorAll("[data-edit-box]").forEach(btn => btn.addEventListener("click", () => openBoxDialog(btn.dataset.editBox)));
  els.boxGrid.querySelectorAll("[data-copy-box]").forEach(btn => btn.addEventListener("click", () => copyBoxList(btn.dataset.copyBox)));
  els.boxGrid.querySelectorAll("input[type='checkbox'][data-item-id]").forEach(input => {
    input.addEventListener("change", () => toggleItemMissing(input.closest(".loot-box").dataset.boxId, input.dataset.itemId, !input.checked));
  });
}

function openBoxDialog(id = null) {
  const box = id ? state.boxes.find(b => b.id === id) : null;
  els.dialogTitle.textContent = box ? "Rediger boks" : "Ny boks";
  els.boxId.value = box?.id ?? "";
  els.boxName.value = box?.name ?? "";
  els.boxCategory.value = box?.category ?? categories[0];
  els.boxLocation.value = box?.location ?? "";
  els.boxItems.value = box ? (box.items || []).map(item => item.missing ? `[mangler] ${item.name}` : item.name).join("\n") : "";
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
    .map(line => {
      const missing = /^\[mangler\]/i.test(line);
      const name = line.replace(/^\[mangler\]\s*/i, "").trim();
      const oldItem = oldBox?.items?.find(item => item.name.toLowerCase() === name.toLowerCase());
      return { id: oldItem?.id ?? newId(), name, missing: oldItem?.missing ?? missing };
    });

  const box = {
    id,
    name: els.boxName.value.trim(),
    category: els.boxCategory.value,
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
    location: template.location,
    items: template.items.map(item => ({ id: newId(), name: item, missing: true })),
    notes: template.notes
  });
  saveState();
  render();
}

function toggleItemMissing(boxId, itemId, missing) {
  state.boxes = state.boxes.map(box => {
    if (box.id !== boxId) return box;
    return {
      ...box,
      items: (box.items || []).map(item => item.id === itemId ? { ...item, missing } : item)
    };
  });
  saveState();
  renderStats();
  renderMissingList();
  renderBoxes();
}

function copyBoxList(boxId) {
  const box = state.boxes.find(b => b.id === boxId);
  if (!box) return;
  const text = `${box.name}\n${(box.items || []).map(i => `- ${i.name}${i.missing ? " (mangler)" : ""}`).join("\n")}`;
  copyText(text, "Listen er kopieret.");
}

function exportData() {
  const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString(), groupCode: activeGroup || null }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rust-loot-plan-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.boxes)) throw new Error("Ugyldigt format");
      state = sanitizeState({ wipeName: imported.wipeName ?? "", boxes: imported.boxes });
      saveState();
      render();
      alert("Plan importeret." + (activeGroup ? " Den bliver nu sendt live til gruppen." : ""));
    } catch (error) {
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
      auth = getAuth(firebaseApp);
      db = getDatabase(firebaseApp);
    }

    onAuthStateChanged(auth, user => {
      currentUser = user;
      if (user && activeGroup) setupPresence();
    });

    await signInAnonymously(auth);
    planRef = ref(db, `plans/${activeGroup}`);

    if (unlistenPlan) unlistenPlan();
    unlistenPlan = onValue(planRef, snapshot => {
      const value = snapshot.val();
      if (!value) {
        pushStateNow();
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
      console.error(error);
      setFirebaseStatus("offline", "Live fejl / permission denied");
      alert("Kunne ikke læse live-planen. Tjek Firebase rules og gruppe-kode.");
    });

    setupPresence();
  } catch (error) {
    console.error(error);
    setFirebaseStatus("offline", "Kunne ikke forbinde");
    alert("Kunne ikke forbinde til Firebase. Tjek firebase-config.js og om Anonymous Authentication + Realtime Database er slået til.");
  }
}

function setupPresence() {
  if (!db || !currentUser || !activeGroup) return;

  presenceRef = ref(db, `presence/${activeGroup}/${currentUser.uid}`);
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
    updatedAt: serverTimestamp()
  }).catch(error => console.warn("Presence kunne ikke opdateres", error));
}

function saveState() {
  state = sanitizeState(state);
  localStorage.setItem(localStateKey(activeGroup || "local"), JSON.stringify(state));
  if (activeGroup && planRef && !applyingRemote) queueRemoteSave();
}

function queueRemoteSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(pushStateNow, 350);
}

function pushStateNow() {
  if (!planRef) return;
  const payload = {
    wipeName: state.wipeName || "",
    boxes: state.boxes || [],
    updatedAt: Date.now(),
    updatedBy: getPlayerName()
  };
  set(planRef, payload).catch(error => {
    console.error(error);
    setFirebaseStatus("offline", "Kunne ikke gemme live");
  });
}

function loadState(group) {
  try {
    const groupSaved = localStorage.getItem(localStateKey(group));
    if (groupSaved) return sanitizeState(JSON.parse(groupSaved));
    const oldSaved = localStorage.getItem("rust-loot-organizer-v1");
    if (oldSaved) return sanitizeState(JSON.parse(oldSaved));
  } catch (error) {
    console.warn("Kunne ikke læse gemt data", error);
  }
  return { wipeName: "", boxes: [] };
}

function sanitizeState(value) {
  const boxes = Array.isArray(value?.boxes) ? value.boxes : [];
  return {
    wipeName: typeof value?.wipeName === "string" ? value.wipeName : "",
    boxes: boxes.map(box => ({
      id: String(box.id || newId()),
      name: String(box.name || "Unavngivet boks").slice(0, 80),
      category: categories.includes(box.category) ? box.category : "Diverse",
      location: String(box.location || "").slice(0, 140),
      notes: String(box.notes || "").slice(0, 1000),
      items: Array.isArray(box.items) ? box.items.map(item => ({
        id: String(item.id || newId()),
        name: String(item.name || "Item").slice(0, 80),
        missing: Boolean(item.missing)
      })).slice(0, 80) : []
    })).slice(0, 80)
  };
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
