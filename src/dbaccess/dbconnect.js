// Import the sqlite3 module
const sqlite3 = require('sqlite3').verbose();


async function sqliteDb_connect() {

   var userlist =[];

  // Create a new database file or open an existing one
  
  var db = new sqlite3.Database('./db/wms-db.db',sqlite3.OPEN_READWRITE);

  //var db = new sqlite3.Database('./db/wms-db.db',sqlite3.OPEN_READWRITE);

  // Query the data from the table
 const user =db.all("SELECT * FROM users", function(err, rows) {
    // Handle any errors
    if (err) {
      console.error(err);
    }
    // Print the rows as an array of objects
    console.log(rows);
   
   // console.log(user);
   
  });
  userlist=user.rows;

  // close the database connection
  db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });

console.log(user.rows)

  return userlist;
  }

  function createDbConnection(filename) {
    return open({
        filename,
        driver: sqlite3.Database
    });
}

  async function getuser() {
    
    var db = new sqlite3.Database('./db/wms-db.db',sqlite3.OPEN_READWRITE);

    return new Promise((resolve, reject) => {
      db.run(`SELECT * FROM users`, (err, row) => {
      if (err) reject(err);
      resolve(row);
      });
    });


  }



exports.dbconnect = { sqliteDb_connect, getuser };