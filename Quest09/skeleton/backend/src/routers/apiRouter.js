import express from "express";
import { StorageUtil } from "./util/storageUtil";
const localStorage = new StorageUtil("./scratch");
const apiRouter = express.Router();

// 저장 눌렀을 때 서버에 데이터 저장
apiRouter.route("/saveNote").post((req, res) => {
    const { 
        body: { text, title } 
    } = req;

    try { // localstorage에 없을 경우도 생각해야됨.
        const item = localStorage.getItem(title);
        let value = { text };
        if(item) {
            value["id"] = JSON.parse(item).id;
            
        } else {
            value["id"] = localStorage.getStorageItems(true).length !== 0 ? localStorage.getMaxId(localStorage.getStorageItems(true)) + 1 : 0;
        }
        localStorage.setItem(title, JSON.stringify(value));
        localStorage.setItem("userData", title);
        return res.sendStatus(201);
        
    } catch(e) {
        return res.sendStatus(400);
    }
});

apiRouter.route("/deleteNote").delete((req, res) => {
    const { 
        body: { title } 
    } = req;
    try {
        localStorage.removeItem(title);
        localStorage.setItem("userData", "");
        return res.sendStatus(201);
    } catch(e) {
        return res.sendStatus(400);
    }
});

apiRouter.route("/saveDifNote").post((req, res) => {
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

apiRouter.route("/loadAllData").get((req, res) => {
    try {
        const data = localStorage.getStorageItems(false);
        data.push({endTitle: localStorage.getItem("userData") ?? ""});
        return res.status(200).json(data);
    } catch(e) {
        return res.sendStatus(400);
    }
});

export default apiRouter;
