// =========================
// ELEMENTOS
// =========================

const optionCards =
  document.querySelectorAll(".option-card");

const scheduleConfig =
  document.getElementById("schedule-config");

const configSeqButtons =
  document.querySelectorAll(".config-seq-btn");

const configSequencePreview =
  document.getElementById("config-sequence-preview");

const clearConfigSequence =
  document.getElementById("clear-config-sequence");

const saveSettingsBtn =
  document.getElementById("save-settings-btn");


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

  updateSelectedCards();

  updateSequencePreview();

}


// =========================
// SELECIONAR CUIDADOS
// =========================

optionCards.forEach((card) => {

  card.addEventListener("click", () => {

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


  if (selectedCare.schedule) {

    scheduleConfig.classList.remove("hidden");

  } else {

    scheduleConfig.classList.add("hidden");

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
// MOSTRAR SEQUÊNCIA
// =========================

function updateSequencePreview() {

  if (selectedSequence.length === 0) {

    configSequencePreview.innerText =
      "Sua sequência:";

    return;

  }

  configSequencePreview.innerText =
    "Sua sequência: " +
    selectedSequence.join(" ");

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
    sequence: selectedSequence
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
