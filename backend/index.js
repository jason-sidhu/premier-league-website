import express from "express"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"; 
import path from "path"; 
import helmet from "helmet"; 
import morgan from "morgan"; 
import { fileURLToPath } from "url"; 
import authRoute from "./routes/auth.js"; 
import profileRoute from "./routes/profile.js";
import fantasyRoute from "./routes/fantasy.js";
import matchesRoute from "./routes/matches.js"; 
import predictionsRoute from "./routes/predictions.js";
import leaderboardRoute from "./routes/leaderboard.js"


//CONFIGURATIONS and middleware 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

//invoke env and express application and use middleware 
dotenv.config(); 
const app = express(); 
const PORT = process.env.PORT || 6001;

//middleware 
app.use(express.json()); 
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"})); 
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true})); 
app.use(bodyParser.urlencoded({limit: "30mb", extended: true})); 
app.use(cors()); 


//ROUTES
// //call this api to register, auth reg is the api path, register is the controller (logic of the endpoint)
// app.post("/auth/register", register); 
app.use("/auth", authRoute); 
app.use("/profile", profileRoute);
app.use("/fantasy", fantasyRoute);
app.use("/matches", matchesRoute);
app.use("/predictions", predictionsRoute);
app.use("/leaderboard", leaderboardRoute);

//add more routes  

//MONGODB 
//defining the connection to mongodb
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})
.catch((error) => {
  console.log(`${error} did not connect`); 
}); 


app.get('/', (req, res) => {
  res.send('API is running...');
});