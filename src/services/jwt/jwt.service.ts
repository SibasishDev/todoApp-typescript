import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';

class JwtService {
    createToken = (id : number, email : string, uuid : string) => {
        return new Promise((resolve,reject) => {
            jwt.sign({ id, email, uuid }, config.JWT_SECRET, { expiresIn: 1 * 60 * 60 }, function (err, token) {
                if (err) resolve(false);
                resolve(token);
            });
        });
    }

    createRefreshToken = (id : number) => {
        return new Promise((resolve,reject) => {
            jwt.sign({ id }, config.JWT_REFRESH_SECRET, { expiresIn: 1 * 60 * 60 }, function (err, token) {
                if (err) resolve(false);
                resolve(token);
            });
        });
    }

    verifyAccessToken = (token : string) => {
        return new Promise((resolve,reject) => {
            jwt.verify(token,config.JWT_SECRET, (err,decoded) => {
                if(err) reject(err);
                resolve(decoded);
            })
        });
    }
}

export const jwtService = new JwtService();