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
// PEGAR HISTÓRICO
// =========================

const history =
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
// RENDERIZAR HISTÓRICO
// =========================

history.forEach((item) => {

  // LAVAGEM

  if (item.type === "wash") {

    washHistory.innerHTML += `

      <p>
        🚿 ${formatDate(item.date)}
      </p>

    `;

  }


  // ETAPAS

  if (item.type === "step") {

    stepHistory.innerHTML += `

      <p>
        ${getStepName(item.step)}
        <br>
        ${formatDate(item.date)}
      </p>

    `;

  }


  // TÔNICO

  if (item.type === "tonic") {

    tonicHistory.innerHTML += `

      <p>
        🌱 Aplicado
        <br>
        ${formatDate(item.date)}
      </p>

    `;

  }

});
