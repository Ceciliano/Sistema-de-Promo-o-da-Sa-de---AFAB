import Sequelize, { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const {
      q: query = '',
      page = 1,
      limit = 10,
      name = '',
      doencascronicas = '',
      birthday = '',
      active = 2,
    } = req.query;

    const order = [];
    if (doencascronicas) {
      order.push(['doencascronicas', doencascronicas]);
    }
    if (birthday) {
      order.push(['birthday', birthday]);
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

    if (Number(active) === 0) {
      whereQuery.where.id = {
        [Op.notIn]: Sequelize.literal(
          `(SELECT student_id FROM registrations WHERE registrations.end_date >= DATE_ADD(NOW(), INTERVAL 1 hour) AND registrations.start_date <= DATE_SUB(NOW(), INTERVAL 1 hour))`
        ),
      };
    } else if (Number(active) === 1) {
      whereQuery.where.id = {
        [Op.in]: Sequelize.literal(
          `(SELECT student_id FROM registrations WHERE registrations.end_date >= DATE_ADD(NOW(), INTERVAL 1 hour) AND registrations.start_date <= DATE_SUB(NOW(), INTERVAL 1 hour))`
        ),
      };
    }

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
      atividades,
      naturalidade,
      religiao,
      raca,
      estadocivil,
      escolaridade,
      rendafamiliar,
      doencascronicas,
      niveldependencia,
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
      atividades,
      naturalidade,
      religiao,
      raca,
      estadocivil,
      escolaridade,
      rendafamiliar,
      doencascronicas,
      niveldependencia,
    } = req.body;

    await student.update({
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
      birthday,
    });

    return res.json(student);
  }

  async delete(req, res) {
    const deletedRows = await Student.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new StudentController();
