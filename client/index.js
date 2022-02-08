//register
const formBtn = document.querySelectorAll(".form_box .btn_submit");
const formInput = document.querySelectorAll(
  ".form_box input, .form_box textarea"
);

w3.includeHTML();

// const inputValidCheck = () => {
//   formInput.forEach((input) => {
//     input.addEventListener("invalid", () => {
//       console.log("invalid", input.validity);
//     });
//   });
// };

const logoutE = () => {
  localStorage.removeItem("x_auth");
  loginCheck();
};

//login_check
const loginCheck = () => {
  setTimeout(() => {
    const loginSet = document.querySelector("nav .menu");
    const cookie = localStorage.getItem("x_auth");
    if (cookie) {
      loginSet.innerHTML = `
      <a href="/create">Post Place</a>
      <a href="/" onclick="logoutE()">logout</a>`;
    } else {
      loginSet.innerHTML = `
      <a href="/login">Login</a>
      <a href="/register">Register</a>`;
    }
  }, 100);
};

//form-reset
const formReset = () => {
  formInput.forEach((input) => {
    input.value = "";
  });
};

//modal
const modalE = (status, msg) => {
  const modal = document.querySelector(".modal");
  const closeModal = document.querySelector(".modal .btn_close");
  const modalTitle = document.querySelector(".modal .msg_box .txt_box h3");
  const modalTxt = document.querySelector(".modal .msg_box .txt_box p");

  if (status) {
    modalTitle.innerHTML = "Welcome";
    modalTxt.innerHTML = "✅" + msg;
    setTimeout(() => {
      formReset();
      window.location.href = "/login";
    }, 1500);
  } else {
    modalTitle.innerHTML = "Sorry";
    modalTxt.innerHTML = "⚠️" + msg;
  }

  modal.classList.remove("off");
  closeModal.addEventListener("click", () => {
    modal.classList.add("off");
  });
};

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
      modalE(false, "Incorrect Password");
      return;
    }
  }

  fetch("/register", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      modalE(data.success, data.message);
    })
    .catch((err) => console.log(err));
};

const loginForm = () => {
  let data = {};
  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }

  fetch("/login", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        localStorage.setItem("x_auth", data.token);
        formReset();
        window.location.href = "/";
      } else {
        modalE(data.success, data.message);
      }
    })
    .catch((err) => console.log(err));
};

const createForm = () => {
  console.log("create");
  let data = {};
  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }

  fetch("/create", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        formReset();
        window.location.href = "/";
      }
    })
    .catch((err) => console.log(err));

  // console.log(data);
};
//getData

const getData = () => {
  fetch("/", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setMap(data.data);
    })
    .catch((err) => console.log(err));
};

//map
const setMap = (data) => {
  console.log("data!", data);
  mapboxgl.accessToken = key;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [151.20776, -33.86854],
    zoom: 3,
  });
};

getData();
formSubmit();
loginCheck();
