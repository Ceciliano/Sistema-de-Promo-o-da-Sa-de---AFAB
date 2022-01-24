import { Op } from 'sequelize';
import Results from '../models/Results';

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
    const { title } = req.body;
    const newRecord = await Results.create({
      title,
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const results = await Results.findByPk(req.params.id);
    const { title } = req.body;

    await results.update({
      title,
    });

    return res.json(results);
  }

  async delete(req, res) {
    const deletedRows = await Results.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new ResultsController();
