import express from "express";
import homeRouter from "./routers/homeRouter";

const PORT = 8000;

const app = express();
app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use("/static", express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/node_modules", express.static("node_modules"));

app.use("/", homeRouter);

const handleListen = () => console.log(`Listening: http://localhost:${PORT}`);
app.listen(PORT, handleListen);