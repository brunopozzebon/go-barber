import User from '../models/User';
import Notification from '../schemas/Notifications';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: {
        id: req.userId,
        providers: true,
      },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ message: 'Only providers cound receive notifications' });
    }

    const notifications = await Notification.find({
      userId: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json({ notifications });
  }

  async update(req, res) {
    const notifications = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      { new: true }
    );

    return res.json(notifications);
  }
}

export default new NotificationController();
