import { parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const {
      q: query = '',
      page = 1,
      limit = 10,
      name = '',
      telefone = '',
      doencascronicas = '',
      birthday = '',
    } = req.query;

    const order = [];
    if (doencascronicas) {
      order.push(['doencascronicas', doencascronicas]);
    }
    if (birthday) {
      order.push(['birthday', birthday]);
    }
    if (telefone) {
      order.push(['telefone', telefone]);
    }
    if (name) {
      order.push(['name', name]);
    }
    if (!order.length) {
      order.push(['name', 'asc']);
    }

    const whereQuery = {
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
    };

    const data = await Student.findAndCountAll({
      ...whereQuery,
      order,
      limit,
      offset: (page - 1) * limit,
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    });

    return res.json({
      students: data.rows,
      page,
      last_page: Math.ceil(data.count / limit),
      total: data.count,
    });
  }

  async store(req, res) {
    const {
      name,
      email,
      weight,
      height,
      birthday,
      telefone,
      atividades,
      naturalidade,
      religiao,
      raca,
      estadocivil,
      escolaridade,
      rendafamiliar,
      doencascronicas,
      niveldependencia,
      comportamentoanterior,
    } = req.body;

    const birthdayParsed = parseISO(birthday);

    const newRecord = await Student.create({
      name,
      email,
      weight,
      height,
      atividades,
      naturalidade,
      religiao,
      raca,
      estadocivil,
      escolaridade,
      rendafamiliar,
      doencascronicas,
      niveldependencia,
      telefone,
      comportamentoanterior,
      birthday: new Date(
        Date.UTC(
          birthdayParsed.getFullYear(),
          birthdayParsed.getMonth(),
          birthdayParsed.getDate()
        )
      ),
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const student = await Student.findByPk(req.params.id);

    const {
      name,
      email,
      weight,
      height,
      birthday,
      telefone,
      atividades,
      naturalidade,
      religiao,
      raca,
      estadocivil,
      escolaridade,
      rendafamiliar,
      doencascronicas,
      niveldependencia,
      comportamentoanterior,
    } = req.body;

    await student.update({
      name,
      email,
      weight,
      height,
      telefone,
      atividades,
      naturalidade,
      religiao,
      raca,
      estadocivil,
      escolaridade,
      rendafamiliar,
      doencascronicas,
      niveldependencia,
      birthday,
      comportamentoanterior,
    });

    return res.json(student);
  }

  async delete(req, res) {
    const deletedRows = await Student.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new StudentController();
