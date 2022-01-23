import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
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
    this.hasMany(models.Respostas, { as: 'respostas', foreignKey: 'plan_id' });
  }
}

export default Plan;
