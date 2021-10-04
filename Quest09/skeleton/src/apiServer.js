import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import apiRouter from "./routers/apiRouter";

MySQLStore(session);
const APIPORT = 8000;

const apiApp = express();
const corsOptions = {
    origin: [/localhost:3000/, /localhost:8000/],
};
const MysqlOptions = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "notepad"
};

const appSetting = (app) => {
    app.use("/static", express.static("public"));
    app.use(morgan("dev"));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use("/node_modules", express.static("node_modules"));
};

appSetting(apiApp);
apiApp.use(session({
    secret: "lksajdf3a3wporn3pinoflasd",
    resave: false,
    saveUninitialized: false,
    // store: new MySQLStore(MysqlOptions)
}));

apiApp.use("/api", cors(corsOptions), apiRouter);

const handleApiListen = () => console.log(`Api Listening: http://localhost:${APIPORT}`);
apiApp.listen(APIPORT,handleApiListen);
