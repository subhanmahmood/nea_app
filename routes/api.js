//Import express and controllers
var express = require( 'express' )
var router = express.Router( )
var controllers = require('../controllers');

/*OBJECTIVE
11.0 - Write an API to allow the application to 
interface with the server
11.1 - The client must be able to make a request 
to the server. The server will respond by executing 
the relevant MySQL query and if applicable, sending 
the returned data as JSON to the client.
*/

//Each function gets the apporopriate controller and
//executes the method depending on the HTTP method
router.get( '/:resource', function( req, res, next ) {
  var resource = req.params.resource;
  var controller = controllers[resource];
  controller.find(req, res);
});

router.get( '/:resource/:id', function( req, res, next ) {
  var resource = req.params.resource;
  var controller = controllers[resource];
  controller.findById(req, res);
});

router.put( '/:resource/:id', function( req, res, next ) {
  var resource = req.params.resource
  var controller = controllers[resource];
  controller.findAndUpdateById(req, res);
})

router.post('/moodle', function(req, res){
  console.log(req.body)
  res.send(["gonk"])
})

router.post( '/:resource', function( req, res, next ) {
  var resource = req.params.resource
  var controller = controllers[resource];
  controller.addItem(req, res);
})

router.delete('/:resource/:id', function(req, res, next) {
  var resource = req.params.resource;
  var controller = controllers[resource];
  controller.deleteById(req, res);
})


module.exports = router;