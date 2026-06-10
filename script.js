// =========================
// ELEMENTOS
// =========================

const tonicCard =
  document.getElementById("tonic-card");

const scheduleCard =
  document.getElementById("schedule-card");

const oilingCard =
  document.getElementById("oiling-card");

const birthControlCard =
  document.getElementById("birth-control-card");

const nextStep =
  document.getElementById("next-step");

const lastWash =
  document.getElementById("last-wash");

const tonicStatus =
  document.getElementById("tonic-status");

const oilingStatus =
  document.getElementById("oiling-status");

const birthControlStatus =
  document.getElementById("birth-control-status");

const birthControlWarning =
  document.getElementById("birth-control-warning");

const lastTonic =
  document.getElementById("last-tonic");

const lastOiling =
  document.getElementById("last-oiling");

const lastStep =
  document.getElementById("last-step");

const washHistoryPreview =
  document.getElementById("wash-history-preview");

const washBtn =
  document.getElementById("wash-btn");

const stepBtn =
  document.getElementById("step-btn");

const tonicBtn =
  document.getElementById("tonic-btn");

const oilingBtn =
  document.getElementById("oiling-btn");

const birthControlBtn =
  document.getElementById("birth-control-btn");

const reportsBtn =
  document.getElementById("reports-btn");

const settingsBtn =
  document.getElementById("settings-btn");

const toggleScheduleConfig =
  document.getElementById("toggle-schedule-config");

const scheduleConfigPanel =
  document.getElementById("schedule-config-panel");

const seqButtons =
  document.querySelectorAll(".seq-btn");

const sequencePreview =
  document.getElementById("sequence-preview");

const undoBtn =
  document.getElementById("undo-btn");

const saveSequenceBtn =
  document.getElementById("save-sequence-btn");


// Configuração rápida do tônico

const toggleTonicConfig =
  document.getElementById("toggle-tonic-config");

const tonicConfigPanel =
  document.getElementById("tonic-config-panel");

const quickTonicFrequency =
  document.getElementById("quick-tonic-frequency");

const quickTonicUseMonths =
  document.getElementById("quick-tonic-use-months");

const quickTonicPauseMonths =
  document.getElementById("quick-tonic-pause-months");

const saveTonicConfig =
  document.getElementById("save-tonic-config");


// Configuração rápida do oiling

const toggleOilingConfig =
  document.getElementById("toggle-oiling-config");

const oilingConfigPanel =
  document.getElementById("oiling-config-panel");

const quickOilingFrequency =
  document.getElementById("quick-oiling-frequency");

const quickOilingUseMonths =
  document.getElementById("quick-oiling-use-months");

const quickOilingPauseMonths =
  document.getElementById("quick-oiling-pause-months");

const saveOilingConfig =
  document.getElementById("save-oiling-config");


// =========================
// CONFIGURAÇÕES
// =========================

const hairSettings =
  JSON.parse(
    localStorage.getItem("hairSettings")
  );

if (!hairSettings) {

  window.location.href =
    "configuracoes.html";

}


// =========================
// ESCONDER CARDS NÃO USADOS
// =========================

if (hairSettings) {

  if (!hairSettings.care.tonic) {
    tonicCard.classList.add("hidden");
  }

  if (!hairSettings.care.schedule) {
    scheduleCard.classList.add("hidden");
  }

  if (!hairSettings.care.oiling) {
    oilingCard.classList.add("hidden");
  }

  if (!hairSettings.care.birthControl) {
    birthControlCard.classList.add("hidden");
  }

}


// =========================
// DADOS
// =========================

let tempSequence = [];

let sequence =
  JSON.parse(
    localStorage.getItem("sequence")
  ) || ["H", "N", "H", "R"];

let currentIndex =
  Number(
    localStorage.getItem("currentIndex")
  ) || 0;


// =========================
// HISTÓRICO
// =========================

function getHistory() {

  return JSON.parse(
    localStorage.getItem("history")
  ) || [];

}


function saveHistory(type, data = {}) {

  const history =
    getHistory();

  const newItem = {

    type,

    date: new Date(),

    ...data

  };

  history.unshift(newItem);

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

}


// =========================
// FORMATAR DATA
// =========================

function formatDate(dateString) {

  const date =
    new Date(dateString);

  return date.toLocaleString("pt-BR", {

    day: "2-digit",

    month: "2-digit",

    hour: "2-digit",

    minute: "2-digit"

  });

}


function getDateKey(date) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


function getLocalDateFromInput(dateString) {

  const parts =
    dateString.split("-");

  return new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

}


