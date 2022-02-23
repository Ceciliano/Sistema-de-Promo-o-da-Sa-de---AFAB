module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('consults', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      acao_imediata_baixo_controle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      compromisso: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      comportamento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      acao_imediata_alto_controle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('consults');
  },
};
