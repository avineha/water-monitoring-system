// Import the required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
// Create an Express app
const app = express();
app.use(express.static(__dirname + '/public'));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

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

    db.all('select * from deviceinfo where device_status is not null', (err, rows) => {
        if (err) {
            // Send an error response if there is any
            console.log(err.message);
            res.status(500).send(err.message);

        } else {
            // Send the rows as a JSON array if successful
            console.log(rows);
            res.json(rows);
        }
    });
});

app.get('/deviceinfo', (req, res) => {

    db.all('select device_id, device_name, device_status, device_star_hour, device_running_feq, device_star_min from deviceinfo limit 1', (err, rows) => {
        if (err) {
            // Send an error response if there is any
            console.log(err.message);
            res.status(500).send(err.message);

        } else {
            // Send the rows as a JSON array if successful
            console.log(rows[0]);
            res.json(rows[0]);
        }
    });
});
app.get('/updatedeviceinfo/:hr/:min', (req, res) => {

    db.all(`update deviceinfo set device_star_hour=${req.params.hr},device_star_min =${req.params.min}`, (err, rows) => {
        if (err) {
            // Send an error response if there is any
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            // Send the rows as a JSON array if successful
            console.log(rows);
            res.json(rows);
            // res.render('index');
        }
    });

});

app.post('/updatedevicetime', (req, res) => {
    console.log(req.body);

    const data = {
        hours: req.body.txthours,
        min: req.body.txtmin,
        feq: req.body.txtfeq,
        device_status: req.body.txtdevice_status
       
    };
    // Handle the data as needed (e.g., send it to an API or process it)

    // For now, we'll just send the data back as a response
    //res.send(data);
    let sSql = `update deviceinfo set device_star_hour=${data.hours},device_star_min =${data.min}, device_running_feq=${data.feq},device_status=${data.device_status}`;
    console.log(sSql);

    db.all(sSql, (err, rows) => {
        if (err) {
            // Send an error response if there is any
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            // Send the rows as a JSON array if successful
            console.log(rows);
            //res.json(rows);
            var data = [];
            db.all('select device_id, device_name, device_status, device_star_hour, device_running_feq, device_star_min from deviceinfo limit 1', (err, rows) => {
                if (err) {
                    // Send an error response if there is any
                    console.log(err.message);
                } else {
                    // Send the rows as a JSON array if successful
                    data = rows[0];
                    res.render('pages/index', {
                        data: data,
                        LatestDeviceStatus: rows[0].device_status
                    });
                }

            });

        }

    });
});
app.get('/devicestatus/:device_id', (req, res) => {

    let sqlQuery = `select device_status  from deviceinfo where device_id=${req.params.device_id}`;

    db.all(sqlQuery, (err, rows) => {
        if (err) {
            // Send an error response if there is any
            res.status(500).send(err.message);
        } else {
            // Send the rows as a JSON array if successful
            res.json(rows);
        }
    });
});

app.post('/devicestatus/:device_id/:status', (req, res) => {

    let sqlQuery = `update deviceinfo set device_status= ${req.params.status} where device_id=${req.params.device_id}`;

    db.all(sqlQuery, (err, rows) => {
        if (err) {
            // Send an error response if there is any
            res.status(500).send(err.message);
        } else {
            insertDevicelog(req.params.device_id, req.params.status)
            // Send the rows as a JSON array if successful
            res.json({ status: true, desc: "Device has been update" });
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

    let device_id = req.params.device_id;
    let creation_date = req.params.creation_date;
    let device_status = req.params.device_status;
    let device_starttime = req.params.device_starttime;
    let device_stoptime = req.params.device_stoptime;

    let sqlQuery = `INSERT INTO devicelogger (device_id, creation_date, device_status, device_starttime, device_stoptime) VALUES ( ${device_id},'${creation_date}',${device_status}, '${device_starttime}','${device_stoptime}');`
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

function insertDevicelog(device_id, device_status) {

    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    // prints date & time in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);
    device_starttime = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`
    creation_date = `${year}-${month}-${date}`
    console.log(creation_date);
    console.log(device_starttime);
    console.log(`  device Status -  ${device_status}`);
    try {

        let sqlQuery = `INSERT INTO devicelogger (device_id, creation_date, device_status, device_starttime, device_stoptime) VALUES ( ${device_id},'${creation_date}',${device_status}, '${device_starttime}','');`
        console.log(sqlQuery);

        db.run(sqlQuery, (err) => {
            if (err) {
                // Send an error response if there is any
                return err.message;
            } else {
                // Send the rows as a JSON array if successful
                return this.lastID;
            }
        });

    } catch (error) {
        console.log(error.message);
    }
};

// index page
app.get('/', function (req, res) {

    var data = [];
    db.all('select device_id, device_name, device_status, device_star_hour, device_running_feq, device_star_min from deviceinfo limit 1', (err, rows) => {
        if (err) {
            // Send an error response if there is any
            console.log(err.message);
        } else {
            // Send the rows as a JSON array if successful
            data = rows;
            res.render('pages/index', {
                data: data,
                LatestDeviceStatus: rows[0].device_status
            });
        }

    });


    console.log(data);

    // db.all('select * from devicelogger order by id desc limit 10', (err, rows) => {
    //     if (err) {
    //         // Send an error response if there is any
    //         res.status(500).send(err.message);
    //     } else {
    //         // Send the rows as a JSON array if successful
    //         res.json(rows);
    //     }
    // });     


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


const port = process.env.PORT || 80

// Start the app on port 8080
app.listen(port, () => {
    console.log('Server is running on port ' + port);

});