function getDaysDifference(startDate, currentDate) {

  const start =
    new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

  const current =
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

  const diffTime =
    current - start;

  return Math.floor(
    diffTime /
    (1000 * 60 * 60 * 24)
  );

}


// =========================
// ETAPAS
// =========================

function getStepName(step) {

  if (step === "H") {
    return "💧 Hidratação";
  }

  if (step === "N") {
    return "🥥 Nutrição";
  }

  if (step === "R") {
    return "🧬 Reconstrução";
  }

  return "✨ Etapa não definida";

}


function getStepIcon(step) {

  if (step === "H") {
    return "💧";
  }

  if (step === "N") {
    return "🥥";
  }

  if (step === "R") {
    return "🧬";
  }

  return "✨";

}


function updateStep() {

  const currentStep =
    sequence[currentIndex];

  nextStep.innerText =
    getStepName(currentStep);

}

updateStep();


// =========================
// ÚLTIMA ETAPA
// =========================

function updateLastStep() {

  const history =
    getHistory();

  const lastStepItem =
    history.find(
      item => item.type === "step"
    );

  if (!lastStepItem) {

    lastStep.innerText =
      "Nenhuma etapa ainda";

    return;

  }

  lastStep.innerHTML = `

    Última etapa:
    ${getStepName(lastStepItem.step)}
    <br>
    ${formatDate(lastStepItem.date)}

  `;

}

updateLastStep();


// =========================
// ETAPA FEITA
// =========================

stepBtn.addEventListener("click", () => {

  saveHistory("step", {
    step: sequence[currentIndex]
  });

  updateLastStep();

  currentIndex++;

  if (currentIndex >= sequence.length) {
    currentIndex = 0;
  }

  localStorage.setItem(
    "currentIndex",
    currentIndex
  );

  updateStep();

});


// =========================
// CONFIGURAR SEQUÊNCIA DO CRONOGRAMA
// =========================

toggleScheduleConfig.addEventListener("click", () => {

  scheduleConfigPanel.classList.toggle("hidden");

});


seqButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const step =
      button.dataset.step;

    tempSequence.push(step);

    updateSequencePreview();

  });

});


undoBtn.addEventListener("click", () => {

  tempSequence.pop();

  updateSequencePreview();

});


function updateSequencePreview() {

  if (tempSequence.length === 0) {

    sequencePreview.innerText =
      "Nova sequência:";

    return;

  }

  sequencePreview.innerHTML =
    "Nova sequência: " +
    tempSequence
      .map(step => {

        return `
          <span class="sequence-pill">
            ${getStepIcon(step)}
          </span>
        `;

      })
      .join("");

}


saveSequenceBtn.addEventListener("click", () => {

  if (tempSequence.length === 0) {

    alert("Monte uma sequência antes de salvar.");

    return;

  }

  sequence =
    [...tempSequence];

  currentIndex = 0;

  localStorage.setItem(
    "sequence",
    JSON.stringify(sequence)
  );

  localStorage.setItem(
    "currentIndex",
    currentIndex
  );

  const savedSettings =
    JSON.parse(
      localStorage.getItem("hairSettings")
    );

  if (savedSettings) {

    savedSettings.sequence =
      sequence;

    localStorage.setItem(
      "hairSettings",
      JSON.stringify(savedSettings)
    );

  }

  updateStep();

  tempSequence = [];

  updateSequencePreview();

  scheduleConfigPanel.classList.add("hidden");

  alert("Sequência atualizada ✨");

});


// =========================
// ÚLTIMA LAVAGEM
// =========================

function updateLastWashText() {

  const lastWashDate =
    localStorage.getItem("lastWashDate");

  if (!lastWashDate) {

    lastWash.innerText = "Nunca";

    return;

  }

  const today =
    new Date();

  const washDate =
    new Date(lastWashDate);

  const diffTime =
    today - washDate;

  const diffDays =
    Math.floor(
      diffTime /
      (1000 * 60 * 60 * 24)
    );

  if (diffDays === 0) {

    lastWash.innerText = "Hoje";

  } else if (diffDays === 1) {

    lastWash.innerText = "Ontem";

  } else {

    lastWash.innerText =
      `Há ${diffDays} dias`;

  }

}

updateLastWashText();


// =========================
// PRÉVIA DAS LAVAGENS
// =========================

