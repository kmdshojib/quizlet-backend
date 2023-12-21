import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { db } from './utils/db.server';
import userRoute from './modules/users/userRoute';

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
    res.send("Hello World!");
})
app.use("/api/user", userRoute);
const main = async () => {
    try {
        await db.$connect();

        console.log('DB connection established');

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error({ error });
    }
};

main();

process.on('SIGTERM', async () => {
    await db.$disconnect();
    process.exit(0);
});