// helper function to get the geo coordinates of the user
function geoLocation(){
  $.getJSON("http://freegeoip.net/json/", function(geoJSON){
    var lat = geoJSON.latitude;
    var lon = geoJSON.longitude;
    var country = geoJSON.country_code;
    getTemp(lat, lon, country);
  });
}


function getTemp(lat, lon, country){
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=9fd58a8aba8f3da95d622d85be4f94f5", function(data){
    var html_place = "";
    var html_time = "";
    var html_temp = "";
    html_place+= "<p>" + data.name + ", "+ country+ "</p>";
    html_time += "<p>" + timeNow(data.sys.sunset).month +" " + timeNow(data.sys.sunset).date + ", " + timeNow(data.sys.sunset).year + "</p>";
    html_temp += "<span>" + convertTemperature(data.main.temp, "C") + "</span>" + "<span class='link' id='unit'> c</span>";
    
    $(".place").html(html_place);
    $(".time").html(html_time);
    $(".temperature").html(html_temp);
    
    // local storage that can be accessed from anywhere in the program
//     https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
    sessionStorage.setItem('temperature', data.main.temp);
    sessionStorage.setItem('unit',"c");
    console.log(sessionStorage.temperature);
  });
}

// click event handler that changes the unit of the temperature between centigrade and Fahrenheit.
$(".temperature").click(function() {
  var temp = sessionStorage.getItem('temperature');
  var html_temp = "";
  if (sessionStorage.getItem('unit')==="c") {
       html_temp += "<span>" + convertTemperature(temp, "f") + "</span>" + "<span class='link' id='unit'> f</span>";
    $(".temperature").html(html_temp);
    sessionStorage.setItem('unit',"f");
  }
  else if (sessionStorage.getItem('unit')==="f") {
    html_temp += "<span>" + convertTemperature(temp, "C") + "</span>" + "<span class='link' id='unit'> c</span>";
    $(".temperature").html(html_temp);
    sessionStorage.setItem('unit',"c");
  }
});

// function automatically ivokes the function and makes all the api calls
$(function(){
  geoLocation();
});

// timespamp converter, returns an object conatining year, month, day, date, and
//hour and minute combined as minute.
function timeNow(timeStamp){
  var now = {};
  var time = new Date(timeStamp*1000);
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
  var months = ["January","February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];
  now.year = time.getFullYear();
  now.month = months[time.getMonth()];
  now.day = days[time.getDay()];
  now.date = time.getDate();
  now.minute = time.getHours() * 60 + time.getMinutes(); // hours and minutes in minute
  return now;
}

// process the temprature to the required system,
// parameters: input temperature in kelvin and return formate.
function convertTemperature(temp, convertTo){
  if(convertTo === "C"){
    return Math.round(temp - 273.15);
  }
  else if(convertTo === "f"){
    return Math.round((temp*2.25)-459.67);
  }
}
  

