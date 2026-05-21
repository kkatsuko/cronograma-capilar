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

function editHistory(index) {

  const item =
    history[index];

  const currentDate =
    new Date(item.date);

  const formatted =
    currentDate.toISOString().slice(0, 16);

  const newDate =
    prompt(
      "Editar data e hora:\n\nFormato:\n2026-05-20T23:40",
      formatted
    );

  if (!newDate) {
    return;
  }

  item.date =
    new Date(newDate);

  saveHistory();

  renderHistory();

}


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
