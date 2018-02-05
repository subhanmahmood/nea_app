var authController = require('../controllers/authcontroller.js');

/*
OBJECTIVE 
1.0 - Create an authentication system which includes 
the email and password for the user.
1.1 - Once the user has entered their details, 
they will be checked against the relevant table in 
the MySQL Database, redirecting the user to the 
dashboard if the login is successful. 
*/
 
module.exports = function(app, passport) {
    app.get('/logout',authController.logout);
    app.get('/dashboard',isLoggedIn, authController.dashboard);
    app.get('/signup', function(req, res, next) {
        res.render('index', { title: 'TA Home Improvements', source: 'signup' });
    });
    app.get('/signin', function(req, res, next) {
        res.render('index', { title: 'TA Home Improvements', source: 'signin' });
    });
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'TA Home Improvements', source: 'dashboard' });
    });
    
    app.get('/jobs', function(req, res, next) {
        res.render('index', {title: 'Jobs', source: 'jobs'})
    })
    
    app.get('/jobs/:id', function(req, res, next){
        res.render('singleItem', {title: 'Job', source: 'job', id: req.params.id})
    })
    
    app.get('/jobs/:id/invoice', function(req, res, next){
        res.render('singleItem', {title: 'Invoice', source: 'invoice', id: req.params.id})
    })
    
    app.get('/jobs/:id/edit', function(req, res, next) {
        res.render('singleItem', {title: 'Edit Customer', source: 'editCustomer', id: req.params.id})
    })
    
    app.get('/customers', function(req, res, next) {
        res.render('index', {title: 'Customers', source: 'customers'})
    });
    
    app.get('/customers/:id/edit', function(req, res, next) {
        res.render('singleItem', {title: 'Edit Customer', source: 'editCustomer', id: req.params.id})
    })
    
    app.get('/parts', function(req, res, next) {
        res.render('index', {title: 'Parts', source: 'parts'});
    })
    
    app.get('/appointments', function(req, res, next){
        res.render('index', {title: 'Appointments', source: 'appointments'});
    })
    
    app.get('/finances', function(req, res, next){
        res.render('index', {title: 'Finances', source: 'finances'})
    });

    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', 
        failureRedirect: '/signup'
    }));

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/', 
        failureRedirect: '/jobs'
    }));

    
    function isLoggedIn(req, res, next) {    
        if (req.isAuthenticated())        
            return next();            
        res.redirect('/signin');    
    }
}
