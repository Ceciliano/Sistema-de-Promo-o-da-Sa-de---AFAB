import Sequelize, { Model } from 'sequelize';

class Consult extends Model {
  static init(sequelize) {
    super.init(
      {
        acaoImediataBaixoControle: Sequelize.STRING,
        compromisso: Sequelize.STRING,
        comportamento: Sequelize.STRING,
        acaoImediataAltoControle: Sequelize.STRING,
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
