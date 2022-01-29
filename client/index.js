//register

const formBtn = document.querySelectorAll(".form_box button");
const formInput = document.querySelectorAll(".form_box input");

formBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.innerText === "Register") {
      registerForm();
    }
  });
});

const registerForm = () => {
  console.log("register!");

  const arr = Array.from(formInput, (input) => [input.name, input.value]);

  console.log(arr);

  if (arr[1] == arr[2]) {
    console.log("correct");
  }
};
