const createForm = () => {
  console.log("create");
  let data = {};
  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }

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

const thumbnail = () => {
  const fileBtn = document.getElementById("input_img");
  const preImg = document.querySelector(".section_new .pre_img");
  let img = document.createElement("img");

  if (preImg.childElementCount !== 0) {
    fileBtn.addEventListener("click", (event) => {
      preImg.removeChild();
    });
  }

  fileBtn.addEventListener("change", (event) => {
    var reader = new FileReader();
    reader.onload = function (event) {
      img.setAttribute("src", event.target.result);
      preImg.appendChild(img);
    };

    if (preImg.hasChildNodes) {
      reader.readAsDataURL(event.target.files[0]);
    }
  });
};
thumbnail();
