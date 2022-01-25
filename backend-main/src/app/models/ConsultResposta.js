import Sequelize, { Model } from 'sequelize';

class ConsultResposta extends Model {
  static init(sequelize) {
    super.init(
      {
        pergunta: Sequelize.STRING,
        resposta: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Consult, { foreignKey: 'consult_id', as: 'consult' });
  }
}

export default ConsultResposta;
