export const loginStatus = (req, res, next) => {
    if(req.session.userId) {
        next();
    } else {
        return res.render("login", {errorMsg: "Please login first"});
    }
};

export const logoutStatus  = (req, res, next) => {
    if(!req.session.userId) {
        next();
    } else {
        return res.redirect("/");
    }
};