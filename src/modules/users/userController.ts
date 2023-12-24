import { Response, Request } from "express"
import { createUserToDatabase } from "./userService";
import { db } from '../../utils/db.server';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

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
  const { email, password }: any = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      } as any,
    });


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
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const postUserScore = async (req: Request, res: Response) => {
  try {
    const { fullName, userId, scores }: any = req.body;

   
    const existingUser = await db.quizScore.findUnique({
      where: { userId: userId as any },
    });

    if (existingUser) {
      const existingScoresArray = Array.isArray(existingUser.scores) ? existingUser.scores : [];
      const updatedScores = [...existingScoresArray, scores];
      await db.quizScore.update({
        where: { userId: userId as any },
        data: {
          scores: updatedScores,
        },
      });
    } else {
      await db.quizScore.create({
        data: {
          fullName,
          userId,
          scores: [scores],
        },
      });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error handling quiz score:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(400).json({ error: 'User ID is already taken' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const getUserScore = async (req: Request, res: Response) => {
  try {
    const { id }: any = req.params;
    const userId = parseInt(id, 10);

    const user = await db.quizScore.findMany({
      where: {
        userId: userId 
      },
    });

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const scores = user.flatMap((record) => record.scores || []);

    res.status(200).json({ userId, scores });
  } catch (error) {
    console.error('Error getting quiz scores:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2016') {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllQuizScores = async (req: Request, res: Response) => {
  try {
    const quizzeScores = await db.quizScore.findMany();

    res.status(200).json(quizzeScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
}