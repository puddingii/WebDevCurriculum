import express from "express";
import bcrypt from "bcrypt";
import Users from "../models/user";
import Notepads from "../models/notepad";
import JsonManage from "./util/jsonManage";
const jsonManage = new JsonManage();

const userApi = express.Router();

userApi.post("/check", async(req, res) => {
    const { 
        body: { loginId: email, loginPassword: passwd } 
    } = req;
    try {   
        const storedPasswd =  await (await Users.findOne({ where: { email } })).getPassword();
        if(storedPasswd) {
            const isSame = await bcrypt.compare(passwd, storedPasswd);
            return res.status(200).json({ result: isSame })
        }
        return res.sendStatus(404);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

userApi.post("/saveOpenNote", async(req, res) =>{
    let { 
        body: { email, opentab, lasttab } 
    } = req;
    try {
        const queryResult = await Notepads.findAll({ where: { email } });
        const notepads = jsonManage.classToTextToJson(queryResult);
        const opentabArr = opentab.split(',').filter((element) => {
            return notepads.find((note) => note.id === parseInt(element));
        });
        if(!notepads.find((note) => note.id === lasttab)) {
            lasttab = "";
        }

        await Users.update({ opentab: opentabArr.join(), lasttab },{ where: { email }});
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

userApi.post("/join", async(req, res) =>{
    let { 
        body: { loginId, password } 
    } = req;
    try {
        const isExisted = await Users.findOne({ where: { email: loginId } });
        if(isExisted) {
            return res.sendStatus(400);
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await Users.create({ email: loginId, password: hashPassword });
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
    
});

export default userApi;