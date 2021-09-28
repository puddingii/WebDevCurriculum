import express from "express";
import { postDeleteNote, postDifSaveNote, postSaveNote } from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.route("/saveNote").post(postSaveNote);
apiRouter.route("/deleteNote").post(postDeleteNote);
apiRouter.route("/difSaveNote").post(postDifSaveNote);

export default apiRouter;
