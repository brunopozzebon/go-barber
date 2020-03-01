import 'dotenv/config';
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routers from './routers';
import sentryConfig from './config/sentry';
import './database/index';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routers();
    this.handlerErros();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routers() {
    this.server.use(routers);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  handlerErros() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV == 'development') {
        const youch = await new Youch(err, req).toJSON();
        return res.status(500).json(youch);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
