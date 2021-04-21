const path = require("path");
const csv = require("csv-parser");
const fs = require("fs");

const assetsPath =
  process.env.NODE_ENV === "development" ? __dirname : process.resourcesPath;

const movies = [];

const unselectedMoviesDiv = document.getElementById("unselected-movies");
const selectedMoviesDiv = document.getElementById("selected-movies");
const searchbar = document.getElementById("search");
const recommendMeButton = document.getElementById("recommend-me-button");

let selectedMovies = [];

fs.createReadStream(
  path.join(assetsPath, "pythonScripts/movielensDataset/movies_filtered.csv")
)
  .pipe(csv())
  .on("data", (data) => movies.push(data))
  .on("end", () => {
    movies.forEach((movie, index) => {
      const colDiv = document.createElement("div");
      const button = document.createElement("button");
      const span = document.createElement("span");
      colDiv.className = "col-4 d-flex justify-content-center mt-3 mb-3";
      colDiv.style.display = "none";
      colDiv.id = "unselected-" + movie.movieId;
      span.innerHTML = "X";
      span.className = "badge rounded-pill bg-danger";
      button.innerHTML = movie.title + " ";
      button.appendChild(span);
      button.nodeType = "button";
      button.onclick = () => {
        const buttonToRemove = document.getElementById(
          "unselected-" + movie.movieId
        );
        buttonToRemove.className = "col-4 justify-content-center mt-3 mb-3";
        selectedMovies.push(movie);
        addToSelected(movie);
      };
      button.className = "btn btn-light rounded-movie-button";
      colDiv.appendChild(button);
      unselectedMoviesDiv.appendChild(colDiv);
    });
    document.getElementById("loading-unselected-movies").remove();
  });

const addToSelected = (movie) => {
  if (selectedMovies.length > 0) {
    document.getElementById("please-select-movies").style.display = "none";
    recommendMeButton.disabled = false;
  }

  const colDiv = document.createElement("div");
  const button = document.createElement("button");
  const span = document.createElement("span");
  colDiv.className = "col-4 d-flex justify-content-center mt-3 mb-3";
  colDiv.id = "selected-" + movie.movieId;
  span.innerHTML = "✓";
  span.className = "badge rounded-pill bg-success";
  button.innerHTML = movie.title + " ";
  button.appendChild(span);
  button.nodeType = "button";
  button.onclick = () => {
    const buttonToRemove = document.getElementById("selected-" + movie.movieId);
    selectedMoviesDiv.removeChild(buttonToRemove);
    selectedMovies = selectedMovies.filter((m) => movie != m);
    if (selectedMovies.length === 0) {
      document.getElementById("please-select-movies").style.display = "block";
      recommendMeButton.disabled = true;
    }
    const buttonToUnhide = document.getElementById(
      "unselected-" + movie.movieId
    );
    buttonToUnhide.className = "col-4 d-flex justify-content-center mt-3 mb-3";
    //buttonToUnhide.style.display = "block";
  };
  button.className = "btn btn-light rounded-movie-button";
  colDiv.appendChild(button);
  selectedMoviesDiv.appendChild(colDiv);
};

const searchKeypress = () => {
  const typedKeyword = searchbar.value.toLowerCase();
  const colDivs = unselectedMoviesDiv.children;
  for (let i = 0; i < colDivs.length; i++) {
    const text = colDivs[i].firstChild.innerHTML.toLowerCase();
    if (text.indexOf(typedKeyword) > -1) {
      colDivs[i].className = "col-4 d-flex justify-content-center mt-3 mb-3";
      if (
        selectedMovies.find(
          (movie) => movie.movieId == colDivs[i].id.split("unselected-")[1]
        )
      ) {
        colDivs[i].className = "col-4 mt-3 mb-3";
      }
    } else {
      colDivs[i].className = "col-4 mt-3 mb-3";
    }
  }
};

const getRecommendations = () => {
  console.log("Selected movies: ", JSON.stringify(selectedMovies));
  sessionStorage.setItem("selected-movies", JSON.stringify(selectedMovies));
  window.location = "./recommendationsPage.html";
};
