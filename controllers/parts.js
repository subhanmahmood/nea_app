var connection = require('../database.js')

module.exports = {
  addItem: function(req, res){
    console.log(req.body);
    var query = 'INSERT INTO tblpart SET ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, req.body, function(error, results, fields){
      if (error) {
        console.log(error)
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  },
  find: function(req, res){
    var query = 'SELECT * FROM tblpart';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, function(error, results, fields){
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }
    })
  },
  findById: function(req, res){
    var id = parseInt(req.params.id);
    var query = 'SELECT *  FROM tblpart WHERE idpart = ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, id, function(error, results, fields){
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }   
    })
  },
  deleteById(req, res){
    var id = req.params.id;
    var query = 'DELETE FROM tblpart WHERE idpart = ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, id, function(error, results, fields) {
      if(error){
        res.send({ "status": 500, "error": error, "response": null })        
      }else{
        res.send({ "status": 200, "error": null, "response": results })     
      } 
    })
  },
  findAndUpdateById: function(req, res){
    var id = req.params.id;
    var body = req.body;
    var query = 'UPDATE tblpart SET ? WHERE idpart = ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, [body, id], function(error, results, fields) {
      if ( error ) {
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 500, "error": null, "response": results})
      }
    });
  },
  deleteAll: function(req, res){
    var query = 'DELETE FROM tblpart';
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