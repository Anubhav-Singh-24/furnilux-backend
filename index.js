import express from 'express'
import cors from 'cors';
import ConnectToDb from './db.js';
import router from './routes/router.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "https://furni-lux.netlify.app", credentials: true }));
app.use(cookieParser())

const PORT = process.env.PORT || 3000;

ConnectToDb();
app.use("/",router)
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})