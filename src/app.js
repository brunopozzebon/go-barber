import express from 'express';
import routers from './routers';

import './database/index';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routers();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routers() {
    this.server.use(routers);
  }
}

export default new App().server;
