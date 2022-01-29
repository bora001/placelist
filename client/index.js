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

  let pw;
  let data = [];
  for (let v of Object.values(formInput)) {
    let obj = new Object();
    obj[v.name] = v.value;
    v.name == "password" ? (pw = v.value) : "";
    v.name !== "password confirm" ? data.push(obj) : "";
    if (v.name == "password confirm" && pw !== v.value) {
      alert("Incorrect Password");
      return;
    }
  }
  console.log(data);
};