function updateWashHistoryPreview() {

  const history =
    getHistory();

  const washes =
    history.filter(
      item => item.type === "wash"
    );

  if (washes.length === 0) {

    washHistoryPreview.innerText =
      "Nenhuma lavagem ainda";

    return;

  }

  const recent =
    washes.slice(0, 2);

  washHistoryPreview.innerHTML =
    recent.map(item => {

      return `
        🚿 ${formatDate(item.date)}
      `;

    }).join("<br>");

}

updateWashHistoryPreview();


// =========================
// LAVEI HOJE
// =========================

washBtn.addEventListener("click", () => {

  localStorage.setItem(
    "lastWashDate",
    new Date()
  );

  saveHistory("wash");

  updateLastWashText();

  updateWashHistoryPreview();

});


// =========================
// STATUS POR FREQUÊNCIA EM DIAS
// =========================

function shouldDoToday(lastDate, frequencyDays) {

  if (!lastDate) {
    return true;
  }

  const today =
    new Date();

  const last =
    new Date(lastDate);

  const diffTime =
    today - last;

  const diffDays =
    Math.floor(
      diffTime /
      (1000 * 60 * 60 * 24)
    );

  return diffDays >= frequencyDays;

}


// =========================
// TÔNICO
// =========================

function updateTonicStatus() {

  const lastTonicDate =
    localStorage.getItem("lastTonicDate");

  const frequencyHours =
    hairSettings?.tonic?.frequencyHours || 48;

  if (!lastTonicDate) {

    tonicStatus.innerText = "Sim ✅";

    tonicBtn.disabled = false;

    tonicBtn.innerText = "✔ Tônico OK";

    return;

  }

  const now =
    new Date();

  const last =
    new Date(lastTonicDate);

  const nextApplication =
    new Date(
      last.getTime() +
      frequencyHours * 60 * 60 * 1000
    );

  const diffMs =
    nextApplication - now;

  if (diffMs <= 0) {

    tonicStatus.innerText = "Sim ✅";

    tonicBtn.disabled = false;

    tonicBtn.innerText = "✔ Tônico OK";

  } else {

    tonicStatus.innerText = "Não ❌";

    tonicBtn.disabled = true;

    const totalMinutes =
      Math.ceil(diffMs / (1000 * 60));

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    if (hours > 0) {

      tonicBtn.innerText =
        `⏳ Aguarde ${hours}h ${minutes}min`;

    } else {

      tonicBtn.innerText =
        `⏳ Aguarde ${minutes}min`;

    }

  }

}

updateTonicStatus();


// =========================
// ÚLTIMO TÔNICO
// =========================

function updateLastTonic() {

  const history =
    getHistory();

  const lastTonicItem =
    history.find(
      item => item.type === "tonic"
    );

  if (!lastTonicItem) {

    lastTonic.innerText =
      "Nenhuma aplicação ainda";

    return;

  }

  lastTonic.innerHTML = `

    Última aplicação:
    <br>
    ${formatDate(lastTonicItem.date)}

  `;

}

updateLastTonic();


// =========================
// TÔNICO OK
// =========================

tonicBtn.addEventListener("click", () => {

  localStorage.setItem(
    "lastTonicDate",
    new Date()
  );

  saveHistory("tonic");

  updateTonicStatus();

  updateLastTonic();

});


// =========================
// OILING
// =========================

function updateOilingStatus() {

  const lastOilingDate =
    localStorage.getItem("lastOilingDate");

  const frequency =
    hairSettings?.oiling?.frequencyDays || 7;

  if (
    shouldDoToday(
      lastOilingDate,
      frequency
    )
  ) {

    oilingStatus.innerText = "Sim ✅";

  } else {

    oilingStatus.innerText = "Não ❌";

  }

}

updateOilingStatus();


// =========================
// ÚLTIMO OILING
// =========================

function updateLastOiling() {

  const history =
    getHistory();

  const lastOilingItem =
    history.find(
      item => item.type === "oiling"
    );

  if (!lastOilingItem) {

    lastOiling.innerText =
      "Nenhum oiling ainda";

    return;

  }

  lastOiling.innerHTML = `

    Último oiling:
    <br>
    ${formatDate(lastOilingItem.date)}

  `;

}

updateLastOiling();


// =========================
// OILING OK
// =========================

oilingBtn.addEventListener("click", () => {

  localStorage.setItem(
    "lastOilingDate",
    new Date()
  );

  saveHistory("oiling");

  updateOilingStatus();

  updateLastOiling();

});


// =========================
// CONFIGURAÇÃO RÁPIDA DO TÔNICO
// =========================

