module.exports = {
    'beer' :require('./controllers/BeerController'),
    'user': require('./controllers/UserController.js'),
    'location': require('./controllers/LocationController.js'),
    'style': require('./controllers/StyleController.js'),
    'signup': require('./controllers/SignUpController.js'),
    'authorize' : require ('./controllers/Authenticate.js'),
    'mybeers': require('./controllers/UserBeerController.js'),
    "mylocations": require('./controllers/UserLocationController.js'),
    'beer-style': require('./controllers/BeerStyleController.js')
};