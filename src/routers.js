import { Router } from 'express';
import multer from 'multer';
import UserControler from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';
import FileController from './app/controllers/fileController';
import ProviderController from './app/controllers/providerController';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multerConfig';

const routers = new Router();
const upload = multer(multerConfig);

routers.post('/users', UserControler.store);
routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);

routers.put('/users', UserControler.update);

routers.post('/files', upload.single('file'), FileController.store);

routers.get('/providers', ProviderController.index);

export default routers;
