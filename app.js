const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const userRoutes = require('./server/routes/user');
const app = express();

app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('cors')());

app.use(passport.initialize());
require('./server/middleware/passport')(passport);


app.use('/api/users', userRoutes);

module.exports = app;