import User from '../models/User.js';


export const findSecretSantaMatch = async (email) => {
    const user = await User.findOne({ where: { email } });
    return { name: 'John Doe'};
};