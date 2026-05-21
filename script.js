const todayTask = document.getElementById("today-task");

const doneBtn = document.getElementById("done-btn");


// =========================
// CRONOGRAMA
// =========================

const schedule = {

  0: "🧬 Reconstrução", // Domingo
  1: "💧 Hidratação",  // Segunda
  4: "🥥 Nutrição"    // Quinta

};


// =========================
// PEGAR DIA ATUAL
// =========================

const today = new Date().getDay();


// =========================
// DEFINIR TRATAMENTO
// =========================

const taskToday = schedule[today];

if (taskToday) {

  todayTask.innerText = taskToday;

} else {

  todayTask.innerText = "✨ Dia de descanso";

}


// =========================
// VERIFICAR SE JÁ CONCLUIU
// =========================

const todayKey = new Date().toDateString();

const savedDone = localStorage.getItem(todayKey);


if (savedDone === "true") {

  doneBtn.innerText = "✅ Concluído hoje";

}


// =========================
// BOTÃO CONCLUIR
// =========================

doneBtn.addEventListener("click", () => {

  doneBtn.innerText = "✅ Concluído hoje";

  localStorage.setItem(todayKey, true);

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
