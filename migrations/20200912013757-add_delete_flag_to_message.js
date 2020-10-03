'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('messages', 'is_deleted', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.remeveColumn('messages', 'is_deleted');
    }
};