import * as Yup from 'yup';
import { startOfHour, isBefore, parseISO, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointaments';
import User from '../models/User';
import File from '../models/File';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import Notification from '../schemas/Notifications';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }
    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        providers: true,
      },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'No provider selected' });
    }

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'Invalid Date' });
    }

    const appointmentAvailability = await Appointment.findOne({
      where: {
        provider_id,
        date: hourStart,
        canceled_at: null,
      },
    });

    if (appointmentAvailability) {
      return res.status(401).json({ error: 'This date isn´t available' });
    }

    const appoitments = await Appointment.create({
      provider_id,
      date: hourStart,
      user_id: req.userId,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "dd 'de' MMMM', às 'H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} no dia ${formattedDate}`,
      userId: req.userId,
    });

    return res.json({ appoitments });
  }

  async index(req, res) {
    const { page } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancellable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ appointments });
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        { model: User, as: 'user', attributes: ['name'] },
      ],
    });
    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json('You dont have privilieges to delete this appoitnemt');
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json(
          'You can´t cancel this appointment, cancellation must be done with 2 yours in advance'
        );
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });
    return res.json({ appointment });
  }
}

export default new AppointmentController();
