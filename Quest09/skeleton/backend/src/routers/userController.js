import express from "express";
import bcrypt from "bcrypt";
import Users from "../models/user";

const userApi = express.Router();

userApi.route("/check").post( async(req, res) => {
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

userApi.route("/saveOpenNote").post( async(req, res) =>{
    const { 
        body: { email, opentab } 
    } = req;
    try {
        await Users.update({ opentab },{ where: { email }});
        return res.sendStatus(201);
    } catch(e) {
        console.log(e);
        return res.sendStatus(400);
    }
    
});

export default userApi;