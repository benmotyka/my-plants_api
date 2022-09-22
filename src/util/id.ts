import nanoid from 'nanoid';

const alphabet = 'ABCDEFGHKMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz';

const generator = nanoid.customAlphabet(alphabet, 6);

export const generateUserFriendlyId = () => generator();
