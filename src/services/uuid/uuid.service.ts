import {v4 as uuidv4} from 'uuid';

export const createUuid = () => {
    const uuid = uuidv4();
    return uuid;
}