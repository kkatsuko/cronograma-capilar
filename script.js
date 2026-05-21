const todayTask = document.getElementById("today-task");

const doneBtn = document.getElementById("done-btn");

const configBtn = document.getElementById("config-btn");

const configPanel = document.getElementById("config-panel");

const saveConfigBtn = document.getElementById("save-config");

const sequenceInput = document.getElementById("sequence-input");


// =========================
// ABRIR CONFIG
// =========================

configBtn.addEventListener("click", () => {

  configPanel.classList.toggle("hidden");

});


// =========================
// PEGAR DADOS SALVOS
// =========================

let sequence = JSON.parse(localStorage.getItem("sequence"));

let currentIndex = Number(localStorage.getItem("currentIndex"));


// =========================
// CONFIG PADRÃO
// =========================

if (!sequence) {

  sequence = ["H", "N", "H", "R"];

  localStorage.setItem("sequence", JSON.stringify(sequence));

}


if (isNaN(currentIndex)) {

  currentIndex = 0;

  localStorage.setItem("currentIndex", currentIndex);

}


// =========================
// MOSTRAR ETAPA ATUAL
// =========================

function updateTask() {

  const currentStep = sequence[currentIndex];

  if (currentStep === "H") {
    todayTask.innerText = "💧 Hidratação";
  }

  if (currentStep === "N") {
    todayTask.innerText = "🥥 Nutrição";
  }

  if (currentStep === "R") {
    todayTask.innerText = "🧬 Reconstrução";
  }

}

updateTask();


// =========================
// AVANÇAR SEQUÊNCIA
// =========================

doneBtn.addEventListener("click", () => {

  currentIndex++;

  if (currentIndex >= sequence.length) {
    currentIndex = 0;
  }

  localStorage.setItem("currentIndex", currentIndex);

  updateTask();

});


// =========================
// SALVAR NOVA SEQUÊNCIA
// =========================

saveConfigBtn.addEventListener("click", () => {

  const text = sequenceInput.value;

  sequence = text
    .toUpperCase()
    .split(" ");

  currentIndex = 0;

  localStorage.setItem("sequence", JSON.stringify(sequence));

  localStorage.setItem("currentIndex", currentIndex);

  updateTask();

  alert("Sequência salva ✨");

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