function loadQuickTonicConfig() {

  quickTonicFrequency.value =
    hairSettings?.tonic?.frequencyHours || 48;

  quickTonicUseMonths.value =
    hairSettings?.tonic?.useMonths || 3;

  quickTonicPauseMonths.value =
    hairSettings?.tonic?.pauseMonths || 3;

}

loadQuickTonicConfig();


toggleTonicConfig.addEventListener("click", () => {

  tonicConfigPanel.classList.toggle("hidden");

});


saveTonicConfig.addEventListener("click", () => {

  const savedSettings =
    JSON.parse(
      localStorage.getItem("hairSettings")
    );

  if (!savedSettings) {
    return;
  }

  savedSettings.tonic = {
    frequencyHours: Number(quickTonicFrequency.value),
    useMonths: Number(quickTonicUseMonths.value),
    pauseMonths: Number(quickTonicPauseMonths.value)
  };

  localStorage.setItem(
    "hairSettings",
    JSON.stringify(savedSettings)
  );

  alert("Configuração do tônico salva ✨");

  location.reload();

});


// =========================
// CONFIGURAÇÃO RÁPIDA DO OILING
// =========================

function loadQuickOilingConfig() {

  quickOilingFrequency.value =
    hairSettings?.oiling?.frequencyDays || 7;

  quickOilingUseMonths.value =
    hairSettings?.oiling?.useMonths || 3;

  quickOilingPauseMonths.value =
    hairSettings?.oiling?.pauseMonths || 0;

}

loadQuickOilingConfig();


toggleOilingConfig.addEventListener("click", () => {

  oilingConfigPanel.classList.toggle("hidden");

});


saveOilingConfig.addEventListener("click", () => {

  const savedSettings =
    JSON.parse(
      localStorage.getItem("hairSettings")
    );

  if (!savedSettings) {
    return;
  }

  savedSettings.oiling = {
    frequencyDays: Number(quickOilingFrequency.value),
    useMonths: Number(quickOilingUseMonths.value),
    pauseMonths: Number(quickOilingPauseMonths.value)
  };

  localStorage.setItem(
    "hairSettings",
    JSON.stringify(savedSettings)
  );

  alert("Configuração do oiling salva ✨");

  location.reload();

});


// =========================
// ANTICONCEPCIONAL
// =========================

let activeBirthControlAction = null;


function getBirthControlInfo(date = new Date()) {

  const config =
    hairSettings?.birthControl;

  if (
    !config ||
    !config.startDate ||
    !config.pillCount
  ) {

    return null;

  }

  const startDate =
    getLocalDateFromInput(
      config.startDate
    );

  const pillCount =
    config.pillCount;

  const pauseDays =
    config.pauseDays || 0;

  const cycleLength =
    pillCount + pauseDays;

  const daysPassed =
    getDaysDifference(
      startDate,
      date
    );

  if (daysPassed < 0) {

    return {
      type: "future",
      text: "Ainda não começou",
      shouldTake: false
    };

  }

  const cycleDay =
    daysPassed % cycleLength;

  const expectedDateKey =
    getDateKey(date);

  if (cycleDay < pillCount) {

    const pillNumber =
      cycleDay + 1;

    return {
      type: "pill",
      text: `CP ${pillNumber}`,
      pillNumber: pillNumber,
      expectedDateKey: expectedDateKey,
      shouldTake: true
    };

  }

  const pauseDay =
    cycleDay - pillCount + 1;

  return {
    type: "pause",
    text: `Pausa - dia ${pauseDay}`,
    shouldTake: false
  };

}


function hasBirthControlTakenExpectedDate(expectedDateKey) {

  const directRecord =
    localStorage.getItem(
      `birthControlTaken-${expectedDateKey}`
    );

  if (directRecord) {
    return true;
  }

  const history =
    getHistory();

  return history.some(item => {

    if (item.type !== "birthControl") {
      return false;
    }

    if (item.expectedDate) {
      return item.expectedDate === expectedDateKey;
    }

    const itemDate =
      new Date(item.date);

    return getDateKey(itemDate) === expectedDateKey;

  });

}


function getCurrentCycleStartDate() {

  const config =
    hairSettings?.birthControl;

  if (
    !config ||
    !config.startDate ||
    !config.pillCount
  ) {

    return null;

  }

  const startDate =
    getLocalDateFromInput(
      config.startDate
    );

  const today =
    new Date();

  const pillCount =
    config.pillCount;

  const pauseDays =
    config.pauseDays || 0;

  const cycleLength =
    pillCount + pauseDays;

  const daysPassed =
    getDaysDifference(
      startDate,
      today
    );

  if (daysPassed < 0) {
    return startDate;
  }

  const currentCycleStartOffset =
    daysPassed - (daysPassed % cycleLength);

  const cycleStart =
    new Date(startDate);

  cycleStart.setDate(
    startDate.getDate() + currentCycleStartOffset
  );

  return cycleStart;

}


