const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "mydb",
    password: "123"
}).promise();

app.set("view engine", "hbs");

app.get("/", function(request, response){
    pool.query("select * from users")
    .then(data => {
        response.render("index.hbs", {
            users: data[0]
        })
    })
    .catch(err => {
        console.log(err);
    });
});

app.get("/create", function(request, response){
    response.render("create.hbs");
});

app.post("/create", urlencodedParser, function(request, response){
    if(!request.body) return response.sendStatus(400);
    const name = request.body.name;
    const age = request.body.age;
    pool.query("insert into users (name, age) values (?,?)", [name, age])
    .then(response.redirect("/"))
    .catch(err=>{
        console.log(err);
    });
});

app.get("/edit/:id", function(request, response){
    const id = request.params.id;
    pool.query("select * from users WHERE id = ?", [id])
    .then(data => {
        response.render("edit.hbs", {
            user: data[0]
        });
    })
    .catch(err=>{
        console.log(err);
    });
});

app.post("/edit", urlencodedParser, function(request, response){
    if(!request.body) return response.sendStatus(400);
    const name = request.body.name;
    const age = request.body.age;
    const id = request.body.id;

    pool.query("update users set name = ?, age = ? WHERE id = ?", [name,age,id])
    .then(response.redirect("/"))
    .catch(err=>{
        console.log(err);
    });
});

app.post("/delete/:id", function(request, response){
    const id = request.params.id;
    pool.query("delete from users where id = ?", [id])
    .then(()=>{
        console.log("User deleted successfuly!");
        response.redirect("/");
    })
    .catch(err=>{
        console.log(err);
    });
});

app.listen(3000, function(){
    console.log("Server is waiting to connect...")
});