export const getHome = (req, res) => {
    if(!req.session.endTitle)  {
        req.session.endTitle = "qwer";
        console.log("settings");
    } 
    console.log(req.session.endTitle);
    return res.render("home.html");
};