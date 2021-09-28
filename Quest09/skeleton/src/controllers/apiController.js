import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./scratch");

// 받아온 array에서 최대값을 반환.
const getMaxId = (arr) => {
    return arr.reduce((a, b) => Math.max(parseInt(a), parseInt(b)));
}

const getStorageId = () => {
    return Array.from({length: localStorage.length}, (_, i) => {
        const title = localStorage.key(i);
        const content = JSON.parse(localStorage.getItem(title));
        return content.id;
    });
}

export const postSaveNote = (req, res) => {
    const { 
        body: { text, title } 
    } = req;
    try {
        const storage = getStorageId();
        let id = 0;
        if(storage.length !== 0) { // id값을 primary key로 잡기위함.
            if(localStorage.getItem(title)) {
                id = JSON.parse(localStorage.getItem(title)).id;
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

};

export const postDifSaveNote = (req, res) => {

};
