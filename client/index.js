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
  if (arr[1] == arr[2]) {
    console.log("correct");
  }
  console.log(arr);

  let arr = [];
  for (let v of Object.values(formInput)) {
    console.log(v.name, v.value);
    let obj = new Object();
    obj[v.name] = v.value;
    arr.push(obj);
  }
  console.log(arr);
};
