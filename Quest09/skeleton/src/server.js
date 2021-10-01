import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import apiRouter from "./routers/apiRouter";
import homeRouter from "./routers/homeRouter";

MySQLStore(session);
const APIPORT = 8000;
const CLIENTPORT = 3000;

const clientApp = express();
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

appSetting(clientApp);
appSetting(apiApp);
clientApp.set("views", `${process.cwd()}/src/views`);
clientApp.set("view engine", "ejs");
clientApp.engine("html", require("ejs").renderFile);

clientApp.use(session({
    secret: "lksajdf3a3wporn3pinoflasd",
    resave: false,
    saveUninitialized: false,
    // store: new MySQLStore(MysqlOptions)
}));

clientApp.use("/", cors(corsOptions), homeRouter);
apiApp.use("/api", cors(corsOptions), apiRouter);

const handleListen = () => console.log(`Home Listening: http://localhost:${CLIENTPORT}`);
const handleApiListen = () => console.log(`Api Listening: http://localhost:${APIPORT}`);
clientApp.listen(CLIENTPORT, handleListen);
//apiApp.listen(APIPORT,handleApiListen);
