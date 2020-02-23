import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fails Validation' });
    }
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already created' });
    }
    const { id, name, email, providers } = await User.create(req.body);
    return res.json({ id, name, email, providers });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldpassword: Yup.string().min(6),

      password: Yup.string()
        .min(6)
        .when('oldpassword', (oldpassword, field) => {
          return oldpassword ? field.required() : field;
        }),
      confirmpassword: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fails Validation' });
    }

    const { email, oldpassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email already created' });
      }
    }

    if (oldpassword && !(await user.checkPassword(oldpassword))) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    const { id, name, provider } = await user.update(req.body);
    return res.send({ id, name, provider });
  }
}

export default new UserController();
