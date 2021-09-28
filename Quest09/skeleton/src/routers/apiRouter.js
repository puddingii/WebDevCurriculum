import express from "express";
import { getloadLocalhost, postDeleteNote, postDifSaveNote, postSaveNote } from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.route("/saveNote").post(postSaveNote);
apiRouter.route("/deleteNote").delete(postDeleteNote);
apiRouter.route("/saveDifNote").post(postDifSaveNote);
apiRouter.route("/loadLocalhost").get(getloadLocalhost);

export default apiRouter;
