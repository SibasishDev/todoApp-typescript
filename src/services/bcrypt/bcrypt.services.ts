import bcrypt from 'bcrypt';

class BcryptService {
    saltRounds: number;

    constructor() {
        this.saltRounds = 10
    }

    /**
     * encrypt: To encrypt password.
     * @param password 
     * @returns 
     */
    encryptPassword(password: string) {
        return new Promise((resolve,reject) => {
            bcrypt.hash(password,this.saltRounds).then(hash => resolve(hash)).catch(err => reject("Internal server error"));
        })
    }

    /**
     * decrypt: To decrypt password.
     * @param data 
     * @returns 
     */
   async decryptPassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }
}

export const bcryptService = new BcryptService();