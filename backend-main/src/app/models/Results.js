import Sequelize, { Model } from 'sequelize';

class Results extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        comportamento: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Respostas, {
      through: 'results_respostas',
      as: 'respostas',
      foreignKey: 'respostas_id',
    });
  }
}

export default Results;
