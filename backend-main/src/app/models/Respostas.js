import Sequelize, { Model } from 'sequelize';

class Respostas extends Model {
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
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
    this.belongsToMany(models.Results, {
      through: 'results_respostas',
      as: 'results',
      foreignKey: 'respostas_id',
    });
  }
}

export default Respostas;
