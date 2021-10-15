import express from "express";
import Users from "../models/user";
import Notepads from "../models/notepad";
const apiRouter = express.Router();

// 저장 눌렀을 때 서버에 데이터 저장
apiRouter.route("/save").post( async(req, res) => {
    const { 
        body: { id, email, title, text } 
    } = req;

    try { 
        const user = await Users.findOne({ where: { email } });
        const note = await Notepads.findOne({ where: { id }});
        if(note && user) {
            await Notepads.update({ content: text },{ where: { id } });
        } else {
            await Notepads.create({ id, email, title, content: text });
        }
        await Users.update({ lasttab: id }, { where: { email } });
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

apiRouter.route("/delete").delete( async(req, res) => {
    const { 
        body: { id } 
    } = req;
    try {
        await Notepads.destroy({ where: { id } });
        await Users.update({ lasttab: "" }, { where: { email } });
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

apiRouter.route("/saveAs").post( async(req, res) => {
    const { 
        body: { id, email, text, title } 
    } = req;

    try {
        const item = await Notepads.findOne({ where: { id }});
        if(item) {
            throw "Notepad is not null";
        }
        await Notepads.create({ id, email, title, content: text });
        await Users.update({ lasttab: id }, { where: { email } });
        
        return res.sendStatus(201);
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
