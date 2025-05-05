import express from "express";
import bodyParser from "body-parser";
import {config} from "dotenv";
import sequelize from "./utils/database.js";
import cors from "cors";
import messageRoutes from './routes/messageControllerRoutes.js';

// Initialize environment variables
config();

const app = express();

// CORS
app.use(cors({origin: "http://localhost:3000"}));

// Middleware
app.use(bodyParser.json());

// Message routes
app.use('/messages', messageRoutes);

// Root route
app.get("/", (req, res) => {
    res.status(200).json({message: "Interview task"});
});

// Global Error Handling Middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({success: false, message: message, data: data});
});

// DB Connection
sequelize
    .sync({alter: true})
    .then(() => {
        console.log("Connection has been established successfully.");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });

export default app;
