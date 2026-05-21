const todayTask = document.getElementById("today-task");

const doneBtn = document.getElementById("done-btn");

const configBtn = document.getElementById("config-btn");

const configPanel = document.getElementById("config-panel");

const dayButtons = document.querySelectorAll(".day-btn");

const saveConfigBtn = document.getElementById("save-config");

const sequenceInput = document.getElementById("sequence-input");


// =========================
// ABRIR CONFIG
// =========================

configBtn.addEventListener("click", () => {

  configPanel.classList.toggle("hidden");

});


// =========================
// SELECIONAR DIAS
// =========================

let selectedDays = [];

dayButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const day = button.dataset.day;

    if (selectedDays.includes(day)) {

      selectedDays = selectedDays.filter(d => d !== day);

      button.classList.remove("active");

    } else {

      selectedDays.push(day);

      button.classList.add("active");

    }

  });

});


// =========================
// SALVAR CONFIGURAÇÃO
// =========================

saveConfigBtn.addEventListener("click", () => {

  const sequence = sequenceInput.value;

  localStorage.setItem("washDays", JSON.stringify(selectedDays));

  localStorage.setItem("sequence", sequence);

  alert("Cronograma salvo ✨");

});


// =========================
// EXEMPLO TEMPORÁRIO
// =========================

todayTask.innerText = "✨ Configure seu cronograma";


// =========================
// BOTÃO CONCLUIR
// =========================

doneBtn.addEventListener("click", () => {

  doneBtn.innerText = "✅ Concluído hoje";

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
