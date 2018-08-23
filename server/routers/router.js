const express = require("express");
const router = express.Router();
const path = require("path");
const xtpl = require("xtpl");
const fs = require("fs");
const formidable = require("formidable");
const Client = require("mongodb").MongoClient;
// const session = require("express-session");
const url = "mongodb://127.0.0.1:27017";
const dbname = "luntandb";
//注册
router.post("/register", (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = "../server/upload";
    form.keepExtensions = "true";
    form.parse(req, (err, fields, files) => {
        Client.connect(url, {}, (err, client) => {
            if (err) throw err;
            let db = client.db(dbname);
            // console.log(fields, files.avater.path);
            //头像地址
            fields.avater = files.avater.path;
            console.log("地址", fields.avater);
            //初始化积分
            fields.leftMarks = fields.totalMarks = 0;
            //初始化等级
            fields.levels = 1;
            console.log(fields);
            db.collection("user").insertOne(fields, (err, result) => {
                if (err) throw err;
                console.log(result);
                client.close();
                res.setHeader("Content-Type", "text/html;charset=utf8");
                res.redirect("../../public/pages/registerSuccess.html");
                // xtpl.renderFile(path.join(__dirname, "../public/pages/registerSuccess.html"), {}, (err, data) => {
                //     if (err) throw err;
                //     client.close();
                //     res.setHeader("Content-Type", "text/html;charset=utf8");
                //     res.end(data);
                // })
            })
        })
    })
})

//登录
router.post("/login", (req, res) => {
    let params = req.body;
    Client.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;
        let db = client.db(dbname);
        // console.log(fields, files.avater.path);
        let data = null;
        if (params.name.indexOf("@") != -1) {
            data = { email: params.name, password: params.password };
        } else {
            data = { username: params.name, password: params.password };
        }
        console.log(data);
        db.collection("user").find(data).toArray((err, result) => {
            // console.log(222, result[0].avater);
            if (err) throw err;
            if (result.length) {
                let rank = 0;
                //计算排名
                db.collection("user").find({}).sort({ rank: 1 }).toArray((err, sortRes) => {
                    if (err) throw err;
                    for (let i = 0; i < sortRes.length; i++) {
                        if (sortRes[i].id == result[0]._id) {
                            rank = i;
                            break;
                        }
                    }
                })
                req.session.userInfo = {
                    id: result[0]._id,
                    username: result[0].username,
                    avater: result[0].avater.slice(17),
                    leftMarks: result[0].leftMarks,
                    totalMarks: result[0].totalMarks,
                    rank: rank,
                    levels: result[0].levels,
                }
                console.log("登录成功", result[0].avater.slice(17));
                client.close();
                res.setHeader("Content-Type", "text/json");
                result[0].code = 1;
                res.end(JSON.stringify(result[0]));
            } else {
                console.log(111);
                client.close();
                res.end(JSON.stringify({ "code": "0", "ok": "-1" }));
            }
        })
    })
})

//退出登录
router.get("/logOut", (req, res) => {
    console.log("logOut");
    req.session.destroy();
    res.redirect("../");
})


module.exports = router;