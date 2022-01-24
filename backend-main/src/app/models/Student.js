import Sequelize, { Model } from 'sequelize';
import differenceInYears from 'date-fns/differenceInYears';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        weight: Sequelize.INTEGER,
        height: Sequelize.INTEGER,
        birthday: Sequelize.DATE,
        age: {
          type: Sequelize.VIRTUAL,
          get() {
            return differenceInYears(new Date(), this.birthday);
          },
        },
        atividades: Sequelize.STRING,
        telefone: Sequelize.STRING,
        naturalidade: Sequelize.STRING,
        religiao: Sequelize.STRING,
        raca: Sequelize.STRING,
        estadocivil: Sequelize.STRING,
        escolaridade: Sequelize.STRING,
        rendafamiliar: Sequelize.STRING,
        doencascronicas: Sequelize.STRING,
        niveldependencia: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  // static associate(models) {}
}

export default Student;
