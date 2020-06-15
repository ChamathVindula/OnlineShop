const Sequelize = require('Sequelize');

const sequelize = require('../utils/database');

module.exports = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
}); 