const nav = document.createElement("nav");
const navPart = `
    <div class="logo"><a href="/">PlaceList</a></div>
      <div class="menu">
        <a href="/new">Post Place</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
      `;
nav.innerHTML(navPart);
