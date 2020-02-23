import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'Cancellation';
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log('Fila consumida');

    await Mail.send({
      to: `${appointment.provider.name} <brunopozzebon44@gmail.com>`,
      subject: `You have one cancellation`,
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), "dd 'de' MMMM', às 'H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CancellationMail();
