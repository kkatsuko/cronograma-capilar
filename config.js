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

const birthControlConfig =
  document.getElementById("birth-control-config");

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

const birthControlCurrentPill =
  document.getElementById("birth-control-current-pill");

const birthControlPillCount =
  document.getElementById("birth-control-pill-count");

const birthControlPauseDays =
  document.getElementById("birth-control-pause-days");


// =========================
// DADOS TEMPORÁRIOS
// =========================

let selectedCare = {
  tonic: false,
  schedule: false,
  oiling: false,
  birthControl: false,
  dayAfter: false
};

let selectedSequence = [];


// =========================
// FUNÇÕES DE DATA
// =========================

function formatLocalDateKey(date) {

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
// CARREGAR CONFIGURAÇÕES EXISTENTES
// =========================

const savedSettings =
  JSON.parse(
    localStorage.getItem("hairSettings")
  );

if (savedSettings) {

  selectedCare = {
    ...selectedCare,
    ...(savedSettings.care || {})
  };

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


  if (savedSettings.birthControl) {

    birthControlPillCount.value =
      savedSettings.birthControl.pillCount || 21;

    birthControlPauseDays.value =
      savedSettings.birthControl.pauseDays || 7;

    birthControlCurrentPill.value =
      savedSettings.birthControl.currentPillToday || 1;

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


  if (selectedCare.birthControl) {

    birthControlConfig.classList.remove("hidden");

  } else {

    birthControlConfig.classList.add("hidden");

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

  return "✨";

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


  if (
    selectedCare.birthControl &&
    !birthControlCurrentPill.value
  ) {

    alert(
      "Você selecionou anticoncepcional. Informe qual comprimido você toma hoje."
    );

    return;

  }


  const currentPillToday =
    Number(birthControlCurrentPill.value);

  const pillCount =
    Number(birthControlPillCount.value);

  const pauseDays =
    Number(birthControlPauseDays.value);


  if (
    selectedCare.birthControl &&
    currentPillToday > pillCount
  ) {

    alert(
      "O comprimido de hoje não pode ser maior que a quantidade de comprimidos da cartela."
    );

    return;

  }


  const today =
    new Date();

  const calculatedStartDate =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  calculatedStartDate.setDate(
    calculatedStartDate.getDate() - (currentPillToday - 1)
  );

  const calculatedStartDateString =
    formatLocalDateKey(calculatedStartDate);


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
    },

    birthControl: {
  startDate: calculatedStartDateString,
  trackingStartDate: formatLocalDateKey(new Date()),
  currentPillToday: currentPillToday,
  pillCount: pillCount,
  pauseDays: pauseDays
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
