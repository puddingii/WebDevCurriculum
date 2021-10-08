import express from "express";
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./scratch");

// string형식의 value값을 JSON형식으로 바꾼뒤 반환
const getStorageItem = (text) => {
    return JSON.parse(localStorage.getItem(text));
};

// 받아온 array에서 최대값을 반환.
const getMaxId = (arr) => {
    return arr.reduce((a, b) => Math.max(parseInt(a), parseInt(b)));
};

// storage안에 있는 모든 아이템들 가져오기. 
const getStorageItems = (isId) => {
    let dataArr = Array.from({length: localStorage.length}, (_, i) => {
        const title = localStorage.key(i);
        if(title !== "userData") {
            const content = getStorageItem(title);
            return isId ? content.id : { title, content };
        }
    });
    dataArr = dataArr.filter((element) => element !== undefined);
    return dataArr;
};

const apiRouter = express.Router();

// 저장 눌렀을 때 서버에 데이터 저장
apiRouter.route("/saveNote").post((req, res) => {
    const { 
        body: { text, title } 
    } = req;

    try {
        if(localStorage.getItem(title)) {
            return res.sendStatus(400);
        } else {
            const value = {
                text,
                id: getStorageItems(true).length !== 0 ? getMaxId(getStorageItems(true)) + 1 : 0
            };
            localStorage.setItem(title, JSON.stringify(value));
            localStorage.setItem("userData", title);
            return res.sendStatus(201);
        }
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
                id: getStorageItems(true).length !== 0 ? getMaxId(getStorageItems(true)) + 1 : 0
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
        const data = getStorageItems(false);
        data.push({endTitle: localStorage.getItem("userData") ?? ""});
        return res.status(200).json(data);
    } catch(e) {
        return res.sendStatus(400);
    }
});

export default apiRouter;
