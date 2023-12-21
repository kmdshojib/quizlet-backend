import bcrypt from 'bcrypt';
import { db } from '../../utils/db.server';

interface IUser {
    fullName: string;
    email: string;
    password: string;
}
export const createUserToDatabase = async (payload: IUser): Promise<IUser> => {
    const { fullName, email, password, } = payload;

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
        data: {
            fullName,
            email,
            password: encryptedPassword,
        },
    });

    return newUser;
};
