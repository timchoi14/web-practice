import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "http://dataservice.accuweather.com/"
const authKey = "MdUYjsNLThoWnF5lWYKOvUu7seb5kGMU";
//50 calls a day

function picture(i)  {
    if(i <= 6)  {
        return "/images/sun.png";
    }
    else if(i <= 11)    {
        return "/images/cloudy.png";
    }
    else if(i <= 18)    {
        return "/images/rain.png";
    }
    else if(i <= 29)    {
        return "/images/snow.png";
    }
    else{
        return "/images/moon.png";
    }
}


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) =>  {
    res.render("index.ejs", {temp: "Select City"});
});

app.post("/weather",  async (req,res)=>{
    try{
        //location key
        const city = await axios.get(API_URL+"locations/v1/cities/search", {
            params: {apikey: authKey, q: req.body["city"]}
        });
        var cname = city["data"][0].EnglishName;
        //current temp
        const currentTemp = await axios.get(API_URL+"currentconditions/v1/"+city["data"][0].Key, {
            params: {apikey: authKey, details: true}
        });
        var weathertext = currentTemp["data"][0].WeatherText;
        var cTemp = currentTemp["data"][0].Temperature["Imperial"].Value;
        var weatherI = currentTemp["data"][0].WeatherIcon;
        var pic = picture(weatherI);
        var uvi = currentTemp["data"][0].UVIndex;
        var wind = currentTemp["data"][0].Wind["Speed"]["Imperial"].Value;
        var humid = currentTemp["data"][0].RelativeHumidity;
        //console.log(weathertext + " / " + cTemp + " / " + weatherI + " / " + uvi + " / " + wind + " / " + humid);
        //console.log(currentTemp["data"][0]);

        //today forecast
        const forecast = await axios.get(API_URL+"forecasts/v1/daily/1day/"+city["data"][0].Key, {
            params: {apikey: authKey, details: true}
        });
        var hilow = forecast["data"].DailyForecasts[0].Temperature;
        var aqi = forecast["data"].DailyForecasts[0].AirAndPollen[0].Value;
        //console.log(hilow);
        //console.log(forecast["data"].DailyForecasts[0]);
        res.render("index.ejs", {temp: cTemp, hi: hilow, c: cname, wt: weathertext, p:pic, uv:uvi, wind:wind, hum:humid, aqi:aqi});
        //res.render("index.ejs", {temp: 65, hi: {
        //    Minimum: { Value: 63, Unit: 'F', UnitType: 18 },
        //    Maximum: { Value: 75, Unit: 'F', UnitType: 18 }
        //  }, c: "Katy", wt: "Cloudy", p:"/images/cloudy.png", uv: 9, wind:"18", hum:57, bgc: "#209c05", aqi: 29});
    }
    catch (error)   {
        res.status(404).send(error.message);
    }
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});