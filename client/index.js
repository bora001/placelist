//register
const formBtn = document.querySelectorAll(".form_box .btn_submit");
const formInput = document.querySelectorAll(".form_box input");

const inputValidCheck = () => {
  formInput.forEach((input) => {
    input.addEventListener("invalid", () => {
      console.log("invalid", input.validity);
    });
  });
};

const formSubmit = () => {
  formBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      inputValidCheck();
      const inputArray = Array.from(formInput);
      if (inputArray.every((input) => input.validity.valid)) {
        switch (e.target.value) {
          case "Register":
            registerForm();
            break;
          case "Login":
            loginForm();
            break;
          default:
            break;
        }
      }
    });
  });
};

const registerForm = () => {
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

formSubmit();
