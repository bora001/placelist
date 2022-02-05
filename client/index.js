//register
const formBtn = document.querySelectorAll(".form_box .btn_submit");
const formInput = document.querySelectorAll(".form_box input");
// const inputValidCheck = () => {
//   formInput.forEach((input) => {
//     input.addEventListener("invalid", () => {
//       console.log("invalid", input.validity);
//     });
//   });
// };

const formSubmit = () => {
  formBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // inputValidCheck();
      const inputArray = Array.from(formInput);
      if (inputArray.every((input) => input.validity.valid)) {
        switch (e.target.value) {
          case "Register":
            registerForm();
            break;
          case "Login":
            loginForm();
            break;
          case "Create New PlaceList":
            createForm();
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
  let data = {};
  for (let v of Object.values(formInput)) {
    v.name == "password" ? (pw = v.value) : "";
    v.name !== "password confirm" ? (data[v.name] = v.value) : "";
    if (v.name == "password confirm" && pw !== v.value) {
      alert("Incorrect Password");
      return;
    }
  }
  console.log(data);

  fetch("/register", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

const loginForm = () => {
  let data = {};
  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }
  console.log(data);
};

const createForm = () => {
  console.log("create");
  let data = {};
  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }
  console.log(data);
};

formSubmit();
