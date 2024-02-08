import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "http://dataservice.accuweather.com/"
const authKey = "MdUYjsNLThoWnF5lWYKOvUu7seb5kGMU";
//50 calls a day

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) =>  {
    res.render("index.ejs", {temp: "Select City"});
});

app.post("/weather",  async (req,res)=>{
    try{
        //console.log(req.body["city"]);
        //location key
        /*const city = await axios.get(API_URL+"locations/v1/cities/search", {
            params: {apikey: authKey, q: req.body["city"]}
        });
        var cname = city["data"][0].EnglishName;
        //current temp
        const currentTemp = await axios.get(API_URL+"currentconditions/v1/"+city["data"][0].Key, {
            params: {apikey: authKey}
        });
        var weathertext = currentTemp["data"][0].WeatherText;
        //console.log(currentTemp["data"][0].Temperature["Imperial"].Value);

        //today forecast
        const forecast = await axios.get(API_URL+"forecasts/v1/daily/1day/"+city["data"][0].Key, {
            params: {apikey: authKey, details: true}
        });
        console.log(forecast["data"].DailyForecasts[0].Temperature);*/
        res.render("index.ejs", {temp: 65, hi: {Minimum: {Value: 61, Unit: 'F', UnitType: 18},Maximum: {Value: 73, Unit: 'F', UnitType: 18}}, c: "Katy", wt: "Mostly Cloudy", p:"/images/cloudy.png"})
    }
    catch (error)   {
        res.status(404).send(error.message);
    }
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});