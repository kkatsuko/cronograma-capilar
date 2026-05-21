const todayTask = document.getElementById("today-task");

const buttons = document.querySelectorAll(".type-btn");

buttons.forEach((button) => {

  button.addEventListener("click", () => {

    const text = button.innerText;

    todayTask.innerText = text;

  });

});
