import express from "express";
import { getHome } from "../controllers/homeController";

const homeRouter = express.Router();

homeRouter.route("/").get(getHome);

export default homeRouter;