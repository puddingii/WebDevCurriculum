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
        if(title !== "session") {
            const content = getStorageItem(title);
            return isId ? content.id : { title, content };
        }
    });
    dataArr = dataArr.filter((element) => element !== undefined);
    return dataArr;
};

// 저장 눌렀을 때 서버에 데이터 저장
export const postSaveNote = (req, res) => {
    const { 
        body: { text, title } 
    } = req;

    try {
        const storage = getStorageItems(true);
        let id = 0;
        if(storage.length !== 0) { // id값을 primary key로 잡기위함.
            if(localStorage.getItem(title)) {
                id = getStorageItem(title).id;
            } else {
                id = getMaxId(storage) + 1;
            }
        }
        const value = { text, id };
        localStorage.setItem(title, JSON.stringify(value));
        localStorage.setItem("session", title);
        req.session.endTitle =  title;
        console.log(req.session);
        return res.sendStatus(201);
    } catch(e) {
        return res.sendStatus(400);
    }
    
};

// 삭제눌렀을 때 서버에 있는 데이터 삭제
export const postDeleteNote = (req, res) => {
    const { 
        body: { title } 
    } = req;
    try {
        localStorage.removeItem(title);
        localStorage.setItem("session", "");
        return res.sendStatus(200);
    } catch(e) {
        return res.sendStatus(400);
    }
};

// 다른이름으로 저장 눌렀을 때 서버에 데이터 저장
export const postDifSaveNote = (req, res) => {
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
            localStorage.setItem("session", title);
            return res.sendStatus(201);
        }
    } catch(e) {
        return res.sendStatus(400);
    }
};

// 모든 데이터 로드(id, text), key값은 없음.
export const getLoadAllData = (req, res) => {
    try {
        const data = getStorageItems(false);
        console.log( req.session.endTitle);
        data.push({endTitle: req.session.endTitle ?? ""});
        return res.status(201).json(data);
    } catch(e) {
        return res.sendStatus(400);
    }
};