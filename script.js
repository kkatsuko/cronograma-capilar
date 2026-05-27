// =========================
// ELEMENTOS
// =========================

const tonicCard =
  document.getElementById("tonic-card");

const scheduleCard =
  document.getElementById("schedule-card");

const oilingCard =
  document.getElementById("oiling-card");

const nextStep =
  document.getElementById("next-step");

const lastWash =
  document.getElementById("last-wash");

const tonicStatus =
  document.getElementById("tonic-status");

const oilingStatus =
  document.getElementById("oiling-status");

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

function saveHistory(type, data = {}) {

  const history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

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
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

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
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

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
// STATUS POR FREQUÊNCIA
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

    tonicStatus.innerText = "SIM";

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
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

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

    oilingStatus.innerText = "SIM";

  } else {

    oilingStatus.innerText = "NÃO";

  }

}

updateOilingStatus();


// =========================
// ÚLTIMO OILING
// =========================

function updateLastOiling() {

  const history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

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
