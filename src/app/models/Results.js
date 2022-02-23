import Sequelize, { Model } from 'sequelize';

class Results extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Respostas, {
      through: 'results_respostas',
      as: 'respostas',
      foreignKey: 'results_id',
    });
  }
}

export default Results;
