const Yup = require('yup');

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    respostas: Yup.array().required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: error.inner });
  }

  return next();
};
