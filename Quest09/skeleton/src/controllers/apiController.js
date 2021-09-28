import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./scratch");

const getStorageItem = (text) => {
    return JSON.parse(localStorage.getItem(text));
};

// 받아온 array에서 최대값을 반환.
const getMaxId = (arr) => {
    return arr.reduce((a, b) => Math.max(parseInt(a), parseInt(b)));
};

const getStorageId = (isId) => {
    return Array.from({length: localStorage.length}, (_, i) => {
        const title = localStorage.key(i);
        const content = getStorageItem(title);
        return isId ? content.id : { title, content };
    });
};

export const postSaveNote = (req, res) => {
    const { 
        body: { text, title } 
    } = req;
    try {
        const storage = getStorageId(true);
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
        return res.sendStatus(201);
    } catch(e) {
        return res.sendStatus(400);
    }
    
};

export const postDeleteNote = (req, res) => {
    const { 
        body: { title } 
    } = req;

    try {
        localStorage.removeItem(title);
        return res.sendStatus(200);
    } catch(e) {
        return res.sendStatus(400);
    }
};

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
                id: getStorageId(true).length !== 0 ? getMaxId(getStorageId(true)) + 1 : 0
            }
            localStorage.setItem(title, JSON.stringify(value));
            return res.sendStatus(201);
        }
    } catch(e) {
        return res.sendStatus(400);
    }
};

export const getloadLocalhost = (req, res) => {
    try {
        const data = getStorageId(false);
        return res.status(201).json(data);
    } catch(e) {
        return res.sendStatus(400);
    }
};