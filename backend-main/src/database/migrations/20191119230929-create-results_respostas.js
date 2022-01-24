module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('results_respostas', {
      respostas_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'respostas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      results_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'results', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('results_respostas');
  },
};
