import Results from '../models/Results';

export default async (req, res, next) => {
  const plan = await Results.findByPk(req.params.id);

  if (!plan) {
    return res.status(404).json({
      error: 'Validation fails',
      messages: [{ errors: ['Plan not found'] }],
    });
  }

  return next();
};
