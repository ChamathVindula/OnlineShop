const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/404.js');

const sequelize = require('./utils/database');

const app = express();

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorController.getpageNotFound);

sequelize.sync({force: true}).then(result => {
    // console.log(result);
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
