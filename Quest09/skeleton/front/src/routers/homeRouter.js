import express from "express";

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

homeRouter.route("/").get(async (req, res) => {
    if(!req.session.userId) {
        return res.redirect("/login");
    }
    return res.render("home", { userId: req.session.userId});
});

homeRouter.get("/login", (req, res) => {
    return req.session.userId ? res.redirect("/") : res.render("login", {errorMsg: ""});
});
homeRouter.post("/login", (req, res) => {
    const { loginId, loginPassword } = req.body;
    if(example.find((element) => element.loginId === loginId && element.loginPassword === loginPassword)) { 
        req.session.userId = loginId;
        return res.redirect("/");
    }
    return res.render("login", {errorMsg: "Incorrect password"});
});

homeRouter.route("/logout").get((req, res) => {
    req.session.userId = false;
    return res.redirect("/login");
});

export default homeRouter;