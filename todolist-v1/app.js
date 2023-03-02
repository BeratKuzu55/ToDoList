const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mysql = require("mysql");
const app = express();

app.set('view engine', 'ejs'); // express kullanılarak oluşturulan uygulamamıza görünüm motoru olarak ejs kullanmasını söylüyoruz

const con = mysql.createConnection({
    host:"localhost" ,
    user:"root" ,
    password : "" , 
    database : "todolist"
})

con.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
var items = [];
let workItems = [];
let customitems = [];

var day = date.getDate();
app.get("/" , function(req , res){

    
   // var day = tarih.getDay() === 0 ? day="sunday" : tarih.getDay() === 1 ? day = "monday" : tarih.getDay() === 2 ? day = "Tuesday" : tarih.getDay() === 3 ? day = "wednesday" : tarih.getDay() === 4 ? day = "Thursday" : tarih.getDay() === 5 ? day = "Friday" : tarih.getDay() === 6 ? day = "Saturday" : day = "Sunday";
   
   /* if(tarih.getDay() === 6 || tarih.getDay() === 0){
        day = "weekend";
       
    }
    else if(tarih.getDay() === 1)
    {}
    else{
       // res.write("i have to work");
       // res.send("i have to work" + tarih.getDay());
       //res.sendFile(__dirname + "index.html");
       day = "weekday";
    }*/
    con.query(`SELECT * FROM mainpage` , function(err , rows){
        if(err) throw err;
        for (let index = 0; index < rows.length; index++) {
            items[index] = rows[index].goal;         
        }
    });
   
    res.render("lists" , {listTitle : day , newListItems : items});
    
});

// burada newItem daki degeri alma isteginde bulundugumuzdan request kullandık
app.post("/" , function(req , res){
   var item =  req.body.newItem // newItem deki degeri alıyoruz html formda 
   console.log(item);

   if(req.body.list !== day){
    //workItems.push(item);
    con.query(`INSERT INTO ${req.body.list} (goal) VALUES ('${item}')`);
    res.redirect(`/${req.body.list}`);
   }else {
    items.push(item);
    con.query(`INSERT INTO mainpage (goal) VALUES ('${item}')`);
    res.redirect("/");
   }

});


app.get("/:customListName" , function(req , res) {
    const customListName = req.params.customListName;
    con.query(`create table if not exists ${customListName} (goal TEXT)`);
    con.query(`select * from ${customListName}` , function (err , rows) {
        if(err) throw err;
        for (let index = 0; index < rows.length; index++) {
            customitems[index] = rows[index].goal;         
        }
    });
    res.render("lists" , {listTitle: `${customListName}` , newListItems: customitems});
})

/*
app.get("/work" , function(req , res) {
    con.query(`SELECT * FROM work` , function(err , rows){
        if(err) throw err;
        for (let index = 0; index < rows.length; index++) {
            workItems[index] = rows[index].goal;         
        }
    });
    res.render("lists" , {listTitle: "Work List" , newListItems: workItems})
}); */

app.get("/about" , function(req , res){
    res.render("about");
})


app.post("/delete" , function(req , res){
    var silinecek_item = req.body.checkbox;
    const listName = req.body.listName;
    console.log(listName);
   if(listName !== day){
    con.query(`delete from ${listName} where goal="${silinecek_item}" `);
    customitems = customitems.filter(a => a !== silinecek_item);
    console.log(customitems);
    console.log(`${req.body.list} tablosundan silindi`);
    res.redirect(`/${listName}`);
   }
   else {
    con.query(`delete from mainpage where goal = "${silinecek_item}" `);
    items = items.filter(a => a !== silinecek_item);
    console.log(items);
    res.redirect("/");
   }
})

app.listen( process.env.PORT || 3000 , function(){
    console.log("server started on port 3000");
});