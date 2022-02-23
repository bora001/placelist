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
    if (v.name == "name") {
      const regExp = /^[a-z0-9_]{4,20}$/;
      let result = regExp.test(v.value);
      if (result) {
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
      } else {
        modalE(false, "Name can not include Uppercase, Special Characters");
      }
    }
  }
};
