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
