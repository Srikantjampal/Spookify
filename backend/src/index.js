dotenv.config();
import dotenv from "dotenv";
import express from "express";
import { clerkMiddleware } from '@clerk/express'
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import fs from "fs"

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stats.route.js";
import { connectDB } from "./lib/db.js";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const server = createServer(app);
initializeSocket(server);

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));

app.use(express.json());
app.use(clerkMiddleware());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname,"tmp"),
    createParentPath: true,
    limits: {fileSize: 10 * 1024 * 1024}, //10mb
}));

const tempDir = path.join(process.cwd(),tmp);

app.use(express.urlencoded({extended: true}));

cron.schedule("0 * * * *",()=>{
    if(fs.existsSync(tempDir)){
        fs.readdir(tempDir,(err,files)=>{
            if(err){
                console.log("error",err);
                return;
            }
            for(const file of files){
                fs.unlink(path.join(tempDir,file),(err)=>{});
            }
        })
    }
})

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/song",songRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statsRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{res.sendFile(path.resolve(__dirname,"../frontend/dist/index.html"))})
}

//error handler
app.use((err,req,res,next) => {
    res.status(500).json({message:process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message});
});

server.listen(PORT, () => {
    console.log("Server is running on port 5000");
    connectDB();
});
