import { Router } from 'express';

const routers = new Router();

routers.get('/', (req, res) => {
  res.send('Server inicialized');
});

export default routers;
