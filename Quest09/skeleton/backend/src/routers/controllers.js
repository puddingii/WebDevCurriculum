import express from "express";
import Users from "../models/user";
import Notepads from "../models/notepad";
import { StorageUtil } from "./util/storageUtil";
const localStorage = new StorageUtil("./scratch");
const apiRouter = express.Router();

// 저장 눌렀을 때 서버에 데이터 저장
apiRouter.route("/save").post( async(req, res) => {
    const { 
        body: { id, text, email, title } 
    } = req;

    try { 
        const item = await Notepads.findOne({ where: { id }});
        if(item) {
            await Notepads.update({ content: text },{ where: { id } });
        } else {
            await Notepads.create({ id, email, title, content: text });
        }

        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

apiRouter.route("/delete").delete((req, res) => {
    const { 
        body: { id } 
    } = req;
    try {
        await Notepads.destroy({ where: { id } });
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

apiRouter.route("/saveAs").post((req, res) => {
    const { 
        body: { text, title } 
    } = req;

    try {
        if(localStorage.getItem(title)) {
            return res.sendStatus(400);
        } else {
            const value = {
                text,
                id: localStorage.getStorageItems(true).length !== 0 ? localStorage.getMaxId(localStorage.getStorageItems(true)) + 1 : 0
            };
            localStorage.setItem(title, JSON.stringify(value));
            localStorage.setItem("userData", title);
            return res.sendStatus(201);
        }
    } catch(e) {
        return res.sendStatus(400);
    }
});

apiRouter.route("/loadAllData").get( async(req, res) => {
    try {
        const { 
            query: { email }
        } = req;
        const userInfo = await Users.findOne({ where: { email }});
        const notepadInfo = await Notepads.findAll({ where: { email }});
        notepadInfo.push({ endTitle: userInfo.getLasttab(), openTab: userInfo.getOpentab() });
        const data = JSON.parse(JSON.stringify(notepadInfo, null, 2));
        
        return res.status(200).json(data);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

export default apiRouter;
