import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(400).send({ error: 'Token not provided' });
  }

  const [, token] = bearer.split(' ');
  if (token === 'undefined') {
    return res.status(400).send({ error: 'Undefined Token' });
  }
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (e) {
    return res.status(400).send({ error: 'InvalidToken' });
  }
};
