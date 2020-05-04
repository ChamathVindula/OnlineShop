const fs = require('fs');
const path = require('path');

const p  = path.join(__dirname, '../', 'data', 'cart.json');


module.exports = class Cart{
    static addProduct(id, productPrice){
        // Fetch previos cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if(!err){
                cart = JSON.parse(fileContent);
            }
            // Analyze the data => Find the existing product
            const existingProductId = cart.products.findIndex((prod) => {
                return prod.id.toString() == id;
            });
            const existingProduct = cart.products[existingProductId];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct}
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductId] = updatedProduct;
            }else{
                updatedProduct = {id: id, qty: 1}
                cart.products.push(updatedProduct);
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), cart, (err) => {
                if(err){
                    console.log(err);
                }
            })
        });
    }

    static deleteProduct(id, price){
        fs.readFile(p, (err, fileContent) => {
            if(!err){
                let cart = JSON.parse(fileContent);
                const product = cart.products.find((product) => {
                    if(product.id === id.toString()){
                        return product;
                    }
                });
                if(product){
                    let productQty = product.qty;
                    cart.totalPrice = cart.totalPrice - (productQty * price);
                    cart.products = cart.products.filter((product) => {
                        if(product.id !== id.toString()){
                            return product;
                        }
                    });
                    fs.writeFile(p, JSON.stringify(cart), (err) => {
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }else{
                console.log(err);
            }
        });
    }

    static getProducts(callback){
        fs.readFile(p, (err, fileContent) => {
            if(!err){
                const cart = JSON.parse(fileContent);
                callback(cart.products);
            }else{
                callback(null);
            }
        });
    }

    static deleteProduct(productId, productPrice, callback){
        fs.readFile(p, (err, fileContent) => {
            if(!err){
                let updatedCartProducts, deletedProduct;
                let cart = JSON.parse(fileContent);
                updatedCartProducts = cart.products.filter((product) => {
                    if(product.id !== productId){
                        return product;
                    }else{
                        deletedProduct = product;
                    }
                });
                cart.products = updatedCartProducts;
                cart.totalPrice = cart.totalPrice - (productPrice * deletedProduct.qty);
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    if(!err){
                        callback();
                    }else{
                        console.log(err);
                    }
                });
            }else{
                console.log(err);
            }
        });
    }
}