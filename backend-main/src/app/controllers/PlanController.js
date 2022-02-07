import { Op } from 'sequelize';
import Plan from '../models/Plan';
import Respostas from '../models/Respostas';

class PlanController {
  async index(req, res) {
    const { q: query = '', page = 1, limit = 10, title = '' } = req.query;

    const order = [];
    if (title) {
      order.push(['title', title]);
    }
    if (!order.length) {
      order.push(['id', 'asc']);
    }
    const data = await Plan.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [
        {
          model: Respostas,
          as: 'respostas',
        },
      ],
      order,
      limit,
      offset: (page - 1) * limit,
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    });

    return res.json({
      plans: data.rows,
      page,
      last_page: Math.ceil(data.count / limit),
      total: data.count,
    });
  }

  async store(req, res) {
    const { title, respostas } = req.body;
    const newRecord = await Plan.create({
      title,
    });

    respostas.map(key => {
      Respostas.create({
        title: key.title,
        plan_id: newRecord.dataValues.id,
      });
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    const { title, respostas } = req.body;

    await plan.update({
      title,
    });
    await Respostas.destroy({ where: { plan_id: plan.dataValues.id } });
    await Promise.all(
      respostas.map(async key => {
        await Respostas.create({
          title: key.title,
          plan_id: plan.dataValues.id,
        });
      })
    );

    const response = await Plan.findByPk(req.params.id, {
      include: [
        {
          model: Respostas,
          as: 'respostas',
        },
      ],
    });

    return res.json(response);
  }

  async delete(req, res) {
    const deletedRows = await Plan.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new PlanController();
