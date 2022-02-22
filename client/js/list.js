//list
const getList = () => {
  fetch("/list", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => renderList(data.data))
    .catch((err) => console.log(err));
};

const renderList = (data) => {
  for (let item of data) {
    const html = `
  <div class="list_item">
          <div class="img_box">
            <img
              src=${item.img}
              alt=""
            />
          </div>
          <div class="txt_box">
            <h3>${item.name}</h2>
            <p>${item.rate}</p>
            <p>${item.address}</p>
            <a href="/place/${item._id}" class="btn_view">View the place</a>
          </div>
        </div>
  `;

    listBox.insertAdjacentHTML("beforeend", html);
  }
};
