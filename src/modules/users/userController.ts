import { Response, Request } from "express"
import { createUserToDatabase } from "./userService";
import { db } from '../../utils/db.server';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
    const userData = req.body;
    const user = await createUserToDatabase(userData);
    if (user) {
        res.status(200).send({
            message: "User created successfully!",
        });
    } else {
        res.status(404).send({
            message: "Oops! Something went wrong!",
        });
    }

}
export const loginUser = async (
    req: Request,
    res: Response,
  ) => {
    const { email, password }= req.body;
  
    try {
      const user = await db.user.findUnique({ where: { email } });
  
      if (!user) {
        return res
          .status(400)
          .json({ error: 'User not registered or invalid email address!' });
      }
  
      const matchPassword = await bcrypt.compare(password, user.password);
  
      if (!matchPassword) {
        return res.status(400).json({ error: 'Please check your password!' });
      }
  
  
      res.status(200).json({
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };