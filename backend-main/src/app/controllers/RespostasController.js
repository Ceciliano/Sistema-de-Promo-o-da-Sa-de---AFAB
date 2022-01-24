import { Op } from 'sequelize';
import Respostas from '../models/Respostas';

class RespostasController {
  async index(req, res) {
    const {
      q: query = '',
      page = 1,
      limit = 10,
      title = '',
      plan_id = '',
    } = req.query;

    const order = [];
    if (title) {
      order.push(['title', title]);
    }
    if (!order.length) {
      order.push(['title', 'asc']);
    }
    const data = await Respostas.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
        plan_id,
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order,
      limit,
      offset: (page - 1) * limit,
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    });

    return res.json({
      respostas: data.rows,
      page,
      last_page: Math.ceil(data.count / limit),
      total: data.count,
    });
  }
}

export default new RespostasController();
