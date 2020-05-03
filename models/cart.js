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
            }else{
                //console.log(err);
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
}