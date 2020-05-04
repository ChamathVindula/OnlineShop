const express = require('express');

const adminController = require('../controllers/admin.js');

const router = express.Router();

router.get('/add-product', adminController.getAddProductPage);

router.get('/get-edit-product/:productId', adminController.getEditProductPage);

router.post('/edit-product', adminController.postEditProduct);

router.get('/delete-product/:productId', adminController.deleteProduct);

router.get('/products', adminController.getProducts);

router.post('/product', adminController.postAddProduct);

module.exports = router;