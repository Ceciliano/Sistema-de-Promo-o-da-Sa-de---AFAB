import Sequelize, { Model } from 'sequelize';

class Consult extends Model {
  static init(sequelize) {
    super.init(
      {
        result: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default Consult;
