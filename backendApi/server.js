const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const app = express();
const port = 5000;
const cors = require("cors");

const Gpio = require('onoff').Gpio;
const fs = require('fs');
const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream.js');
const motorFunctions = require('./public/js/backend.js')
const {DistanceMeter} = require('./public/js/sensors.js')
const pigpio_1 = require("pigpio");


console.log(DistanceMeter)





let rawdata = fs.readFileSync(path.join(__dirname, '/public/js/motor_config_file.json'), 'utf8');
let motorsArray = JSON.parse(rawdata);

console.log(rawdata);

motorsArray.forEach((motor) => {
		motor.GPIO_forwards = new Gpio(motor.output1, 'out');
		motor.GPIO_backwards = new Gpio(motor.output2, 'out');
		});
		
console.log(motorsArray);


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/', (req, res, next) => { console.log(new Date(), req.method, req.url); next(); });

app.get('/', () => {
    console.log("connected")
})


app.post('/command', handleCommand)
app.post('/saveLayout', handleSaveLayout)
app.post('/saveConfig', handleSaveConfig)
app.post('/ultraSonicValue', handleUSSensor)
app.get('/config', getConfig)
app.get('/loadLayout', handleLoadLayout)


videoStream.acceptConnections(app, {
  width: 1280,
  height: 720,
  fps: 16,
  encoding: 'JPEG',
  quality: 5 //lower is faster
}, '/stream.mjpg', true);

async function handleUSSensor(req, res){
  console.log(req.body)
  let sensorTest = new DistanceMeter(req.body.trigg,req.body.echo);
  try{
    let distance = await sensorTest.getDistance().then(result => result)
    res.send({distance})
  }catch(e){
    console.log("Failed to send Distance", e)
  }
  

}



async function getConfig(req, res){
  try{
    console.log("Sending Motor Config File")
    console.log(rawdata)
    res.send(rawdata)
  }catch(e){
    error(res, `failed to get config file ${e}`)
    
  }
}

async function handleCommand(req, res){
  JSONcommand = req.body;

  console.log(req.body)
  try{
    console.log("command recived")
    motorFunctions.moveMotor(motorsArray[JSONcommand.motorId], JSONcommand.command)
    res.send('204');
  }catch(e){
    error(res, `command failed ${e}`);
  }
  

  

}

async function handleSaveLayout(req, res){
  let JSONLayout = req.body;
  console.log(JSONLayout)
  try{
    console.log("Save Layout")
    fs.writeFileSync(path.join(__dirname, '/public/js/layout.json'), JSON.stringify(JSONLayout))
    res.send('204')
  }catch(e){
    error(res, `Save Layout failed ${e}`);
  }
  

}

async function handleLoadLayout(req, res){
  let rawData = fs.readFileSync(path.join(__dirname, '/public/js/layout.json'));
  let JSONLayout = JSON.parse(rawData);
  try{
    console.log("Load Layout")
    res.send(JSONLayout)
  }catch(e){
    error(res, `send Layout failed ${e}`);
  }
  
}

async function handleSaveConfig(req, res){
  let JSONData = req.body;
  console.log(JSONData)
  fs.writeFileSync(path.join(__dirname, '/public/js/motor_config_file.json'), JSON.stringify(JSONData))
}


// async function handleCommand(req, res) {
//   try {
//     motorFunctions.moveMotor(motorsArray[0], 'forward')
//   } catch (e) {
//     error(res, `command failed${e}`);
//   }
// }



function error(res, msg) {
  res.sendStatus(404).end();
  console.error(msg);
}



app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
});
