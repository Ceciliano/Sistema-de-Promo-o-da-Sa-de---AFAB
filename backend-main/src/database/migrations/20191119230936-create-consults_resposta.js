module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('consults_resposta', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      pergunta: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      resposta: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    return queryInterface.dropTable('consults_resposta');
  },
};
