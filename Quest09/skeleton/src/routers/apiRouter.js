import express from "express";
import { getLoadAllData, postDeleteNote, postDifSaveNote, postSaveNote } from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.route("/saveNote").post(postSaveNote);
apiRouter.route("/deleteNote").delete(postDeleteNote);
apiRouter.route("/saveDifNote").post(postDifSaveNote);
apiRouter.route("/loadAllData").get(getLoadAllData);

export default apiRouter;
