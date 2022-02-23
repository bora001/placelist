const createForm = () => {
  console.log("create");
  let data = {};
  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }

  console.log(data);
  const form = document.querySelector(".form_new");
  const formData = new FormData(form);
  fetch("/create", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        formReset();
        window.location.href = "/";
      }
    })
    .catch((err) => console.log(err));
};
