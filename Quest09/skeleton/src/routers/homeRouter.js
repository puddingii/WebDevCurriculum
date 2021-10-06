import express from "express";
import { getHome, getLogin, getLogout, postLogin } from "../controllers/homeController";

const homeRouter = express.Router();

homeRouter.route("/").get(getHome);
homeRouter.route("/login").get(getLogin).post(postLogin);
homeRouter.route("/logout").get(getLogout);

export default homeRouter;