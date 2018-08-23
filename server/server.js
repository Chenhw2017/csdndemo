const express = require("express");
const session = require("express-session");
const ejs = require("ejs");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({
    secret: 'BluetoyCat',
    name: "userInfo",
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1200000,
    }
}))
app.use("/public", express.static("../public"));
app.use("/server", express.static("../server"));
// const xtpl = require("xtpl");
app.get("/", (req, res) => {
    console.log(req.session.userInfo);
    ejs.renderFile(path.join(__dirname, "../index.html"), { userInfo: req.session.userInfo }, (err, data) => {
        if (err) throw err;
        res.setHeader("Content-Type", "text/html;charset=utf8");
        res.end(data);
    })

})
app.use("/api", require("./routers/router.js"));
app.use("/nav", require("./routers/navRouter.js"));
app.listen(9999);