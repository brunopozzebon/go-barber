import {
  isAfter,
  endOfDay,
  startOfDay,
  setSeconds,
  setMinutes,
  setHours,
  format,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointaments';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      res.status(400).json({ error: 'Date wasn´t sent' });
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.idprovider,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const squedule = [
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
    ];

    const availabily = squedule.map(time => {
      const [hour, minutes] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minutes),
        0
      );

      return {
        time,
        value: format(value, 'yyyy-MM-ddTHH:mm:ssxxx'),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(availabily);
  }
}

export default new AvailableController();
