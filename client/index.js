//register
const formBtn = document.querySelectorAll(".form_box .btn_submit");
const formInput = document.querySelectorAll(".form_box input");
const inputValidCheck = () => {
  formInput.forEach((input) => {
    input.addEventListener("invalid", () => {
      console.log("in");
      console.log(input.validity);
    });
  });
};

// formBtn.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log(e.target.value);
//     switch (e.target.value) {
//       case "Register":
//         registerForm();
//         inputValidCheck();
//         break;
//       case "Login":
//         loginForm();
//         inputValidCheck();

//         break;
//       default:
//         break;
//     }
//   });
// });

inputValidCheck();

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
