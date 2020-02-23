import { Router } from 'express';
import multer from 'multer';
import UserControler from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';
import FileController from './app/controllers/fileController';
import ProviderController from './app/controllers/providerController';
import AppointmentsController from './app/controllers/appointmentController';
import ScheduleController from './app/controllers/scheduleController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multerConfig';
import AvailableController from './app/controllers/availableController';

import NotificationController from './app/controllers/notificationController';

const routers = new Router();
const upload = multer(multerConfig);

routers.post('/users', UserControler.store);
routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);

routers.put('/users', UserControler.update);

routers.post('/files', upload.single('file'), FileController.store);

routers.get('/providers', ProviderController.index);
routers.get('/providers/:idprovider/available', AvailableController.index);

routers.post('/appointments', AppointmentsController.store);
routers.get('/appointments', AppointmentsController.index);
routers.delete('/appointments/:id', AppointmentsController.delete);

routers.get('/schedules', ScheduleController.index);

routers.get('/notifications', NotificationController.index);
routers.put('/notifications/:id', NotificationController.update);

export default routers;
