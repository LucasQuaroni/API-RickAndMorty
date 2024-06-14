const API_URL = "https://rickandmortyapi.com/api";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("filterModal");
  const btn = document.querySelector(".filters");
  const span = document.querySelector(".close");

  btn.onclick = function () {
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document
    .getElementById("getAllCharacters")
    .addEventListener("click", getAllCharacters);
  document
    .getElementById("filterForm")
    .addEventListener("submit", filterCharacters);
});

function getAllCharacters() {
  fetch("https://rickandmortyapi.com/api/character")
    .then((response) => response.json())
    .then((data) => {
      displayCharacters(data.results);
    })
    .catch((error) => {
      showError(error);
    });
}

function filterCharacters(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const status = document.getElementById("status").value;
  const species = document.getElementById("species").value;
  const type = document.getElementById("type").value;
  const gender = document.getElementById("gender").value;

  const url = new URL("https://rickandmortyapi.com/api/character");
  const params = { name, status, species, type, gender };
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.append(key, params[key]);
    }
  });

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayCharacters(data.results);
    })
    .catch((error) => {
      showError(error);
    });
}

function displayCharacters(characters) {
  const charactersDiv = document.querySelector(".characters-container");
  charactersDiv.innerHTML = "";
  characters.forEach((character) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("character-card");
    characterCard.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p>Status: ${character.status}</p>
            <p>Species: ${character.species}</p>
            <p>Gender: ${character.gender}</p>
        `;
    charactersDiv.appendChild(characterCard);
  });
}

function showError(error) {
  const charactersDiv = document.querySelector(".characters-container");
  charactersDiv.innerHTML = `<p>Error: ${error.message}</p>`;
}
