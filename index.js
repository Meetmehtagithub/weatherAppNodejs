const http = require('http')
const fs= require('fs')
const requests = require('request');
const { json } = require('stream/consumers');
const { StringDecoder } = require('string_decoder');
const readFile = fs.readFileSync('home.html','utf8')
const replaceVal= (temp,org)=>{
    let temperature=temp.replace("{%tempval%}",org.main.temp)
    temperature=temperature.replace("{%tempmin%}",org.main.temp_min)
    temperature=temperature.replace("{%tempmax%}",org.main.temp_max)
    temperature=temperature.replace("{%location%}",org.name)
    temperature=temperature.replace("{%country%}",org.sys.country)
    temperature=temperature.replace("{%statusCode%}",org.weather[0].main)
    return temperature
}
const server = http.createServer((req,res)=>{
    console.log('server is startead');
    if (req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=0bfe6c28d6a102c676cab3daceef5e0e")
        .on('data', function (chunk) {
            const decoder = new StringDecoder('utf8');

            const con1 = decoder.write(chunk)
            const con = JSON.parse(con1)
            const arrData = [con]
            // console.log(arrData);
            const realTimeData = arrData.map((val)=>replaceVal(readFile,val)).join("")
            res.end(realTimeData);
            // console.log(realTimeData);
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        
        console.log('end');
        res.end();
        });
    }
})

server.listen(8000,"localhost")