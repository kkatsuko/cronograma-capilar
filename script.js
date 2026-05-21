const todayTask = document.getElementById("today-task");

const buttons = document.querySelectorAll(".type-btn");

buttons.forEach((button) => {

  button.addEventListener("click", () => {

    const text = button.innerText;

    todayTask.innerText = text;

  });

});

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("service-worker.js")
    .then(() => {
      console.log("Service Worker registrado");
    });

}
