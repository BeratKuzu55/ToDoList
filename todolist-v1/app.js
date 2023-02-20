const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs'); // express kullanılarak oluşturulan uygulamamıza görünüm motoru olarak ejs kullanmasını söylüyoruz

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
var items = [];
let workItems = [];
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

    let day = date.getDate();
    res.render("lists" , {listTitle : day , newListItems : items});
    
});

// burada newItem daki degeri alma isteginde bulundugumuzdan request kullandık
app.post("/" , function(req , res){
   var item =  req.body.newItem // newItem deki degeri alıyoruz html formda 
   console.log(item);

   if(req.body.list === "Work List"){
    workItems.push(item);
    res.redirect("/work");
   }else {
    items.push(item);
    res.redirect("/");
   }

});


app.get("/work" , function(req , res) {
    res.render("lists" , {listTitle: "Work List" , newListItems: workItems})
});

app.get("/about" , function(req , res){
    res.render("about");
})

app.listen(3000 , function(){
    console.log("server started on port 3000");
});