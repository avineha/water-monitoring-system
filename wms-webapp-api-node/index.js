// Import the required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Create an Express app
const app = express();

// Create a SQLite database object
const db = new sqlite3.Database('./db/wms-db.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the users database.');
});

// Define a route to get all users
app.get('/users', (req, res) => {
    // Use the db.all() method to query all rows from the users table
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            // Send an error response if there is any
            res.status(500).send(err.message);
        } else {
            // Send the rows as a JSON array if successful
            res.json(rows);
        }
    });
});

app.get('/deviceinfo', (req, res) => {

    db.all('select * from deviceinfo', (err, rows) => {
        if (err) {
            // Send an error response if there is any
            res.status(500).send(err.message);
        } else {
            // Send the rows as a JSON array if successful
            res.json(rows);

        }
    });
});

app.get('/devicelog', (req, res) => {

    db.all('select * from devicelogger order by id desc limit 10', (err, rows) => {
        if (err) {
            // Send an error response if there is any
            res.status(500).send(err.message);
        } else {
            // Send the rows as a JSON array if successful
            res.json(rows);
        }
    });

});

/*
    Route path: /users/:userId/books/:bookId
    Request URL: http://localhost:3000/users/34/books/8989
    req.params: { "userId": "34", "bookId": "8989" }
    /device_id/:device_id/creation_date/:creation_date/device_status/:device_status/device_starttime/:device_starttime/device_stoptime/:device_stoptime
    /device_id/1/creation_date/2023-10-27/device_status/false/device_starttime/07:50:56/device_stoptime/07:51:56
*/
//app.post('/devicelog/device_id/:device_id/creation_date/:creation_date/device_status/:device_status/device_starttime/:device_starttime/device_stoptime/:device_stoptime', (req, res) => {

//http://localhost:3000/devicelog/1/2023-10-27/false/07:50:56/07:51:56
app.post('/devicelog/:device_id/:creation_date/:device_status/:device_starttime/:device_stoptime', (req, res) => {
console.log(req.params)

 let device_id= req.params.device_id;
 let creation_date= req.params.creation_date;
 let device_status= req.params.device_status;
 let  device_starttime= req.params.device_starttime;
 let device_stoptime= req.params.device_stoptime;

let sqlQuery=`INSERT INTO devicelogger (device_id, creation_date, device_status, device_starttime, device_stoptime) VALUES ( ${device_id},'${creation_date}',${device_status}, '${device_starttime}','${device_stoptime}');`
console.log(sqlQuery);

    db.run(sqlQuery, (err) => {
        if (err) {
            // Send an error response if there is any
            res.status(500).send(err.message);
        } else {
            // Send the rows as a JSON array if successful
            res.json(this.lastID);
        }
    });

    res.json(req.params)
});

// Close the database connection when the app is terminated
app.on('close', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
});

// Start the app on port 8080
app.listen(8080, () => {
    console.log('Server is running on port 8080.');
});
