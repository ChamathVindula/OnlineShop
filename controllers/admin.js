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
    Product.findByPk(prodId).then(product => {
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
    }).catch(err => {
        console.log(err);
    });
}

exports.postEditProduct = (request, response, next) => {
    const id = request.body.id;
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;
    Product.findByPk(id).then(product => {          // findByPk returns an instance of Product with relavent fields populated
        product.title = title;                      // if product is found, this contains an Object. You can simply alter the
        product.price = price;                      // key-values/attributes and simply call save() on the instance to save the updates
        product.image = imageUrl;
        product.description = description;
        return product.save();                       // return is done here to avoid promise nesting
    }).then(result => {                              // this 'then' is for the returned promise from the save method
        // console.log(result);
        console.log('Book Updated');
        response.redirect('/admin/products');
    }).catch(err => {                                // this catch block catches errors for the first promise and the second promise
        console.log(err);
    });
}

exports.postAddProduct = (request, response, next) => {
    let title = request.body.title;
    let imageUrl = request.body.imageUrl;
    let description = request.body.description;
    let price = request.body.price;
    Product.create({
        title: title,
        price: price,
        image: imageUrl,
        description: description,
        userId: request.user.id
    }).then(product => {
        // console.log(product);
        console.log('Created new Product');
        response.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
}

exports.deleteProduct = (request, response, next) => {
    const prodId = request.params.productId;
    Product.destroy({
        where: {
            id: prodId
        }
    }).then(result => {
        console.log('Product Deleted');
        response.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
}

exports.getProducts = (request, response, next) => {
    Product.findAll().then(products => {
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
    }).catch(err => {
        console.log(err);
    });
}