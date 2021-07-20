const config = require('config');
// set req.file for testing purposes
module.exports = (req, res, next) => {
  if(parseInt(config.PORT) === 3020) { // checks if port is equal to the tests port
    if(typeof(req.body.key) !== 'undefined' || typeof(req.body.size) !== 'undefined'
    || typeof(req.body.location) !== 'undefined'){
      req.file = {
        key: req.body.key,
        size: req.body.size,
        location: req.body.location
      }
    }
  }
  next();
}