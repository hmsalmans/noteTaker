// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on db.js etc.
// ===============================================================================

var db = require("../Develop/db/db");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function(req, res) { 

    return (res.json(db));

  });


  app.get("/api/notes/:id", function(req, res) {
    let id = req.params.id;

    return res.json(db[id - 1]);
});

  

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", async function(req, res) {
     var addNew = req.body;
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
    if (isEmpty(db)) {
      db = [];
  }

      db.push(addNew);
      setNoteID();

      let notes = JSON.stringify(db, null, 4);
      await setSavedNotes(notes);

      res.json(addNew);

  });

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.delete("/api/notes/:id", async function(req, res) {
    var id = req.params.id;

    db.forEach((el, index) => {
        if (el.id == id) {
            db.splice(index, 1);
        }
    });
    setNoteID();

    let note1 = JSON.stringify(db, null, 4);
    await setSavedNotes(note1);
    res.json(req.body);
});
}

function setNoteID() {
  db.forEach((el, index) => {
      el.id = index + 1
  });
}


function setSavedNotes(content) {
  try {
      return writeFileAsync("Develop/db/db", content);
  } catch (err) {
      console.log(err);
  }
}