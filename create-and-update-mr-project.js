const BASE_URL = "https://microreact.org";
const API_TOKEN = "ey...";

async function apiRequest(
  path,
  data
) {
  const response = await fetch(
    new URL(path, BASE_URL),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Token": API_TOKEN,
      },
      body: JSON.stringify(data),
    },
  );
  return await response.json();
}

/**
 * Creates a demo project and returns the ID of the newly created project
 */
async function createProject() {
  const projectJson = {
    "datasets": {
      "dataset-1": {
        "file": "data-file-1",
        "idFieldName": "id"
      }
    },
    "files": {
      "data-file-1": {
        "format": "text/csv",
        "name": "data.csv",
        "blob": "id,latitude,longitude,Country,Country__colour,Country__shape,Pedalism\nBovine,46.227638,2.213749,France,Red,Square,Four\nGibbon,15.870032,100.992541,thailand,Green,circle,Two\nOrangutan,-0.589724,101.3431058,sumatra,Blue,Circle,Two\nGorilla,1.373333,32.290275,Uganda,#CC33FF,Circle,Two\nChimp,-0.228021,15.827659,Congo,orange,Circle,Two\nHuman,55.378051,-3.435973,UK,#CCFF33,Circle,Two\nMouse,40.463667,-3.74922,Spain,#00FFFF,square,four\n"
      }
    },
    "maps": {
      "map-1": {
        "title": "Map",
        "dataType": "geographic-coordinates",
        "coordinate-unit": "decimal-degrees",
        "latitudeField": "latitude",
        "longitudeField": "longitude",
        "viewport": null
      }
    },
    "meta": { "name": "New Project" },
    "tables": {
      "table-1": {
        "dataset": "dataset-1",
        "file": "data-file-1",
        "title": "Metadata",
        "columns": [
          { "field": "id" },
          { "field": "__latitude" },
          { "field": "__longitude" },
          { "field": "Country" },
          { "field": "Pedalism" },
        ]
      }
    },
    "version": 1,
    "schema": "https://microreact.org/schema/v1.json"
  };
  const response = await apiRequest(
    "/api/projects/create/",
    projectJson,
  )
  return response;
}

/**
 * Retruns the JSON document of a specified project
 */
async function getProjectJson(projectId) {
  const response = await apiRequest(
    `/api/projects/json?project=${projectId}`,
  )
  return response;
}

/**
 * Updates a project with the specified JSON document
 */
async function updateProject(projectId, projectJson) {
  const response = await apiRequest(
    `/api/projects/update?project=${projectId}`,
    projectJson,
  )
  return response;
}

async function addTreeToProject(projectJson) {
  // create a unique file id
  const treeFileId = "tree-file-1";

  // add a new file
  projectJson.files[treeFileId] = {
    // the correct format is required to fetch the file using the correct loader
    "format": "text/x-nh", 
    
    // the file name is used as a label in the download menu
    "name": "demo.nwk", 
    
    // an instance of Blob (https://developer.mozilla.org/en-US/docs/Web/API/Blob) or string
    "blob": "(Bovine:0.69395,(Gibbon:0.36079,(Orangutan:0.33636,(Gorilla:0.17147,(Chimp:0.19268,Human:0.11927):0.08386):0.06124):0.15057):0.54939,Mouse:1.21460);"
  };

  // set projectJson.trees to an empty object in case it is not defined
  projectJson.trees ??= {};

  // add a tree
  projectJson.trees["tree-1"] = {
    "file": treeFileId,
    "labelField": "id",
  }
}

async function main() {
  // Create a new project and get its ID
  const { id } = await createProject();
  console.log("New project created with id %s", id);

  // Fetch the project JSON document
  const projectJson = await getProjectJson(id);

  // Add a tree to the project JSON document
  addTreeToProject(projectJson);

  // Save the updated JSON document
  const { url } = await updateProject(id, projectJson);
  console.log("Updated project with url %s", url);
}

main()
  .catch(console.error);
