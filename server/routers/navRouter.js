const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const ejs = require("ejs");
const formidable = require("formidable");
const getCategoryAndTechnoloyName = require("../../utils/mytool.js").getCategoryAndTechnoloyName;
const Client = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const dbname = "luntandb";
const url = "mongodb://127.0.0.1:27017";
// 分类导航
router.get("/:category/:technology?", (req, res) => {
    let CategoryAndTechnoloy = getCategoryAndTechnoloyName(req.params.category, req.params.technology);
    console.log(req.params, CategoryAndTechnoloy);
    console.log("用户信息---", req.session.userInfo)
        //初始化请求数据
    let reqData = {};
    if (req.params.technology) {
        reqData = {
            "category": req.params.category,
            "technology": req.params.technology
        }
    } else {
        reqData = {
            "category": req.params.category,
        }
    }
    console.log("reqData", reqData);
    Client.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;
        let db = client.db(dbname);
        console.log("reqData", reqData);
        db.collection("post").find(reqData).toArray((err, result) => {
            if (err) throw err;
            // console.log(result[0].picture);
            console.log("帖子---", result);
            let data = {
                    CategoryAndTechnoloy: CategoryAndTechnoloy,
                    userInfo: req.session.userInfo,
                    PostListInfo: result,
                    reqData: reqData,
                }
                // console.log("技术---", result[0].technology);
            client.close();
            ejs.renderFile(path.join(__dirname, "../../template/category.html"), data, (err, data) => {
                if (err) throw err;
                res.setHeader("Content-Type", "text/html;charset=utf8");
                res.end(data);
            })
        })
    })

})

//请求发帖页面
router.get("/:category/:technology/writePost", (req, res) => {
    let CategoryAndTechnoloy = getCategoryAndTechnoloyName(req.params.category, req.params.technology);
    console.log(req.params, CategoryAndTechnoloy);
    //初始化可用积分
    let leftMarks = 0;
    Client.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;
        let db = client.db(dbname);
        // console.log(req.session.userInfo.username);
        db.collection("user").find({ _id: ObjectId(req.session.userInfo.id) }).toArray((err, result) => {
            if (err) throw err;
            console.log("结果", result);
            leftMarks = result[0].leftMarks;
            // 渲染页面
            ejs.renderFile(path.join(__dirname, "../../template/writePost.html"), { CategoryAndTechnoloy: CategoryAndTechnoloy, userInfo: req.session.userInfo, leftMarks: leftMarks }, (err, data) => {
                if (err) throw err;
                res.setHeader("Content-Type", "text/html;charset=utf8");
                res.end(data);
            })
            client.close();
        })
    })

})

//提交帖子
router.post("/:category/:technology/writePost/submit", (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = "../public/upload";
    form.keepExtensions = "true";
    form.parse(req, (err, fields, files) => {
        console.log(req.params);
        console.log(files.picture1.path);
        let date = new Date();
        let post = {
            "avater": req.session.userInfo.avater,
            "category": req.params.category,
            "technology": req.params.technology,
            "title": fields.title,
            "offerMarks": fields.offerMarks,
            "content": fields.content,
            "picture": files.picture1.path,
            "userId": req.session.userInfo.id,
            "username": req.session.userInfo.username,
            "levels": req.session.userInfo.levels,
            "time": date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            "repluCount": "0",
            "supCount": "0",
            "oppCount": "0",
            "replyName": req.session.userInfo.username,
            "lastReplyTime": date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        };
        Client.connect(url, (err, client) => {
            if (err) throw err;
            let db = client.db(dbname);
            db.collection("post").insertOne(post, (err, data) => {
                if (err) throw err;
                res.redirect("http://127.0.0.1:9999/nav/" + req.params.category + "/" + req.params.technology + "?writePostSuccess=true");
            })
        })
    })
})

//查看帖子详情
router.get("/:category/:technology/:postId", (req, res) => {
    Client.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) throw err;
        let db = client.db(dbname);
        db.collection("post").find({ category: req.params.category, technology: req.params.technology, _id: ObjectId(req.params.postId) }).toArray((err, postInfo) => {
            if (err) throw err;
            db.collection("comments").find({ id: req.body.id }).toArray((err, replyList) => {
                if (err) throw err;
                console.log({ category: req.params.category, technology: req.params.category, _id: ObjectId(req.body.postId) });
                console.log("详情=----", postInfo);
                let index1 = postInfo[0].avater.lastIndexOf("u");
                let index2 = postInfo[0].picture.lastIndexOf("u");
                console.log(index1);
                postInfo[0].avater = postInfo[0].avater.slice(index1);
                postInfo[0].picture = postInfo[0].picture.slice(index2);
                console.log(postInfo[0].avater, postInfo[0].picture);
                ejs.renderFile(path.join(__dirname, "../../template/postDetails.html"), { postInfo: postInfo[0], replyList: replyList, userInfo: req.session.userInfo }, (err, data) => {
                    if (err) throw err;
                    client.close();
                    res.setHeader("Content-Type", "text/html;charset=utf8");
                    res.end(data);
                })
            })
        })
    })
})


//评论回复帖子
router.post("/:category/:technology/:postId/comments", (req, res) => {
    console.log(req.params);
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../upload");
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
            console.log(fields, files.picture.path);
            let index = files.picture.path.lastIndexOf("u");
            // 初始化评论时间
            let date = new Date();
            let comments = {
                category: req.params.category,
                technology: req.params.technology,
                postId: req.params.postId,
                content: fields.comments,
                picture: files.picture.path.slice(index),
                time: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + "-" + date.getSeconds(),
                username: req.session.userInfo.username,
                avater: req.session.userInfo.avater,
                levels: req.session.userInfo.levels,
                supCount: "0",
                oppCount: "0"
            }
            Client.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) throw err;
                let db = client.db(dbname);
                db.collection("comments").insertOne(comments, (err, result) => {
                    if (err) throw err;
                    console.log("插入评论数据成功数据", result.ops[0]);
                    ejs.renderFile(path.join(__dirname, "../../template/comments.html"), { comments: result.ops[0] }, (err, data) => {
                        res.setHeader("Content-Type", "text/html;charset=utf8");
                        res.end(data);
                    })
                    client.close();
                })
            })
        })
        // Client.connect(url, { useNewUrlParser: true }, (err, client) => {
        //     if (err) throw err;
        //     let db = client.db(dbname);
        //     db.collection("post").find({ category: req.params.category, technology: req.params.technology, _id: ObjectId(req.params.postId) }).toArray((err, postInfo) => {
        //         if (err) throw err;
        //         db.collection("comments").find({ id: req.body.id }).toArray((err, replyList) => {
        //             if (err) throw err;
        //             console.log({ category: req.params.category, technology: req.params.category, _id: ObjectId(req.body.postId) });
        //             console.log("详情=----", postInfo);
        //             ejs.renderFile(path.join(__dirname, "../../template/postDetails.html"), { postInfo: postInfo[0], replyList: replyList }, (err, data) => {
        //                 if (err) throw err;
        //                 client.close();
        //                 res.setHeader("Content-Type", "text/html;charset=utf8");
        //                 res.end(data);
        //             })
        //         })
        //     })
        // })
})

module.exports = router;