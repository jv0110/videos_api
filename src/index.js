require('dotenv').config();
const express = require('express');
const app = express();
const config = require('config');
const cors = require('cors');
const PORT = parseInt(config.PORT);

if(PORT !== 3020){
  app.use(require('morgan')('tiny'));
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// routes
app.use('/api', require('./routes/videos_router'));
app.use('/api', require('./routes/thumbs_router'));
app.use('/api', require('./routes/users_router'));

app.get('/', (req, res) => {
  res.redirect('/api');
});
app.get('/api', (req, res) => {
  return res.status(200).json({
    name: 'Videos API',
    version: 1.0,
    message: 'Welcome to the Videos API'
  });
});
app.listen(PORT, () => {
  console.log('Server started at port', PORT);
});
module.exports = app;