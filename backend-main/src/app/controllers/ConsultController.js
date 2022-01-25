import Consult from '../models/Consult';

class ConsultController {
  async index(req, res) {
    const order = [['created_at', 'desc']];
    const data = await Consult.findAndCountAll({
      where: {
        student_id: req.params.student_id,
      },
      order,
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    });

    return res.json({
      consult: data.rows,
      total: data.count,
    });
  }

  async store(req, res) {
    const { title } = req.body;
    const newRecord = await Consult.create({
      title,
    });

    return res.json(newRecord);
  }

  async update(req, res) {
    const plan = await Consult.findByPk(req.params.id);

    const { title } = req.body;

    await plan.update({
      title,
    });

    return res.json(plan);
  }

  async delete(req, res) {
    const deletedRows = await Consult.destroy({ where: { id: req.params.id } });

    return res.json({ deletedRows });
  }
}

export default new ConsultController();
