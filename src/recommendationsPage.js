const movieDataset = require("./pythonScripts/movielensDataset/movies_filtered.json");
const linkDataset = require("./pythonScripts/movielensDataset/links.json");

//importing python-shell:
let PythonShell = require("python-shell");
const path = require("path");
const { BrowserWindow } = require("electron");

const assetsPath =
  process.env.NODE_ENV === "development" ? __dirname : process.resourcesPath;

const selectedMovies = JSON.parse(sessionStorage.getItem("selected-movies"));
console.log("selected movies: ", selectedMovies);

async function pythonExecution() {
  let movieList;

  //function to convert an array into an array of Json-stringified elements
  const convertToJsonString = (arr) => {
    return arr.map((item) => JSON.stringify(item));
  };

  //function to convert an array of json-stringified elements to an array of JS objects
  // const convertBackToObject = (arr) => {
  //   console.log(arr);
  //   return arr.map((item) => JSON.parse(item));
  // };

  //setting the configuration for python-shell

  let options = {
    mode: "json",
    args: convertToJsonString(selectedMovies), //args to pass to the python script
    scriptPath: path.join(assetsPath, "pythonScripts"), //directory of the python script
  };

  await new Promise((resolve, reject) => {
    PythonShell.PythonShell.run("main.py", options, function (err, results) {
      //results is the "std out printed" output from the python script

      if (err) {
        console.log("Error getting output from the python script!");
        console.log(err);
        reject({ success: false, err });
      }

      resolve({ success: true, results });

      console.log("Echo from PYTHON: ", results[0]);

      movieList = results[0];
    });
  });

  return movieList;
}

// Function to add various cards based on the movies recommended
async function cardCreation() {
  let movieRecommendation = [];
  movieRecommendation = await pythonExecution();

  const loadingScreen = document.getElementById("loading-text");
  loadingScreen.className = "";
  loadingScreen.style.display = "none";

  const movieCardsBoard = document.getElementById("recommended-movies");

  movieRecommendation.forEach((movie, index) => {
    const { movieId, genres } = movieDataset.find((movieObj) => {
      return movieObj.title === movie.title;
    });

    const { imdbId, tmdbId } = linkDataset.find((movieObj) => {
      return movieObj.movieId === movieId;
    });

    console.log("imdbID: ", imdbId);
    console.log("tmdbID: ", tmdbId);

    let tempList = movie.title.split("(");
    const movieYear = tempList[tempList.length - 1].split(")")[0].trim();

    const cardLayoutDiv = document.createElement("div");
    cardLayoutDiv.className =
      "col-lg-4 col-sm-6 col-xs-12 d-flex justify-content-center align-content-center p-4";
    const cardDiv = document.createElement("div");
    cardDiv.className = "container second-page-movie-card";
    if (movie.title.length > 40) {
      cardDiv.style.fontSize = "25px";
    } else {
      cardDiv.style.fontSize = "30px";
    }

    const titleDiv = document.createElement("div");
    titleDiv.className = "text-center movie-title";
    titleDiv.innerHTML = movie.title;
    const horizontalLine = document.createElement("hr");
    horizontalLine.className = "movie-card-divider";

    const matchRateDiv = document.createElement("div");
    matchRateDiv.className = "container text-end match-rate";
    matchRateDiv.innerHTML = "Match Rate: ";

    const matchPercent = document.createElement("span");
    matchPercent.style.color = "#3E9647";
    matchPercent.innerHTML = movie.correlation + "%";

    matchRateDiv.appendChild(matchPercent);

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "container text-start";

    const yearDetailDiv = document.createElement("div");
    yearDetailDiv.className = "card-item";
    const yearTitle = document.createElement("strong");
    yearTitle.innerHTML = "Year: ";
    const yearValue = document.createElement("span");
    yearValue.innerHTML = movieYear;

    yearDetailDiv.appendChild(yearTitle);
    yearDetailDiv.appendChild(yearValue);

    const genreDetailDiv = document.createElement("div");
    genreDetailDiv.className = "card-item";
    const genreTitle = document.createElement("strong");
    genreTitle.innerHTML = "Genre: ";
    const genreValue = document.createElement("span");
    genreValue.innerHTML = genres;

    genreDetailDiv.appendChild(genreTitle);
    genreDetailDiv.appendChild(genreValue);

    detailsDiv.appendChild(yearDetailDiv);
    detailsDiv.appendChild(genreDetailDiv);

    const btnDiv = document.createElement("div");
    btnDiv.className = "d-flex flex-column align-items-stretch p-3 gap-3";

    const imdbBtn = document.createElement("button");
    imdbBtn.className = "btn btn-lg card-btn";
    imdbBtn.innerHTML = "IMDB";
    imdbBtn.onclick = () => {
      var link = "https://www.imdb.com/title/tt00" + imdbId + "/";
      window.open(link);
    };

    const tmdbBtn = document.createElement("button");
    tmdbBtn.className = "btn btn-lg card-btn";
    tmdbBtn.innerHTML = "The Movie Database (TMDB)";
    tmdbBtn.onclick = () => {
      var link = "https://www.themoviedb.org/movie/" + tmdbId + "/";
      window.open(link);
    };

    btnDiv.appendChild(imdbBtn);
    btnDiv.appendChild(tmdbBtn);

    cardDiv.appendChild(titleDiv);
    cardDiv.appendChild(horizontalLine);
    cardDiv.appendChild(matchRateDiv);
    cardDiv.appendChild(detailsDiv);
    cardDiv.appendChild(btnDiv);

    cardLayoutDiv.appendChild(cardDiv);

    movieCardsBoard.appendChild(cardLayoutDiv);
  });
}

cardCreation();
