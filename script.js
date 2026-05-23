// =========================
// ELEMENTOS
// =========================

const nextStep =
  document.getElementById("next-step");

const lastWash =
  document.getElementById("last-wash");

const tonicStatus =
  document.getElementById("tonic-status");

const lastTonic =
  document.getElementById("last-tonic");

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

const seqButtons =
  document.querySelectorAll(".seq-btn");

const sequencePreview =
  document.getElementById("sequence-preview");

const undoBtn =
  document.getElementById("undo-btn");

const saveSequenceBtn =
  document.getElementById("save-sequence-btn");

const configHeader =
  document.getElementById("config-header");

const configContent =
  document.getElementById("config-content");

const toggleConfig =
  document.getElementById("toggle-config");

const resetBtn =
  document.getElementById("reset-btn");

const reportsBtn =
  document.getElementById("reports-btn");

const settingsBtn =
  document.getElementById("settings-btn");

const tonicCard =
  document.getElementById("tonic-card");

const scheduleCard =
  document.getElementById("schedule-card");

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

const hairSettings =
  JSON.parse(
    localStorage.getItem("hairSettings")
  );

if (!hairSettings) {

  window.location.href =
    "configuracoes.html";

}
if (hairSettings) {

  if (!hairSettings.care.tonic) {

    tonicCard.classList.add("hidden");

  }

  if (!hairSettings.care.schedule) {

    scheduleCard.classList.add("hidden");

  }

}

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
// MONTAR SEQUÊNCIA
// =========================

seqButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const step =
      button.dataset.step;

    tempSequence.push(step);

    sequencePreview.innerText =
      "Sua sequência: " +
      tempSequence.join(" ");

  });

});


// =========================
// APAGAR ÚLTIMO
// =========================

undoBtn.addEventListener("click", () => {

  tempSequence.pop();

  sequencePreview.innerText =
    "Sua sequência: " +
    tempSequence.join(" ");

});


// =========================
// SALVAR SEQUÊNCIA
// =========================

saveSequenceBtn.addEventListener("click", () => {

  if (tempSequence.length === 0) {
    return;
  }

  sequence = tempSequence;

  currentIndex = 0;

  localStorage.setItem(
    "sequence",
    JSON.stringify(sequence)
  );

  localStorage.setItem(
    "currentIndex",
    currentIndex
  );

  updateStep();

  alert("Sequência salva ✨");

});


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
// ÚLTIMA LAVAGEM
// =========================

function updateLastWashText() {

  const lastWashDate =
    localStorage.getItem("lastWashDate");

  if (!lastWashDate) {

    lastWash.innerText = "Nunca";

    return;

  }

  const today = new Date();

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

  }

  else if (diffDays === 1) {

    lastWash.innerText = "Ontem";

  }

  else {

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
// TÔNICO
// =========================

function updateTonicStatus() {

  const lastTonicDate =
    localStorage.getItem("lastTonicDate");

  if (!lastTonicDate) {

    tonicStatus.innerText = "SIM";

    return;

  }

  const today = new Date();

  const tonicDate =
    new Date(lastTonicDate);

  const diffTime =
    today - tonicDate;

  const diffDays =
    Math.floor(
      diffTime /
      (1000 * 60 * 60 * 24)
    );

  if (diffDays >= 2) {

    tonicStatus.innerText = "SIM";

  }

  else {

    tonicStatus.innerText = "NÃO";

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
// ABRIR / FECHAR CONFIG
// =========================

configHeader.addEventListener("click", () => {

  configContent.classList.toggle("hidden");

  if (
    configContent.classList.contains("hidden")
  ) {

    toggleConfig.innerText = "▼";

  }

  else {

    toggleConfig.innerText = "▲";

  }

});


// =========================
// RESETAR ROTINA
// =========================

resetBtn.addEventListener("click", () => {

  localStorage.clear();

  location.reload();

});

// =========================
// CONFIGURAR SEQUÊNCIA DO CRONOGRAMA
// =========================

let tempSequence = [];

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

}


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

  sequence = tempSequence;

  currentIndex = 0;

  localStorage.setItem(
    "sequence",
    JSON.stringify(sequence)
  );

  localStorage.setItem(
    "currentIndex",
    currentIndex
  );

  const hairSettings =
    JSON.parse(
      localStorage.getItem("hairSettings")
    );

  if (hairSettings) {

    hairSettings.sequence =
      tempSequence;

    localStorage.setItem(
      "hairSettings",
      JSON.stringify(hairSettings)
    );

  }

  updateStep();

  tempSequence = [];

  updateSequencePreview();

  scheduleConfigPanel.classList.add("hidden");

  alert("Sequência atualizada ✨");

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
