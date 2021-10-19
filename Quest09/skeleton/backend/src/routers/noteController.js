import express from "express";
import Users from "../models/user";
import Notepads from "../models/notepad";
const apiRouter = express.Router();

// 저장 눌렀을 때 서버에 데이터 저장
apiRouter.post("/save", async(req, res) => {
    const { 
        body: { id, email, title, text } 
    } = req;

    try { 
        const user = await Users.findOne({ where: { email } });
        const note = await Notepads.findOne({ where: { id, email }});
        if(note && user) {
            await Notepads.update({ content: text },{ where: { id } });
        } else {
            await Notepads.create({ email, title, content: text });
        }
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

// 삭제버튼을 눌렀을 때
apiRouter.delete("/delete", async(req, res) => {
    const { 
        body: { noteId, email } 
    } = req;
    try {
        await Notepads.destroy({ where: { id: noteId, email } });
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

// 다른이름으로 저장을 눌렀을 때
apiRouter.post("/saveAs", async(req, res) => {
    const { 
        body: { id, email, text, title } 
    } = req;

    try {
        const item = await Notepads.findOne({ where: { id }});
        if(item) {
            throw "Notepad is not null";
        }
        await Notepads.create({ id, email, title, content: text });

        return res.sendStatus(201);
    } catch(e) {
        return res.sendStatus(400);
    }
});

// 모든 데이터 불러오기
apiRouter.get("/loadAllData", async(req, res) => {
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
