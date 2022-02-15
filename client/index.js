//register
const formBtn = document.querySelectorAll(".form_box .btn_submit");
const formInput = document.querySelectorAll(
  ".form_box input, .form_box textarea"
);
const listBox = document.querySelector(".section_list .list_box");
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
    const loginSet = document.querySelector("nav .menu .login_box");
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

//link-Address
const addressCheck = () => {
  let link = window.location.pathname.split("/");
  console.log("addresscheck", link[1]);
  switch (link[1]) {
    case "list":
      getList();
      break;
    case "place":
      getItem(link[2]);
      break;
  }
};

//formSubmit
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
          case "Leave a Review":
            createReview();
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
};

//getData

const getData = () => {
  if (window.location.pathname !== "/") {
    return true;
  }
  fetch("/", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let theData = data.data;
      let collection = {
        features: [],
      };
      theData.map((place) => {
        let obj = {
          geometry: place.geometry,
          properties: {
            price: place.price,
            name: place.name,
          },
        };
        collection.features.push(obj);
      });
      setMap(collection);
    })
    .catch((err) => console.log(err));
};

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
              src="https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_960_720.jpg"
              alt=""
            />
          </div>
          <div class="txt_box">
            <h3>${item.name}</h2>
            <p>${item.price}</p>
            <p>${item.address}</p>
            <a href="/place/${item._id}" class="btn_view">View the place</a>
          </div>
        </div>
  `;

    listBox.insertAdjacentHTML("beforeend", html);
  }
};

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
    })
    .catch((err) => console.log(err));
};

const renderItem = (data) => {
  // console.log(data);
  if (data.review) {
    renderReview(data.review);
  }
  let placeBox = document.querySelector(".section_place .place_box");
  let html = `<div class="item_box">
          <div class="img_box">
            <img
              src="https://cdn.pixabay.com/photo/2017/07/10/10/06/mattress-2489615_960_720.jpg"
              alt=""
            />
          </div>
          <div class="txt_box">
            <h3>${data.name}</h3>
            <p>${data.address}</p>
            <p>${data.price}</p>
            <p>${data.desc}</p>
          </div>
        </div>`;
  placeBox.insertAdjacentHTML("afterbegin", html);
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
            </div>`;
    reviewList.insertAdjacentHTML("afterbegin", html);
  });
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
      console.log(data);
      if (data.success) {
        formReset();
        //   window.location.href = "/";
      }
    })
    .catch((err) => console.log(err));
};

//map
const setMap = (collection) => {
  mapboxgl.accessToken = key;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [151.20776, -33.86854],
    zoom: 3,
  });
  map.addControl(new mapboxgl.NavigationControl());

  map.on("load", () => {
    map.addSource("placelist", {
      type: "geojson",
      data: collection,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "placelist",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "placelist",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "placelist",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("placelist")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    map.on("click", "unclustered-point", (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const name = e.features[0].properties.name;
      const price = e.features[0].properties.price;
      // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      // }
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`${name}<br>$${price}`)
        .addTo(map);
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
  });
};
getData();
formSubmit();
loginCheck();
addressCheck();

//place-item
//review
// const reviewRate = () => {
const rateInput = document.querySelector(
  ".section_place .review_box input[name='rate']"
);
const rateFilled = document.querySelector(
  ".section_place .review_box .rate_input .filled"
);

rateInput.addEventListener("click", (e) => {
  // console.log("rate", e.target.value);
  rateFilled.style.width = `${e.target.value * 20}%`;
});
// };
