import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';

class JwtService {
    createToken = (id : number, email : string) => {
        return new Promise((resolve,reject) => {
            jwt.sign({ id, email }, config.JWT_SECRET, { expiresIn: 1 * 60 * 60 }, function (err, token) {
                if (err) resolve(false);
                resolve(token);
            });
        });
    }
}

export const jwtService = new JwtService();