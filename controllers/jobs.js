//Import database connection
var connection = require('../database.js')

module.exports = {
  addItem: function(req, res){
    var query = 'INSERT INTO tbljob SET ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, req.body, function(error, results, fields){
      if (error) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
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
     var queryStr = 'SELECT * FROM tbljob '
     if('customer' in req.query && keys.length === 1){
       //Check if customer is in req.query and is only item in req.query
       //Add INNER JOIN to get customer data
       queryStr = queryStr + "INNER JOIN tblcustomer ON tbljob.idcustomer = tblcustomer.idcustomer"
     }else if('customer' in req.query && keys.length !== 1){
       //Check if customer is in req.query and there are other queries
       //Add INNER JOIN for customer
       queryStr = queryStr + "INNER JOIN tblcustomer ON tbljob.idcustomer = tblcustomer.idcustomer"
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
     var query = 'SELECT * FROM tbljob'
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
    //Parse id to integer
    var id = parseInt(req.params.id);
    var query = 'SELECT * FROM tbljob INNER JOIN tblcustomer ON tbljob.idcustomer = tblcustomer.idcustomer AND tbljob.idjob = ?'
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, id, function(error, results, fields){
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        if(results.length === 0 ){          
          //If no values returned send 404 status code
          res.send({ "status": 404, "error": "job not found", "response": results });
        }else{          
          //Send results
          res.send({ "status": 200, "error": null, "response": results });
        }
      }
    })
  },
  deleteById(req, res){
    var id = req.params.id;
    var query = 'DELETE FROM tbljob WHERE idjob = ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, id, function(error, results, fields) {
      if(error){
        res.send({ "status": 500, "error": error, "response": null })   
        console.log(error)     
      }else{
        res.send({ "status": 200, "error": null, "response": results })   
      }   
    })
  },
  findAndUpdateById: function(req, res){
    if(req.query[0] !== undefined){
      //Check if there are values 
      //Create array of keys in req.query
      var keys = Object.keys(req.query)
      //Query string
      var query = `UPDATE tbljob.? SET ? WHERE idjob = ?`;
      //Get id, body and key (column name)
      var id = req.params.id
      var body = req.query[0]
      var key = keys[0]
      //Execute query and send error if error, otherwise send success status code and results
      connection.query(query, [key, body, id], function(error, results, fields) {
        if ( error ) {
          res.send({ "status": 500, "error": error, "response": null })
        }else{
          res.send({ "status": 200, "error": null, "response": results})
        }
      });
    }else{
      var id = req.params.id;
      var body = req.body;
      var query = 'UPDATE tbljob SET ? WHERE idjob = ?';
      //Execute query and send error if error, otherwise send success status code and results
      connection.query(query, [body, id], function(error, results, fields) {
        if ( error ) {
          res.send({ "status": 500, "error": error, "response": null })
          console.log(error)
        }else{
          res.send({ "status": 200, "error": null, "response": results})
        }
      });
    }
  },
  deleteAll: function(req, res){
    var query = 'DELETE FROM tbljob';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, function(error, results, fields){
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  }
} 