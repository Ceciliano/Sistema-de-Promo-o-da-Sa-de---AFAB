module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('consult_resposta', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      pergunta: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resposta: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      consult_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'consults', key: 'id' },
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
    return queryInterface.dropTable('consult_resposta');
  },
};
