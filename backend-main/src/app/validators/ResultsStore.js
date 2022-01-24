import Results from '../models/Results';
const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }

  const planCount = await Results.count({ where: { title: req.body.title } });

  if (planCount) {
    return res.status(400).json({
      error: 'Validation fails',
      messages: [{ errors: ['Plan title not available'] }],
    });
  }

  return next();
};
