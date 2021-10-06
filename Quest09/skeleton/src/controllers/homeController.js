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

export const getHome = async (req, res) => {
    if(!req.session.userId) {
        return res.redirect("/login");
    }
    return res.render("home", { userId: req.session.userId});
};

export const getLogin = (req, res) => {
    return req.session.userId ? res.redirect("/") : res.render("login", {errorMsg: ""});
};

export const postLogin = (req, res) => {
    const { loginId, loginPassword } = req.body;
    if(example.find((element) => element.loginId === loginId && element.loginPassword === loginPassword)) { 
        req.session.userId = loginId;
        return res.redirect("/");
    }
    return res.render("login", {errorMsg: "Incorrect password"});
};

export const getLogout = (req, res) => {
    req.session.userId = false;
    return res.redirect("/login");
};