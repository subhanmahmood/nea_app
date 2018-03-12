//Import controllers
var Customers = require('./customers');
var Parts = require('./parts');
var Jobs = require('./jobs');
var JobParts = require('./jobparts');
var Appointment = require('./appointment')
var Contractor = require('./contractor');

//Export controllers in a single array
module.exports = {
    customer: Customers,
    part: Parts,
    job: Jobs,
    jobitem: JobParts,
    contractor: Contractor,
    appointment: Appointment
}