//Import db connection
var connection = require('../database.js')

//Add functions to file exports
module.exports = {
  addItem: function(req, res){
    //Set query string
    var query = 'INSERT INTO tblappointment SET ?';
    //Execute query
    connection.query(query, req.body, function(error, results, fields){
      if (error) {
        //If error send error to client
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        //If successful send success status code
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  },
  find: function(req, res){
    //Create array of keys in req.query array
    const keys = Object.keys(req.query)
    //Create new array for items
    var items = new Array()
    if(keys.length > 0){
      //Check if there are any queries by checking length of keys
      //Query base string
      var queryStr = 'SELECT * FROM tblappointment '
      if('customer' in req.query && keys.length === 1){
        //Check if customer is in req.query and is only item in req.query
        //Add INNER JOIN to get customer data
        queryStr = queryStr + "INNER JOIN tblcustomer ON tblappointment.idcustomer = tblcustomer.idcustomer"
      }else if('customer' in req.query && keys.length !== 1){
        //Check if customer is in req.query and there are other queries
        //Add INNER JOIN for customer
        queryStr = queryStr + "INNER JOIN tblcustomer ON tblappointment.idcustomer = tblcustomer.idcustomer"
        //Add AND for other criteria
        queryStr = queryStr + " AND "
        //Iterate over keys and remove customer value
        for (var i=keys.length-1; i>=0; i--) {
          if (keys[i] === 'customer') {
            keys.splice(i, 1);
          }
        }
        //Iterate over keys
        for(var i = 0; i < keys.length; i++){
          //Get name of key
          var key = keys[i]
          //Get value of key
          var item = req.query[key]
          //Check if key is last one in  array
          if(i === keys.length - 1){
            //Add to query to query string
            queryStr = queryStr + key + " = ?"
          }else{  
            //Add query to query string and AND for following queries
            queryStr = queryStr + key + " = ? AND "
          }
          //Push key value to items array
          items.push(item)                     
        }
      }else{
        //Add WHERE to query string
        queryStr = queryStr + " WHERE "
        //Iterate over keys
        for(var i = 0; i < keys.length; i++){
          //Get name of key
          var key = keys[i]
          //Get value of key
          var item = req.query[key]
          //Check if key is last one in  array
          if(i === keys.length - 1){
            //Add to query to query string
            queryStr = queryStr + key + " = ?"
          }else{  
            //Add query to query string and AND for following queries
            queryStr = queryStr + key + " = ? AND "
          }
          //Push key value to items array
          items.push(item)                     
        }      
      }  
      //Execute query   
      var query = connection.query(queryStr, items, function(error, results, fields){
        if ( error ) {
          //If error send error
          res.send({ "status": 500, "error": error, "response": null })
        }else{
          //Send success status code and results
          res.send({ "status": 200, "error": null, "response": results });
        }
      })
    }else{
var query = 'SELECT * FROM tblappointment'
//Execute query
connection.query(query, function(error, results, fields){
  if ( error ) {
    res.send({ "status": 500, "error": error, "response": null })
  }else{
    res.send({ "status": 200, "error": null, "response": results });
  }
})
    }    
  },
  findById: function(req, res){
    //Get record id from route parameters
    var id = parseInt(req.params.id);
    var query = 'SELECT *  FROM tblappointment WHERE idappointment = ?';
    connection.query(query, id, function(error, results, fields){
      if ( error ) {
        //If error send error
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        //Send success status code and results
        res.send({ "status": 200, "error": null, "response": results });
      }
   
    })
  },
  deleteById(req, res){
    //Get id from route parameters
    var id = req.params.id;
    var query = 'DELETE FROM tblappointment WHERE idappointment = ?';
    //Execute query
    connection.query(query, id, function(error, results, fields) {
      if(error){
        //Send error
        res.send({ "status": 500, "error": error, "response": null })        
      }else{
        //Send success status code
        res.send({ "status": 200, "error": null, "response": results })    
      }  
    })
  },
  findAndUpdateById: function(req, res){
    //Get record if from route parameters
    var id = req.params.id;
    //Get request body (data)
    var body = req.body;
    var query = 'UPDATE tblappointment SET ? WHERE idappointment = ?';
    //Execute quert
    connection.query(query, [body, id], function(error, results, fields) {
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 500, "error": null, "response": results})
      }
    });
  },
  deleteAll: function(req, res){
    var query = 'DELETE FROM tblappointment';
    //Execute query
    connection.query(query, function(error, results, fields){
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  }
} 