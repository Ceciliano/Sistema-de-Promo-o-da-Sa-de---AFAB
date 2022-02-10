import { Op } from 'sequelize';
import Results from '../models/Results';
import Respostas from '../models/Respostas';
import Plan from '../models/Plan';

class ResultsController {
  async index(req, res) {
    const { q: query = '', page = 1, limit = 10, title = '' } = req.query;

    const order = [];
    if (title) {
      order.push(['title', title]);
    }
    if (!order.length) {
      order.push(['title', 'asc']);
    }
    const data = await Results.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Respostas,
          as: 'respostas',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'plan_id'],
          },
          include: [
            {
              model: Plan,
              as: 'plan',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
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
      results: data.rows,
      page,
      last_page: Math.ceil(data.count / limit),
      total: data.count,
    });
  }

  async store(req, res) {
    const { title, comportamento, respostas } = req.body;
    const newRecord = await Results.create({
      title,
      comportamento,
    });
    const results = await Results.findByPk(respostas[0].id);
    await newRecord.addRespostas(results, {
      through: { selfGranted: false },
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const results = await Results.findByPk(req.params.id);
    const { title, comportamento } = req.body;

    await results.update({
      title,
      comportamento,
    });

    return res.json(results);
  }

  async delete(req, res) {
    const deletedRows = await Results.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new ResultsController();
