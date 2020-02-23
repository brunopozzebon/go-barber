import nodemailer from 'nodemailer';
import expHand from 'express-handlebars';
import nodemailerHand from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import emailConfig from '../config/email';

class Mail {
  constructor() {
    const { host, port, secure, auth } = emailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    this.configureTemplate();
  }

  configureTemplate() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerHand({
        viewEngine: expHand.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  send(message) {
    return this.transporter.sendMail({
      ...emailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
