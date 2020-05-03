const fs = require('fs');

const path = require('path');

const p  = path.join(__dirname, '../', 'data', 'products.json');

const getProductsFromFile = function(callback){
    fs.readFile(p, (err, fileContent) => {
        if(!err){
            callback(JSON.parse(fileContent));
        }
        else{
            callback([]);
        }
    });
}

module.exports = class Product{
    constructor(title, image, description, price){             
        this.id = Math.random();
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
    }

    saveProduct(){
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(err){
                    console.log(err);
                }
            });
        });
    }

    static editProduct(id, title, imageUrl, price, description, callback){
        getProductsFromFile((products) => {
            const productIndex = products.findIndex((product) => {
                if(product.id.toString() === id){
                    return product;
                }
            });
            products[productIndex].id = id;
            products[productIndex].title = title;
            products[productIndex].image = imageUrl;
            products[productIndex].price = price;
            products[productIndex].description = description;
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(!err){
                    callback();
                }else{
                    console.log(err);
                }
            });
        });
    }

    static getProducts(callback){
        getProductsFromFile(callback);
    }

    static findProductById(prodId, callback){
        getProductsFromFile((products) => {
            const product = products.find((p) => {
                if(p.id.toString() === prodId){
                    return p;
                }
            });
            callback(product);
        });
    }
}