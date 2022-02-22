//item
const getItem = (id) => {
  fetch(`/place/${id}`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      renderItem(data.item);
      renderReview(data.item.review);
      deleteItem(data.writer, data.item._id);
    })
    .catch((err) => console.log(err));
};

const deleteItem = (result, id) => {
  const delBtn = document.querySelector(".section_place .del_place");
  if (!result) {
    delBtn.classList.add("off");
  }
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
            <h3>${data.name}</h3>
            <p>${data.address}</p>
            <p>${data.rate}</p>
            <p>${data.desc}</p>
          </div>
        </div>
        `;
  itemBox.insertAdjacentHTML("afterbegin", html);
};

const createReview = () => {
  let data = {};
  let link = window.location.pathname.split("/");
  let user = localStorage.getItem("x_auth");
  for (let v of Object.values(formInput)) {
    data[v.name] = v.value;
  }
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

const deleteReview = (commentId, id) => {
  console.log("delll", commentId, id);

  let data = {
    placeId: id,
    commentId,
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
  console.log(data);
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
                <p>${comment.comment}</p>
              </div>
              <button class="del_review">❌</button>
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

//review
const rateInput = document.querySelector("input[name='rate']");
const rateFilled = document.querySelector(".rate_input .filled");

if (rateInput) {
  rateInput.addEventListener("click", (e) => {
    rateFilled.style.width = `${e.target.value * 20}%`;
  });
}
