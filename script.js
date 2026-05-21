// =========================
// ELEMENTOS
// =========================

const nextStep = document.getElementById("next-step");

const lastWash = document.getElementById("last-wash");

const tonicStatus = document.getElementById("tonic-status");

const washBtn = document.getElementById("wash-btn");

const stepBtn = document.getElementById("step-btn");

const tonicBtn = document.getElementById("tonic-btn");

const seqButtons = document.querySelectorAll(".seq-btn");

const sequencePreview = document.getElementById("sequence-preview");

const undoBtn = document.getElementById("undo-btn");

const saveSequenceBtn = document.getElementById("save-sequence-btn");


// =========================
// DADOS
// =========================

let tempSequence = [];

let sequence = JSON.parse(localStorage.getItem("sequence")) || ["H", "N", "H", "R"];

let currentIndex = Number(localStorage.getItem("currentIndex")) || 0;


// =========================
// MOSTRAR ETAPA
// =========================

function getStepName(step) {

  if (step === "H") return "💧 Hidratação";

  if (step === "N") return "🥥 Nutrição";

  if (step === "R") return "🧬 Reconstrução";

}

function updateStep() {

  nextStep.innerText = getStepName(sequence[currentIndex]);

}

updateStep();


// =========================
// MONTAR SEQUÊNCIA
// =========================

seqButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const step = button.dataset.step;

    tempSequence.push(step);

    sequencePreview.innerText =
      "Sua sequência: " + tempSequence.join(" ");

  });

});


// =========================
// APAGAR ÚLTIMO
// =========================

undoBtn.addEventListener("click", () => {

  tempSequence.pop();

  sequencePreview.innerText =
    "Sua sequência: " + tempSequence.join(" ");

});


// =========================
// SALVAR SEQUÊNCIA
// =========================

saveSequenceBtn.addEventListener("click", () => {

  if (tempSequence.length === 0) return;

  sequence = tempSequence;

  currentIndex = 0;

  localStorage.setItem("sequence", JSON.stringify(sequence));

  localStorage.setItem("currentIndex", currentIndex);

  updateStep();

  alert("Sequência salva ✨");

});


// =========================
// ETAPA FEITA
// =========================

stepBtn.addEventListener("click", () => {

  currentIndex++;

  if (currentIndex >= sequence.length) {

    currentIndex = 0;

  }

  localStorage.setItem("currentIndex", currentIndex);

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

  const washDate = new Date(lastWashDate);

  const diffTime =
    today - washDate;

  const diffDays =
    Math.floor(diffTime / (1000 * 60 * 60 * 24));

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
// LAVEI HOJE
// =========================

washBtn.addEventListener("click", () => {

  localStorage.setItem(
    "lastWashDate",
    new Date()
  );

  updateLastWashText();

});


// =========================
// TÔNICO
// =========================

function updateTonicStatus() {

  const lastTonic =
    localStorage.getItem("lastTonicDate");

  if (!lastTonic) {

    tonicStatus.innerText = "SIM";

    return;

  }

  const today = new Date();

  const tonicDate = new Date(lastTonic);

  const diffTime =
    today - tonicDate;

  const diffDays =
    Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 2) {

    tonicStatus.innerText = "SIM";

  } else {

    tonicStatus.innerText = "NÃO";

  }

}

updateTonicStatus();


// =========================
// TÔNICO OK
// =========================

tonicBtn.addEventListener("click", () => {

  localStorage.setItem(
    "lastTonicDate",
    new Date()
  );

  updateTonicStatus();

});


// =========================
// SERVICE WORKER
// =========================

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("service-worker.js")
    .then(() => {
      console.log("Service Worker registrado");
    });

}
