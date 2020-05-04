const express = require('express');

const shopController = require('../controllers/shop.js');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/product-details/:productId', shopController.getProductDetails);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.addToCart);

router.post('/cart-product-delete', shopController.deleteCartItem);

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.gerOrders);

module.exports = router;