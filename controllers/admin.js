const Product = require('../models/product.js');

exports.getAddProductPage = (request, response, next) =>{
    response.render('admin/add-or-edit-product.ejs', {
        docTitle: 'Add Product', 
        path: '/admin/add-product',
        edit: false
    }, (err, html) => {
        if(!err){
            response.send(html);
        }else{
            console.log(err);
        }
    });
}

exports.getEditProductPage = (request, response, next) => {
    const edittable = request.query.edit;
    const prodId = request.params.productId;
    let edit = false;
    if(edittable === "true"){
        edit = true;
    }
    Product.findProductById(prodId, (product) => {
        response.render('admin/add-or-edit-product.ejs', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            edit: edit
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    });
}

exports.postEditProduct = (request, response, next) => {
    const id = request.body.id;
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;
    Product.editProduct(id, title, imageUrl, price, description, () => {
        response.redirect('/admin/products');
    });
}

exports.postAddProduct = (request, response, next) => {
    let title = request.body.title;
    let imageUrl = request.body.imageUrl;
    let description = request.body.description;
    let price = request.body.price;
    let product = new Product(title, imageUrl, description, price);
    product.saveProduct();
    response.redirect('/');
}

exports.deleteProduct = (request, response, next) => {
    const prodId = request.params.productId;
    Product.deleteProduct(prodId);
    
    response.redirect('/admin/products');
}

exports.getProducts = (request, response, next) => {
    Product.getProducts((products) => {
        // render method without a callback
        response.render('admin/products.ejs', {
            prods: products, 
            docTitle: 'Admin Product List', 
            path: '/admin/products'
        }, (err, html) => {
            if(!err){
                response.send(html);
            }else{
                console.log(err);
            }
        });
    });
}