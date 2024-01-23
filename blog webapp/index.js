import express from "express";
import bodyParser from "body-parser";
import events from "events";

const app = express();
const port = 3000;
var ee = new events.EventEmitter();

var t = [];
var c = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.render("index.ejs", {ti:t, con:c});
});

app.get("/create", (req,res)=>{
    res.render("create.ejs");
});

app.post("/submit", (req,res)=>{
    const newTitle = req.body.title
    const newContent = req.body.body
    if(newTitle.length < 1 || newContent.length < 1){
        console.log("Empty");
    }
    else{
    t.push(newTitle);
    c.push(newContent);
    console.log(t);
    console.log(c);
    
    res.render("index.ejs", {ti: t, con: c});
    }
});

app.post("/v", (req,res)=>{
    res.render("view.ejs", {ti: t[req.body["index"]], con: c[req.body["index"]]});
});

app.post("/update", (req,res)=>{
    console.log(req.body["index"]);
    res.render("update.ejs", {ti: t[req.body["index"]], con: c[req.body["index"]], in: req.body["index"], end: req.body["end"]});
});

app.post("/updated", (req,res)=>{
    console.log(req.body["index"]);
    t.splice(req.body["index"],1);
    c.splice(req.body["index"],1);
    t.push(req.body.title);
    c.push(req.body.body);
    res.render("index.ejs", {ti: t, con: c});
});

app.post("/delete", (req,res)=>{
    t.splice(req.body["index"],1);
    c.splice(req.body["index"],1);
    res.render("index.ejs", {ti: t, con: c});
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});
