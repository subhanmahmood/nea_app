var connection = require('../database.js')

module.exports = {
  addItem: function(req, res){
    var query = 'INSERT INTO tblcustomer SET ?';
    //Execute query
    connection.query(query, req.body, function(error, results, fields){
      if ( error ) {
        //Send error and error status code
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        //Send success status code and results
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  },
  find: function(req, res){
    var query = 'SELECT * FROM tblcustomer';
    //Execute query
    connection.query(query, function(error, results, fields){
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  },
  findById: function(req, res){
    //Parse id to integer
    var id = parseInt(req.params.id);
    var query = 'SELECT *  FROM tblcustomer WHERE idcustomer = ?';
    //Execute query
    connection.query(query, id, function(error, results, fields){
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  },
  deleteById(req, res){
    //Get id from request parameters
    var id = req.params.id;
    var query = 'DELETE FROM tblcustomer WHERE idcustomer = ?';
    //Execute query
    connection.query(query, id, function(error,  results, fields) {
      if(error){
        console.log(error)
        res.send({ "status": 500, "error": error, "response": null })        
      }else{
        res.send({ "status": 200, "error": null, "response": results }) }     
    })
  },
  findAndUpdateById: function(req, res){
    //Get id and body from request
    var id = req.params.id;
    var body = req.body;
    var query = 'UPDATE tblcustomer SET ? WHERE idcustomer = ?';
    //Execute query
    connection.query(query, [body, id], function(error, results, fields) {
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results})
      }
    });
  },
  deleteAll: function(req, res){
    var query = 'DELETE FROM tblpart';
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