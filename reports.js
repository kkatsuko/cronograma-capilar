// =========================
// ELEMENTOS
// =========================

const washHistory =
  document.getElementById("wash-history");

const stepHistory =
  document.getElementById("step-history");

const tonicHistory =
  document.getElementById("tonic-history");


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


// =========================
// SALVAR HISTÓRICO
// =========================

function saveHistory() {

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

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

  history[currentEditIndex].date =
    new Date(newDate);

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

            <button onclick="editHistory(${index})">
              ✏ Editar
            </button>

            <button onclick="deleteHistory(${index})">
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

            <button onclick="editHistory(${index})">
              ✏ Editar
            </button>

            <button onclick="deleteHistory(${index})">
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

            <button onclick="editHistory(${index})">
              ✏ Editar
            </button>

            <button onclick="deleteHistory(${index})">
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
