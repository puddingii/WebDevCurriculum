export const loginStatus = (req, res, next) => {
    if(req.session.userId) {
        next();
    } else {
        return res.redirect("/login");
    }
};

export const logoutStatus  = (req, res, next) => {
    if(!req.session.userId) {
        next();
    } else {
        return res.redirect("/");
    }
};