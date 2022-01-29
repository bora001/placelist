//register

const formBtn = document.querySelectorAll(".form_box button");
const formInput = document.querySelectorAll(".form_box input");

formBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    switch (e.target.innerText) {
      case "Register":
        registerForm();
        break;
      case "Login":
        loginForm();
        break;
      default:
        break;
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

const loginForm = () => {
  let data = [];
  for (let v of Object.values(formInput)) {
    let obj = new Object();
    obj[v.name] = v.value;
    data.push(obj);
  }
  console.log(data);
};
