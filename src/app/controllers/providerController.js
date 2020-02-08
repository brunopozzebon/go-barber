import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { providers: true },
      attributes: ['id', 'name', 'email'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['id', 'name', 'path', 'url'],
      },
    });

    res.json(providers);
  }
}

export default new ProviderController();
