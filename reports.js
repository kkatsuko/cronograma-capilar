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

  return date
    .toISOString()
    .split("T")[0];

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

  const item =
    history[index];

  if (item.type === "birthControl") {

    const dateKey =
      getDateKey(
        new Date(item.date)
      );

    localStorage.removeItem(
      `birthControlTaken-${dateKey}`
    );

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

});


// =========================
// SALVAR EDIÇÃO
// =========================

saveEdit.addEventListener("click", () => {

  if (currentEditIndex === null) {
    return;
  }

  const item =
    history[currentEditIndex];

  const oldDate =
    new Date(item.date);

  const oldKey =
    getDateKey(oldDate);

  const newDate =
    `${editDate.value}T${editTime.value}`;

  const newDateObject =
    new Date(newDate);

  const newKey =
    getDateKey(newDateObject);


  if (item.type === "birthControl") {

    localStorage.removeItem(
      `birthControlTaken-${oldKey}`
    );

    localStorage.setItem(
      `birthControlTaken-${newKey}`,
      "true"
    );

  }

  history[currentEditIndex].date =
    newDateObject;

  saveHistory();

  renderHistory();

  editModal.classList.add("hidden");

});


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

    // =====================
    // LAVAGEM
    // =====================

    if (item.type === "wash") {

      washHistory.innerHTML += `

        <div class="history-item">

          <p>
            🚿 ${formatDate(item.date)}
          </p>

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


    // =====================
    // ETAPAS
    // =====================

    if (item.type === "step") {

      stepHistory.innerHTML += `

        <div class="history-item">

          <p>
            ${getStepName(item.step)}
            <br>
            ${formatDate(item.date)}
          </p>

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


    // =====================
    // TÔNICO
    // =====================

    if (item.type === "tonic") {

      tonicHistory.innerHTML += `

        <div class="history-item">

          <p>
            🌱 Aplicado
            <br>
            ${formatDate(item.date)}
          </p>

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


    // =====================
    // ANTICONCEPCIONAL
    // =====================

    if (
      birthControlHistory &&
      item.type === "birthControl"
    ) {

      birthControlHistory.innerHTML += `

        <div class="history-item">

          <p>
            💊 ${item.day || "Tomado"}
            <br>
            ${formatDate(item.date)}
          </p>

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

  });

}


// =========================
// INICIAR
// =========================

renderHistory();
