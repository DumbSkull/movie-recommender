//importing python-shell:
let PythonShell = require("python-shell");
const path = require("path");

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
