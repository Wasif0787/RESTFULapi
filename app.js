const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB").then(() => {
    console.log("Connected");
})

const articleSchema = mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)

app.route("/articles")
    .get(function (req, res) {
        Article.find().then((foundArticles) => {
            res.send(foundArticles);
        })
    })
    .post(function (req, res) {
        console.log(req.body.title)
        console.log(req.body.content)
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save().then(() => {
            res.send("Succesfully added")
        })
    })
    .delete(function (req, res) {
        Article.deleteMany().then(() => {
            res.send("Deleted all ")
        })
    })

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        console.log(req.params);
        Article.findOne({ title: req.params.articleTitle }).then((foundArticle,err) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                console.log(err);
            }
        })
    })
    .put(function (req, res) {
        console.log(req.params.articleTitle);
        Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content },{overwrite:true}).then((foundArticle) => {
            if (foundArticle) {
                res.send("Updated Document")
            } else {
                res.send("No articles found")
            }
        })
    })
    .patch(function(req,res){
        Article.updateOne({title:req.params.articleTitle},{$set:req.body}).then((foundArticle,err)=>{
            if(foundArticle){
                res.send("Updates articles successfully")
            } else {
                console.log(err);
            }
        })
    })
    .delete(function(req,res){
        Article.deleteOne({title:req.params.articleTitle}).then((err)=>{
            if(err){
                res.send(err)
                console.log(err)
            } else {
                res.send("Deleted")
            }
        })
    })

//TODO
app.get("/", (req, res) => {
    res.send("<h1>Hello</h1><p>Kya hua</p>")
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
