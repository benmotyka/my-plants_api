import nanoid from 'nanoid';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const generator = nanoid.customAlphabet(alphabet, 6);

export const generateUserFriendlyId = () => generator();
