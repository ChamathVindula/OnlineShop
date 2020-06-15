const Product = require('../models/product.js');

const Cart = require('../models/cart.js');

const User = require('../models/user.js');

exports.getProducts = (request, response, next) => {
    Product.findAll().then(products => {
        response.render('shop/product-list.ejs', {
            prods: products, 
            docTitle: 'Shop', 
            path: '/products'
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProductDetails = (request, response, next) => {
    const prodId = request.params.productId;
    Product.findOne({where:{id:prodId}}).then(product => {
        response.render('shop/product-detail.ejs', {
            prod: product, 
            docTitle: product.title,
            path: '/products'
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getIndex = (request, response, next) => {
    Product.findAll()
    .then(products => {
        response.render('shop/product-list.ejs', {
            prods: products, 
            docTitle: 'Shop', 
            path: '/'
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.addToCart = (request, response, next) => {
    const prodId = request.body.productId;                                      // if there are values which will be used through multiple nests (e.g. promises) then make sure to add
    let userCart;                                                               // them to the top so it will be accessible throughout (e.g. here cart is taken from a promise and assigned to
    request.user.getCart()                                                      // top level variable?    
    .then(cart => {
        userCart = cart;
        return cart.getProducts({ where: { id: prodId }});
    })
    .then(products => {
        let product;
        if (products.length > 0){
            product = products[0];
            let oldQty = product['cart-item'].qty;
            let newQty = oldQty + 1;
            return userCart.addProduct(product, {through: {qty: newQty}});
        }else{
            Product.findByPk(prodId)
            .then(product => {
                return userCart.addProduct(product, {through: {qty: 1}});           // passing an instance of an existing associated table model (e.g. product) to the add{something} (e.g. addProduct())
            });                                                                     // method of its associating model (e.g. Cart) will create an entry in the intermediate table joining the two records
        }
    })
    .then(() => {
        response.redirect('/cart');
    })
    .catch(err => {
        console.log(err)
    });
}

exports.getCart = (request, response, next) => {     
    Product.findAll({include: [{model: Cart, where:{userId: request.user.id}}]})
    .then(products => {
        response.render('shop/cart.ejs', {
            path: '/cart',
            docTitle: 'Your Cart',
            products: products
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.deleteCartItem = (request, response, next) => {
    const productId = request.body.productId;
    request.user.getCart()
    .then(cart => {
        return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
        product = products[0];
        return product['cart-item'].destroy();
    })
    .then(result => {
        response.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getCheckout = (request, response, next) => {
    response.render('shop/checkout.ejs', {
        path: '/checkout',
        docTitle: 'Checkout'
    }, (err, html) => {
        if(!err){
            response.send(html);
        }else{
            console.log(err);
        }
    });
}

exports.gerOrders = (request, response, next) => {
    request.user.getOrders({include:[ {model: Product} ]})                              // all options used in querying using sequelize methods such as find(), findAll() can be used in 
    .then(orders => {                                                                   // special methods offered by associations. So eager loading (using include: [] option) which is used with 
        console.log(orders[0].products[1]['order-item']);                               // findAll() for example can be used here to retrieve associated table data
        response.render('shop/orders.ejs', {                                            // in this example user.getOrders() returns all the orders (all info of all user's orders) but it does
            orders: orders,                                                             // not return other data like the products in each order. So you can combine the options of eager loading
            path: '/orders',                                                            // with the association methods (here its the getOrders method) to retrieve all the orders and the
            docTitle: 'Orders'                                                          // include option makes sure to retrieve all the produts related to each order as well (just like regular querying)
        }, (err, html) => {                                                             // another way of doing this is Order.findAll({where:{userId: request.user.id}, include:[Product]})
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    })
    .catch(err =>{
        console.log(err);
    });
}

exports.postOrder = (request, response, next) => {
    let fetchedCart;
    request.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        request.user.createOrder()
        .then(order => {
            // products.forEach(product => {
            //     order.addProduct(product, {through: {qty: product['cart-item'].qty}});                           // one way of doing this but not recommended
            // });
            return order.addProducts(products.map( product => {                                                     // add all the product relationships at once using this function
                product['order-item'] = {qty: product['cart-item'].qty};                                            // to pass in values for the intermediate table (cannot use the through option like we did with adding a single record)
                return product;                                                                                     // add a new property into each product (that's why the map method has been used) which represents the 
            }));                                                                                                    // name of the intermediate model for the new relationship (e.g. order-item), this should match the model
        })                                                                                                          // name exactly. Sequelize will look for this attribute/property each time it adds a new relationship and
        .catch(err => {                                                                                             // use the data in that object for the intermediate table
            console.log(err);                                                                                       
        })
    })
    .then(result => {
        fetchedCart.setProducts(null);                                                                              // this is another method provided by sequelize, to delete all the associated records just pass in null
        response.redirect('/orders');                                                                               // you can also achive by using regular sql or using sequelize models
    })                                                                                                              // E.g. cartItems.destroy({where: {cartId: fetchedCart.id}});
    .catch(err => {
        console.log(err);
    });
}