import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT_TOKEN;

export default class AuthController {
    // verify the token created when login
    // to make sure the user is login to access several APIs
    static verifyToken(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({ error: 'Token is missing' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            req.user = decoded;
            next();
        });
    }
}