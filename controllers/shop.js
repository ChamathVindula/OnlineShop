const Product = require('../models/product.js');

const Cart = require('../models/cart.js');

exports.getProducts = (request, response, next) => {
    Product.getProducts((products) => {
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
    });
}

exports.getProductDetails = (request, response, next) => {
    const prodId = request.params.productId;
    Product.findProductById(prodId, (product) => {
        response.render('shop/product-detail.ejs', {
            prod: product, 
            docTitle: 'Product Details',
            path: '/products'
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    });
    
}

exports.getIndex = (request, response, next) => {
    Product.getProducts((products) => {
        response.render('shop/index.ejs', {
            prods: products,
            docTitle: 'Shop',
            path: '/'});
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
        }
    });
}

exports.addToCart = (request, response, next) => {
    const prodId = request.body.productId;
    Product.findProductById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
        response.redirect('/products');
    });
}

exports.getCart = (request, response, next) => {
    Cart.getProducts((cart) => {
        Product.getProducts((products) => {
            cartProducts = [];
            for(let product of products){
                cartProduct = cart.find(prod => prod.id === product.id.toString());
                if(cartProduct){
                    cartProducts.push({productData: product, qty: cartProduct.qty});
                }
            }
            response.render('shop/cart.ejs', {
                path: '/cart',
                docTitle: 'Your Cart',
                products: cartProducts
            }, (err, html) => {
                if(!err){
                    response.send(html);
                }else{
                    console.log(err);
                }
            });
        });
    });
}

exports.deleteCartItem = (request, response, next) => {
    const productId = request.body.productId;
    Product.findProductById(productId, (prod) => {
        Cart.deleteProduct(productId, prod.price);
    });
    response.redirect('/cart');
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
    response.render('shop/orders.ejs', {
        path: '/orders', 
        docTitle: 'Orders'
    }, (err, html) => {
        if(!err){
            response.send(html);
        }else{
            console.log(err);
        }
    });
}