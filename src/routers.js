import { Router } from 'express';
import UserControler from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';
import authMiddleware from './app/middlewares/auth';

const routers = new Router();

routers.post('/users', UserControler.store);
routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);

routers.put('/users', UserControler.update);

export default routers;
