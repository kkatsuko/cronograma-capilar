// =========================
// ELEMENTOS
// =========================

const optionCards =
  document.querySelectorAll(".option-card");

const tonicConfig =
  document.getElementById("tonic-config");

const scheduleConfig =
  document.getElementById("schedule-config");

const oilingConfig =
  document.getElementById("oiling-config");

const configSeqButtons =
  document.querySelectorAll(".config-seq-btn");

const configSequencePreview =
  document.getElementById("config-sequence-preview");

const clearConfigSequence =
  document.getElementById("clear-config-sequence");

const saveSettingsBtn =
  document.getElementById("save-settings-btn");

const tonicFrequency =
  document.getElementById("tonic-frequency");

const tonicUseMonths =
  document.getElementById("tonic-use-months");

const tonicPauseMonths =
  document.getElementById("tonic-pause-months");

const oilingFrequency =
  document.getElementById("oiling-frequency");

const oilingUseMonths =
  document.getElementById("oiling-use-months");

const oilingPauseMonths =
  document.getElementById("oiling-pause-months");


// =========================
// DADOS TEMPORÁRIOS
// =========================

let selectedCare = {
  tonic: false,
  schedule: false,
  oiling: false,
  dayAfter: false
};

let selectedSequence = [];


// =========================
// CARREGAR CONFIGURAÇÕES EXISTENTES
// =========================

const savedSettings =
  JSON.parse(
    localStorage.getItem("hairSettings")
  );

if (savedSettings) {

  selectedCare =
    savedSettings.care || selectedCare;

  selectedSequence =
    savedSettings.sequence || [];

  if (savedSettings.tonic) {

tonicFrequency.value =
  savedSettings.tonic.frequencyHours || 48;

    tonicUseMonths.value =
      savedSettings.tonic.useMonths || 3;

    tonicPauseMonths.value =
      savedSettings.tonic.pauseMonths || 3;

  }

  if (savedSettings.oiling) {

    oilingFrequency.value =
      savedSettings.oiling.frequencyDays || 7;

    oilingUseMonths.value =
      savedSettings.oiling.useMonths || 3;

    oilingPauseMonths.value =
      savedSettings.oiling.pauseMonths || 0;

  }

}


// =========================
// SELECIONAR CUIDADOS
// =========================

optionCards.forEach((card) => {

  card.addEventListener("click", (event) => {

    const clickedInsideConfig =
      event.target.closest(".care-config");

    if (clickedInsideConfig) {
      return;
    }

    const care =
      card.dataset.care;

    selectedCare[care] =
      !selectedCare[care];

    updateSelectedCards();

  });

});


// =========================
// ATUALIZAR VISUAL DOS CARDS
// =========================

function updateSelectedCards() {

  optionCards.forEach((card) => {

    const care =
      card.dataset.care;

    const button =
      card.querySelector(".care-toggle");

    if (selectedCare[care]) {

      card.classList.add("selected");

      button.innerText =
        "Selecionado";

    } else {

      card.classList.remove("selected");

      button.innerText =
        "Selecionar";

    }

  });


  if (selectedCare.tonic) {

    tonicConfig.classList.remove("hidden");

  } else {

    tonicConfig.classList.add("hidden");

  }


  if (selectedCare.schedule) {

    scheduleConfig.classList.remove("hidden");

  } else {

    scheduleConfig.classList.add("hidden");

  }


  if (selectedCare.oiling) {

    oilingConfig.classList.remove("hidden");

  } else {

    oilingConfig.classList.add("hidden");

  }

}


// =========================
// MONTAR SEQUÊNCIA
// =========================

configSeqButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const step =
      button.dataset.step;

    selectedSequence.push(step);

    updateSequencePreview();

  });

});


// =========================
// APAGAR ÚLTIMA ETAPA
// =========================

clearConfigSequence.addEventListener("click", () => {

  selectedSequence.pop();

  updateSequencePreview();

});


// =========================
// ÍCONE DAS ETAPAS
// =========================

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


// =========================
// MOSTRAR SEQUÊNCIA
// =========================

function updateSequencePreview() {

  if (selectedSequence.length === 0) {

    configSequencePreview.innerText =
      "Sua sequência:";

    return;

  }

  configSequencePreview.innerHTML =
    "Sua sequência: " +
    selectedSequence
      .map(step => {

        return `
          <span class="sequence-pill">
            ${getStepIcon(step)}
          </span>
        `;

      })
      .join("");

}


// =========================
// SALVAR CONFIGURAÇÕES
// =========================

saveSettingsBtn.addEventListener("click", () => {

  if (
    selectedCare.schedule &&
    selectedSequence.length === 0
  ) {

    alert(
      "Você selecionou cronograma capilar. Monte uma sequência antes de salvar."
    );

    return;

  }

  const settings = {

    care: selectedCare,

    sequence: selectedSequence,

tonic: {
  frequencyHours: Number(tonicFrequency.value),
  useMonths: Number(tonicUseMonths.value),
  pauseMonths: Number(tonicPauseMonths.value)
},

    oiling: {
      frequencyDays: Number(oilingFrequency.value),
      useMonths: Number(oilingUseMonths.value),
      pauseMonths: Number(oilingPauseMonths.value)
    }

  };

  localStorage.setItem(
    "hairSettings",
    JSON.stringify(settings)
  );


  if (selectedCare.schedule) {

    localStorage.setItem(
      "sequence",
      JSON.stringify(selectedSequence)
    );

    localStorage.setItem(
      "currentIndex",
      0
    );

  }


  window.location.href =
    "index.html";

});


// =========================
// INICIAR TELA
// =========================

updateSelectedCards();

updateSequencePreview();
