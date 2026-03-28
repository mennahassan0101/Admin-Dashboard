import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import analyticsRoutes from "./routes/Analytics.js";
import attendenceRoutes from "./routes/Attendence.js";
import dashboardRoutes from "./routes/Dashboard.js";
import eventsRoutes from "./routes/Events.js";
import revenueRoutes from "./routes/Revenue.js";
import usersRoutes from "./routes/Users.js";
import sequelize from "./config/db.js";
import { User, Event, Ticket, EventManager} from "./models/indexing.js";

/*CONFIG*/
dotenv.config();
const app=express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cors({
  origin: "*",
  credentials: false,
}));

/*ROUTES*/
app.use("/api/dashboard",  dashboardRoutes);
app.use("/api/events",     eventsRoutes);
app.use("/api/analytics",  analyticsRoutes);
app.use("/api/attendance", attendenceRoutes);
app.use("/api/revenue",    revenueRoutes);
app.use("/api/users",      usersRoutes);



sequelize.authenticate().then(() => console.log("MySQL Connected ✓")).catch((err)=>console.log("DB Connection Error:", err));
await sequelize.sync({ force: false }).then(()=>console.log("Tables synced ✓")).catch((err) => console.log("Sync Error:", err));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
