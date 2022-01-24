import Results from '../models/Results';
const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    title: Yup.string().min(1),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }

  const plan = await Results.findByPk(req.params.id);

  if (!plan) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  }

  const { title } = req.body;

  if (title && title !== plan.title) {
    const planOld = await Results.findOne({ where: { title } });

    if (planOld) {
      return res.status(400).json({
        error: 'Validation fails',
        messages: [{ errors: ['Plan title not available'] }],
      });
    }
  }

  return next();
};
