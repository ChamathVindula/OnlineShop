const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/404.js');

const sequelize = require('./utils/database');

const Product = require('./models/product');

const User = require('./models/user');

const Cart = require('./models/cart');

const CartItem = require('./models/cart-item');

const OrderItem = require('./models/order-item');

const Order = require('./models/order');


const app = express();

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    User.findByPk(1).then(user => {
        request.user = user;
        next();
    });
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorController.getpageNotFound);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Product);

User.hasOne(Cart);

Product.belongsToMany(Cart, { through: CartItem });

Cart.belongsToMany(Product, { through: CartItem });

User.hasMany(Order);

Order.belongsTo(User);

Product.belongsToMany(Order, { through: OrderItem });

Order.belongsToMany(Product, { through: OrderItem });

sequelize.sync()
.then(result => {
    // console.log(result);
    return User.findOrCreate({where:{name: 'Chamath'}, defaults:{email: 'abc@gmail.com'}});
}).then(([user, created]) => {
    if(created){
        user.createCart();
        console.log('New User Created');
    }
    else console.log('User Exists');
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
