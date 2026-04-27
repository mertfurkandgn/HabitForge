import { AppError } from "../../utils/app-error";
import { generateToken } from "../../utils/jwt";
import { hashPassword,comparePassword } from "../../utils/password";
import { findByEmail,createUser } from "./auth.repository";

export const register = async (data: { email: string, password: string, name: string }) => {

    const {email,password,name} = data;

    const user = await findByEmail(email);
    if(user){
     throw   AppError.conflict('Email already registered')
    }

    const newPassword = await hashPassword(password); 

    const newData = { email, passwordHash: newPassword, name };

    const newUser = await createUser(newData);

    const token = generateToken({ userId: newUser.id });
    return { user: newUser, token };
}

export async function login(data: { email: string, password: string}) {
    
    const {email,password} = data;

    const user = await findByEmail(email);
    if(!user){
     throw   AppError.unauthorized('Invalid credentials')
    }
    const storedHash = user.passwordHash;

    const comparePass = await comparePassword(password,storedHash);

    if(!comparePass){
        throw AppError.unauthorized('Invalid credentials')
    }
    const userToken =   generateToken( { userId: user.id })

    return { user, token: userToken };


}
