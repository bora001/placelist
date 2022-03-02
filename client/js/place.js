//item
let link = window.location.pathname.split("/");
const getItem = async (id) => {
  try {
    const res = await fetch(`/place/${id}`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data, "getItem data");
    renderItem(data.item);
    renderReview(data.item.review);
    deleteItem(data.writer, data.item._id);
  } catch (e) {
    console.log(e);
  }
};

const deleteItem = (result, id) => {
  const delBtn = document.querySelector(".section_place .del_place");
  console.log(result, "result");
  if (!result) {
    delBtn.classList.add("off");
  }
  console.log(delBtn);

  delBtn.addEventListener("click", () => {
    if (window.confirm("Are you sure you want to delete this place ?")) {
      fetch(`/place/${id}/delete`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            window.location.href = "/";
          }
        })
        .catch((err) => console.log(err));
    }
  });
};

const renderItem = (data) => {
  renderMap(data.geometry.coordinates);
  let length = data.review.length + 1;
  let average = (data.rate / length).toFixed(1);
  // if (data.review) {
  //   // renderReview(data.review);
  // }
  let itemBox = document.querySelector(".section_place .item_box");

  let html = `
        <div class="detail_box">
          <div class="img_box">
            <img
              src=${data.img}
              alt=""
            />
          </div>
          <div class="txt_box">
            <div class="intro_box">
              <h3>${data.name}</h3>
              <div class="rate_input">
                <span>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span class="filled"
                style="width: ${data.rate * 20}%"
                >&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              </div>
              <p class="current_rate">${average}</p>
            </div>
            <p>${data.address}</p>
          </div>
        </div>
        `;
  itemBox.insertAdjacentHTML("afterbegin", html);
};

const createReview = () => {
  let data = {};
  let link = window.location.pathname.split("/");
  // let user = localStorage.getItem("x_auth");

  // if (!user) {
  //   modalE(false, "Please login first");
  //   setTimeout(() => {
  //     window.location.href = "/login";
  //   }, 1500);
  //   return;
  // }

  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }

  console.log(data);

  let newData = Object.assign({}, data, { id: link[2], user });
  fetch(`/review`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        formReset();
        window.location.href = `/place/${link[2]}`;
      }
    })
    .catch((err) => console.log(err));
};

const deleteReview = (commentId, id, rate) => {
  let data = {
    placeId: id,
    commentId,
    rate,
  };

  if (window.confirm("Are you sure you want to delete this comment ?")) {
    fetch(`/place/${id}/comment/delete`, {
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
          window.location.href = `/place/${id}`;
        }
      })
      .catch((err) => console.log(err));
  }
};

const renderReview = (data) => {
  let reviewList = document.querySelector(
    ".section_place .review_box .review_list"
  );
  data.map((comment) => {
    const html = `<div class="review_item">
              <div class="review_rate">
                <span>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span style="width:${
                  comment.rate * 20
                }%"class="filled">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              </div>
              <div class="review_txt">
                <h3>${comment.username}</h3>
                <p >${comment.comment}</p>
              </div>
              <button class="del_review" data-rate=${comment.rate}>❌</button>
            </div>`;
    reviewList.insertAdjacentHTML("afterbegin", html);
    userCheck(comment.userId, comment._id);
  });
};

const renderMap = (data) => {
  mapboxgl.accessToken = key;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: data,
    zoom: 11,
  });
  new mapboxgl.Marker().setLngLat(data).addTo(map);
};
getItem(link[2]);
