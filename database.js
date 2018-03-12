//Import mysql drivers
var mysql = require('mysql');

//Create database connection
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'subhan',
    database: 'app'
});

//Export connection
module.exports = connection;