function getPendingBirthControlPill() {

  const config =
    hairSettings?.birthControl;

  if (
    !config ||
    !config.startDate ||
    !config.pillCount
  ) {

    return null;

  }

  const cycleStart =
    getCurrentCycleStartDate();

  if (!cycleStart) {
    return null;
  }

  const today =
    new Date();

  const trackingStart =
    config.trackingStartDate
      ? getLocalDateFromInput(config.trackingStartDate)
      : cycleStart;

  const currentDate =
    new Date(
      Math.max(
        cycleStart.getTime(),
        trackingStart.getTime()
      )
    );

  while (currentDate <= today) {

    const info =
      getBirthControlInfo(currentDate);

    if (
      info &&
      info.shouldTake &&
      !hasBirthControlTakenExpectedDate(
        info.expectedDateKey
      )
    ) {

      return info;

    }

    currentDate.setDate(
      currentDate.getDate() + 1
    );

  }

  return null;

}



function updateBirthControlStatus() {

  const today =
    new Date();

  const todayInfo =
    getBirthControlInfo(today);

  if (!todayInfo) {

    birthControlStatus.innerText =
      "Configure sua cartela";

    birthControlWarning.innerText =
      "";

    birthControlBtn.disabled =
      true;

    activeBirthControlAction =
      null;

    return;

  }

  const pendingPill =
    getPendingBirthControlPill();

  if (
    pendingPill &&
    pendingPill.expectedDateKey !== getDateKey(today)
  ) {

    activeBirthControlAction =
      pendingPill;

    if (todayInfo.shouldTake) {

      birthControlStatus.innerHTML = `
        Hoje: ${todayInfo.text}
        <br>
        Pendente: ${pendingPill.text}
      `;

    } else {

      birthControlStatus.innerHTML = `
        ${todayInfo.text}
        <br>
        Pendente: ${pendingPill.text}
      `;

    }

    birthControlWarning.innerText =
      "⚠️ Há comprimido pendente";

    birthControlBtn.disabled =
      false;

    birthControlBtn.innerText =
      `✔ Tomei ${pendingPill.text}`;

    return;

  }

  birthControlStatus.innerText =
    todayInfo.text;

  birthControlWarning.innerText =
    "";

  if (!todayInfo.shouldTake) {

    birthControlBtn.disabled =
      true;

    birthControlBtn.innerText =
      "Pausa";

    activeBirthControlAction =
      null;

    return;

  }

  const takenToday =
    hasBirthControlTakenExpectedDate(
      todayInfo.expectedDateKey
    );

  if (takenToday) {

    birthControlBtn.disabled =
      true;

    birthControlBtn.innerText =
      `✅ ${todayInfo.text} tomado`;

    activeBirthControlAction =
      null;

  } else {

    birthControlBtn.disabled =
      false;

    birthControlBtn.innerText =
      `✔ Tomei ${todayInfo.text}`;

    activeBirthControlAction =
      todayInfo;

  }

}

updateBirthControlStatus();


birthControlBtn.addEventListener("click", () => {

  if (!activeBirthControlAction) {
    return;
  }

  const today =
    new Date();

  const todayKey =
    getDateKey(today);

  const expectedDateKey =
    activeBirthControlAction.expectedDateKey;

  const isLate =
    expectedDateKey !== todayKey;

  localStorage.setItem(
    `birthControlTaken-${expectedDateKey}`,
    "true"
  );

  saveHistory("birthControl", {
    day: activeBirthControlAction.text,
    pillNumber: activeBirthControlAction.pillNumber,
    expectedDate: expectedDateKey,
    isLate: isLate
  });

  updateBirthControlStatus();

});


// =========================
// IR PARA RELATÓRIOS
// =========================

reportsBtn.addEventListener("click", () => {

  window.location.href =
    "relatorios.html";

});


// =========================
// IR PARA CONFIGURAÇÕES
// =========================

settingsBtn.addEventListener("click", () => {

  window.location.href =
    "configuracoes.html";

});


// =========================
// SERVICE WORKER
// =========================

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => {

      console.log(
        "Service Worker registrado"
      );

    });

}
