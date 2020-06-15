const Sequelize = require('Sequelize');

const sequelize = require('../utils/database');

module.exports = sequelize.define('order-item', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});