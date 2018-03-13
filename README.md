# TA Home Improvements Invoicing System

## Setup
First install [NodeJS](https://nodejs.org/en/)

## Running the project
Clone this repository and navigate to the project folder.

### Setting database details

Before running the project you must change the database path to your own database.
Change `database.js` in the root folder to your own database.

```javascript
//Import mysql drivers
var mysql = require('mysql');

//Create database connection
var connection = mysql.createConnection({
    host: 'YOUR_DATABASE_PATH',
    user: 'YOUR_USER',
    password: 'YOUR_PASSWORD',
    database: 'YOUR_SCHEMA'
});

//Export connection
module.exports = connection;
```

You must also change `/app/config/config.json`

```json
{ 
    "development": { 
        "logging": false,
        "username": "YOUR_USERNAME", 
        "password": "YOUR_PASSWORD", 
        "database": "YOUR_SCHEMA", 
        "host": "YOUR_DATABASE_PATH", 
        "dialect": "mysql" 
    }, 
    "test": { 
        "username": "", 
        "password": null, 
        "database": "", 
        "host": "", 
        "dialect": "mysql"
    }, 
    "production": {
        "host": "127.0.0.1", 
        "dialect": "mysql" 
    } 
}
```

Run 
```bash
npm install -g concurrently webpack nodemon
```
To run the project run the following command in the project root

```bash
npm run all
```

You should now be able to access the application at `localhost:8000`

## Note:
Sample data for this application is included in the `data.sql` file

To register a new user navigate to `localhost:8000/signup`

