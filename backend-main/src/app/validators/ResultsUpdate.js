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

  const results = await Results.findByPk(req.params.id);

  if (!results) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Results not found'] }],
    });
  }

  return next();
};
