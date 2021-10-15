import express from "express";
import morgan from "morgan";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import homeRouter from "./routers/homeRouter.js";

MySQLStore(session);
const CLIENTPORT = 3500;

const clientApp = express();
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
clientApp.set("views", `${process.cwd()}/public/views`);
clientApp.set("view engine", "pug");
clientApp.use(session({
    secret: "lksajdf3a3wporn3pinoflasd",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(MysqlOptions)
}));
clientApp.use("/", homeRouter);

const handleListen = () => console.log(`Home Listening: http://localhost:${CLIENTPORT}`);
clientApp.listen(CLIENTPORT, handleListen);
