import express from "express";
import { loginStatus, logoutStatus } from "./middleware.js";

const example = [
    {
        loginId: "geonyeong@naver.com",
        loginPassword: "1234"
    },
    {
        loginId: "test1@naver.com",
        loginPassword: "4567"
    },
    {
        loginId: "test2@naver.com",
        loginPassword: "3211"
    }
];

const homeRouter = express.Router();

homeRouter.route("/").get(loginStatus ,async (req, res) => {
    return res.render("home", { userId: req.session.userId});
});

homeRouter.get("/login", logoutStatus, (req, res) => {
    return res.redirect("/login");
});
homeRouter.post("/login", logoutStatus, (req, res) => {
    const { loginId, loginPassword } = req.body;
    if(example.find((element) => element.loginId === loginId && element.loginPassword === loginPassword)) { 
        req.session.userId = loginId;
        return res.redirect("/");
    }
    return res.render("login", {errorMsg: "Incorrect password"});
});

homeRouter.get("/logout", loginStatus, (req, res) => {
    req.session.userId = false;
    return res.redirect("/login");
});

export default homeRouter;