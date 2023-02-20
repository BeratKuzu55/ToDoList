
module.exports.getDate = getDate;

function getDate(){

    var tarih = new Date();

    var options = {
        weekday: "long",
        day: "numeric" , 
        month: "long"
    }
    let day  = tarih.toLocaleDateString("en-US" , options); 
    return day;
}

module.exports.getDay = getDay;
function getDay(){

    var tarih = new Date();

    var options = {
        weekday: "long"
    }
    let day  = tarih.toLocaleDateString("en-US" , options); 
    return day;
}
