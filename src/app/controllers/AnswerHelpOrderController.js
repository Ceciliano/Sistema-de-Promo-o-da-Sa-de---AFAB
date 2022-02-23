import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class AnswerHelpOrderController {
  async store(req, res) {
    const helpOrder = await HelpOrder.findByPk(req.params.help_order_id);

    const { answer } = req.body;

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    const updatedHelpOrder = await HelpOrder.findByPk(helpOrder.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(updatedHelpOrder);
  }
}

export default new AnswerHelpOrderController();
