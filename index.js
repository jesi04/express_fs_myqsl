const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');


const port = 4444;

const app = express();


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "express_fs_mysql",
    user: "jesi",
    password: "jesi"
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
    extended: true
}));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./view/form.html"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "./style/style.css"));
});

app.get("/formdata", (req, res) => {
    res.sendFile(path.join(__dirname, "./data/formData"));
});




app.post('/formaction', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const age = req.body.age;
    const scale = req.body.scale;
    const userRecommend = req.body.userRecommend;
    const prefer = req.body.prefer;
    const comment = req.body.comment;

    let content = {
        name: name,
        email: email,
        age: age,
        scale: scale,
        userRecommend: userRecommend,
        prefer: prefer,
        comment: comment
    };

    
    console.log("JSON fajlba iras");
    fs.readFile('./data/formData.json', function (err, data) {
        const ratings = JSON.parse(data);
        ratings.push(content);

        fs.writeFile('./data/formData.json', JSON.stringify(ratings), (err, result) => {
            if (err) console.log('error', err);
        });
    })
    
    console.log("Adatbeszúrás mysql adatbazisba");
    const myInsert = "INSERT INTO  ratings (name, email , age, scale, userRecommend, prefer, comment ) VALUES ('" + name + "','" + email + "','" + age + "','" + scale + "','" + userRecommend + "','" + prefer + "','" + comment + "')";
    connection.query(myInsert, (err, result) => {
        if (err) throw err;
        console.log(`Beszúrva: ${result.affectedRows} sor`);
    });
    
    console.log(name);
    return res.redirect("/succes");
});


app.get("/", (req, res) => {
    res.redirect("/");
});

app.listen(port);