//Import database connection
var connection = require('../database.js')

module.exports = {
  addItem: function(req, res){
    var query = 'INSERT INTO tbljobitem SET ?';
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
    var query = 'SELECT * FROM tbljobitem';
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
    var query = 'SELECT name, cost_per_unit, idjob, tblpart.idpart, quantity FROM tbljobitem INNER JOIN tblpart ON tblpart.idpart = tbljobitem.idpart AND tbljobitem.idjob = ?';
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
    var idpart = req.query['idpart']
    var query = 'DELETE FROM tbljobitem WHERE idjob = ? AND idpart = ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, [id, idpart], function(error, results, fields) {
      if(error){
        res.send({ "status": 500, "error": error, "response": null })        
      }else{
        res.send({ "status": 200, "error": null, "response": results })    
      }  
    })
  },
  findAndUpdateById: function(req, res){
    //Get request body
    var body = req.body  
    //Get field name to update
    var fieldName = body.fieldName.toString()
    //Get new value
    var newValue = body[fieldName]
    //Get id of job from request parameters
    var idjob = parseInt(req.params.id)
    //Get id of part from request body
    var idpart = body.idpart
    var query = 'UPDATE tbljobitem SET ' + fieldName + ' = ? WHERE idjob = ? AND idpart = ?';
    //Execute query and send error if error, otherwise send success status code and results
    connection.query(query, [newValue, idjob, idpart], function(error, results, fields){
      if(error){
        res.send({ "status": 500, "error": error, "response": null })
      }else{
        res.send({ "status": 200, "error": null, "response": results });
      }
    })

  },
  deleteAll: function(req, res){
    var query = 'DELETE FROM tbljobitem';
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