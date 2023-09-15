import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import cinemaRoutes from './routes/cinema.route'

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

// Connection DB
connectDB()

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cors());
app.use(helmet());

// Routes
app.use('/cinemas', cinemaRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});