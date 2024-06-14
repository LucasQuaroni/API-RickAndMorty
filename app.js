document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("filterModal");
  const btn = document.querySelector(".filters");
  const span = document.querySelector(".close");
  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");
  const pagination = document.querySelector(".pagination");
  let currentPage = 1;
  let currentFilters = {};

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

  document.querySelector(".characters").addEventListener("click", () => {
    getCharacters(currentPage);
    pagination.style.display = "flex";
  });

  document.getElementById("filterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 1;
    currentFilters = {
      name: document.getElementById("name").value,
      status: document.getElementById("status").value,
      species: document.getElementById("species").value,
      type: document.getElementById("type").value,
      gender: document.getElementById("gender").value,
    };
    filterCharacters(currentPage, currentFilters);
    modal.style.display = "none";
    pagination.style.display = "flex";
  });

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      if (Object.keys(currentFilters).length > 0) {
        filterCharacters(currentPage, currentFilters);
      } else {
        getCharacters(currentPage);
      }
    }
  });

  nextPageButton.addEventListener("click", () => {
    currentPage++;
    if (Object.keys(currentFilters).length > 0) {
      filterCharacters(currentPage, currentFilters);
    } else {
      getCharacters(currentPage);
    }
  });

  async function getCharacters(page) {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );
      const data = await response.json();
      if (data.results) {
        displayCharacters(data.results);
        updatePagination(data.info);
      } else {
        displayNoCharacters();
      }
    } catch (error) {
      showError(error);
    }
  }

  async function filterCharacters(page, filters) {
    const url = new URL("https://rickandmortyapi.com/api/character");
    const params = { ...filters, page };
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results) {
        displayCharacters(data.results);
        updatePagination(data.info);
      } else {
        displayNoCharacters();
      }
    } catch (error) {
      showError(error);
    }
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
                  <p>Type: ${
                    character.type.trim() === "" ? "Unknown" : character.type
                  }</p>
              `;
      charactersDiv.appendChild(characterCard);
    });
  }

  function displayNoCharacters() {
    const charactersDiv = document.querySelector(".characters-container");
    charactersDiv.innerHTML = "<p>No se encontraron personajes.</p>";
  }

  function updatePagination(info) {
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    prevPageButton.disabled = !info.prev;
    nextPageButton.disabled = !info.next;

    pageInfo.textContent = `Página ${currentPage} de ${info.pages}`;
  }

  function showError(error) {
    const charactersDiv = document.querySelector(".characters-container");
    charactersDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});
