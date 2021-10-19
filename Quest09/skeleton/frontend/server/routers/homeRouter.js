import express from "express";
import fetch from "node-fetch";
import { loginStatus, logoutStatus } from "./middleware.js";

const homeRouter = express.Router();

homeRouter.get("/", loginStatus ,async (req, res) => {
    return res.render("home", { userId: req.session.userId});
});

homeRouter.get("/login", logoutStatus, (req, res) => {
    return res.render("login");
});
homeRouter.post("/login", logoutStatus, async(req, res) => {
    const { loginId, loginPassword } = req.body;
    try {
        const response = await fetch("http://localhost:8000/api/users/check", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ loginId, loginPassword })
        });
        const resJson = await response.json();
        if(resJson.result) { // 아이디가 있고 비밀번호가 맞을시
            req.session.userId = loginId;
            return res.redirect("/");
        }
        // 비밀번호가 틀렸을 때
        return res.render("login", {errorMsg: "Incorrect password"});
    } catch(e) { // DB에서 오류가 났거나 id가 없을시.
        console.log(e)
        return res.render("login", {errorMsg: "ID is not existed / DB error"});
    }
});

homeRouter.get("/join", logoutStatus, (req, res) => {
    return res.render("join");
});

homeRouter.post("/join", logoutStatus, async (req, res) => {
    const {
        body: { loginId, password, chkPassword }
    } = req;
    try {
        if(password !== chkPassword) {
            throw "비밀번호가 서로 다릅니다.";
        }
        const response = await fetch("http://localhost:8000/api/users/join", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ loginId, password, chkPassword })
        });
        if(response.status === 201) {
            return res.redirect("/");
        } else throw "DB error";
    } catch(e) {
        return res.render("join",{ errorMsg: e });
    }
});

// Logout을 하면 세션에 사용자아이디 삭제
homeRouter.get("/logout", loginStatus, (req, res) => {
    req.session.userId = false;
    return res.redirect("/login");
});

export default homeRouter;