// =========================
// ELEMENTOS
// =========================

const washHistory =
  document.getElementById("wash-history");

const stepHistory =
  document.getElementById("step-history");

const tonicHistory =
  document.getElementById("tonic-history");

const birthControlHistory =
  document.getElementById("birth-control-history");


// =========================
// CONFIGURAÇÕES
// =========================

const hairSettings =
  JSON.parse(
    localStorage.getItem("hairSettings")
  );


// =========================
// HISTÓRICO
// =========================

let history =
  JSON.parse(
    localStorage.getItem("history")
  ) || [];


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

  return "✨ Etapa";

}


// =========================
// SINCRONIZAR ÚLTIMAS DATAS
// =========================

function syncLastDates() {

  const lastWash =
    history.find(
      item => item.type === "wash"
    );

  const lastTonic =
    history.find(
      item => item.type === "tonic"
    );

  const lastOiling =
    history.find(
      item => item.type === "oiling"
    );


  if (lastWash) {

    localStorage.setItem(
      "lastWashDate",
      lastWash.date
    );

  } else {

    localStorage.removeItem("lastWashDate");

  }


  if (lastTonic) {

    localStorage.setItem(
      "lastTonicDate",
      lastTonic.date
    );

  } else {

    localStorage.removeItem("lastTonicDate");

  }


  if (lastOiling) {

    localStorage.setItem(
      "lastOilingDate",
      lastOiling.date
    );

  } else {

    localStorage.removeItem("lastOilingDate");

  }

}


// =========================
// RECRIAR MARCAÇÕES DO ANTICONCEPCIONAL
// =========================

function rebuildBirthControlTakenKeys() {

  Object.keys(localStorage).forEach((key) => {

    if (key.startsWith("birthControlTaken-")) {

      localStorage.removeItem(key);

    }

  });

  history.forEach((item) => {

    if (item.type !== "birthControl") {
      return;
    }

    const expectedDate =
      item.expectedDate ||
      getDateKey(
        new Date(item.date)
      );

    localStorage.setItem(
      `birthControlTaken-${expectedDate}`,
      "true"
    );

  });

}


// =========================
// SALVAR HISTÓRICO
// =========================

function saveHistory() {

  history.sort((a, b) => {

    return new Date(b.date) - new Date(a.date);

  });

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  syncLastDates();

  rebuildBirthControlTakenKeys();

}


// =========================
// EXCLUIR ITEM
// =========================

function deleteHistory(index) {

  const confirmDelete =
    confirm("Excluir registro?");

  if (!confirmDelete) {
    return;
  }

  history.splice(index, 1);

  saveHistory();

  renderHistory();

}


// =========================
// EDITAR ITEM
// =========================

let currentEditIndex = null;

const editModal =
  document.getElementById("edit-modal");

const editDate =
  document.getElementById("edit-date");

const editTime =
  document.getElementById("edit-time");

const cancelEdit =
  document.getElementById("cancel-edit");

const saveEdit =
  document.getElementById("save-edit");


function editHistory(index) {

  currentEditIndex = index;

  const item =
    history[index];

  const date =
    new Date(item.date);

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

  const hours =
    String(
      date.getHours()
    ).padStart(2, "0");

  const minutes =
    String(
      date.getMinutes()
    ).padStart(2, "0");

  editDate.value =
    `${year}-${month}-${day}`;

  editTime.value =
    `${hours}:${minutes}`;

  editModal.classList.remove("hidden");

}


// =========================
// CANCELAR
// =========================

cancelEdit.addEventListener("click", () => {

  editModal.classList.add("hidden");

  currentEditIndex =
    null;

});


// =========================
// SALVAR EDIÇÃO
// =========================

saveEdit.addEventListener("click", () => {

  if (currentEditIndex === null) {
    return;
  }

  const newDate =
    `${editDate.value}T${editTime.value}`;

  const newDateObject =
    new Date(newDate);

  history[currentEditIndex].date =
    newDateObject;


  if (
    history[currentEditIndex].type === "birthControl"
  ) {

    const actualDateKey =
      getDateKey(newDateObject);

    const expectedDate =
      history[currentEditIndex].expectedDate ||
      actualDateKey;

    history[currentEditIndex].expectedDate =
      expectedDate;

    history[currentEditIndex].isLate =
      expectedDate !== actualDateKey;

  }


  saveHistory();

  renderHistory();

  editModal.classList.add("hidden");

  currentEditIndex =
    null;

});


// =========================
// MONTAR ITEM VISUAL
// =========================

function createHistoryItem(label, date, index, extraClass = "") {

  return `

    <div class="history-item ${extraClass}">

      <div class="history-row">

        <span class="history-label">
          ${label}
        </span>

        <span class="history-date">
          ${formatDate(date)}
        </span>

      </div>

      <div class="history-buttons">

        <button type="button" onclick="editHistory(${index})">
          ✏ Editar
        </button>

        <button type="button" onclick="deleteHistory(${index})">
          🗑 Excluir
        </button>

      </div>

    </div>

  `;

}


// =========================
// RENDERIZAR
// =========================

function renderHistory() {

  washHistory.innerHTML = "";

  stepHistory.innerHTML = "";

  tonicHistory.innerHTML = "";

  if (birthControlHistory) {
    birthControlHistory.innerHTML = "";
  }


  const washes =
    history.filter(
      item => item.type === "wash"
    );

  const steps =
    history.filter(
      item => item.type === "step"
    );

  const tonics =
    history.filter(
      item => item.type === "tonic"
    );

  const birthControls =
    history.filter(
      item => item.type === "birthControl"
    );


  if (washes.length === 0) {
    washHistory.innerHTML =
      "Nenhum registro ainda";
  }

  if (steps.length === 0) {
    stepHistory.innerHTML =
      "Nenhum registro ainda";
  }

  if (tonics.length === 0) {
    tonicHistory.innerHTML =
      "Nenhum registro ainda";
  }

  if (
    birthControlHistory &&
    birthControls.length === 0
  ) {

    birthControlHistory.innerHTML =
      "Nenhum registro ainda";

  }


  history.forEach((item, index) => {

    if (item.type === "wash") {

      washHistory.innerHTML +=
        createHistoryItem(
          "🚿 Lavagem",
          item.date,
          index
        );

    }


    if (item.type === "step") {

      stepHistory.innerHTML +=
        createHistoryItem(
          getStepName(item.step),
          item.date,
          index
        );

    }


    if (item.type === "tonic") {

      tonicHistory.innerHTML +=
        createHistoryItem(
          "🌱 Tônico",
          item.date,
          index
        );

    }


    if (
      birthControlHistory &&
      item.type === "birthControl"
    ) {

      const label =
        `💊 ${item.day || "CP"}`;

      const extraClass =
        item.isLate ? "history-late" : "";

      birthControlHistory.innerHTML +=
        createHistoryItem(
          label,
          item.date,
          index,
          extraClass
        );

    }

  });

}


// =========================
// INICIAR
// =========================

saveHistory();

renderHistory();