'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            message.hasMany(models.reply)
        };
    };
    message.init({
        content: DataTypes.STRING,
        is_deleted: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'message',
        underscored: true,
    });
    return message;
};