//importing python-shell:
//let PythonShell = require("python-shell");
//const path = require("path");

const pythonExecution = () => {
  //function to convert an array into an array of Json-stringified elements
  const convertToJsonString = (arr) => {
    return arr.map((item) => JSON.stringify(item));
  };

  //function to convert an array of json-stringified elements to an array of JS objects
  const convertBackToObject = (arr) => {
    return arr.map((item) => JSON.parse(item));
  };

  //setting the configuration for python-shell

  console.log(process.resourcesPath);
  const assetsPath =
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, "pythonScripts")
      : path.join(process.resourcesPath, "pythonScripts");

  let options = {
    mode: "json",
    args: convertToJsonString([[1, 2, 3, 4], { name: "beeta", age: "20" }]), //args to pass to the python script
    scriptPath: assetsPath, //directory of the python script
  };

  PythonShell.PythonShell.run("main.py", options, function (err, results) {
    //results is the "std out printed" output from the python script

    if (err) {
      console.log("Error getting output from the python script!");
      console.log(err);
    }

    console.log("Echo from PYTHON: ", convertBackToObject(results[0]));

    document.getElementById("heading").innerHTML = results[0]; //change the heading in the main HTML
  });
};

const movies = [
  "Batman something",
  "Super something man",
  "MARVEL AVENGERS LOL",
  "Super something man",
  "MARVEL AVENGERS LOL",
];

const selectedMovies = [];

const unselectedMoviesDiv = document.getElementById("unselected-movies");

movies.forEach((movie, index) => {
  const colDiv = document.createElement("div");
  const button = document.createElement("button");
  const span = document.createElement("span");
  colDiv.className = "col-4 d-flex justify-content-center mt-3 mb-3";
  colDiv.id = "unselected-movie-" + index;
  span.innerHTML = "X";
  span.className = "badge rounded-pill bg-danger";
  button.innerHTML = movie + " ";
  button.appendChild(span);
  button.nodeType = "button";
  button.onclick = () => {
    //unselectedMoviesDiv.removeChild()
  };
  button.className = "btn btn-light rounded-movie-button";
  colDiv.appendChild(button);
  unselectedMoviesDiv.appendChild(colDiv);
});
