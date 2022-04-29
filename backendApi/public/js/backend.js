const Gpio = require('onoff').Gpio;
const {DistanceMeter} = require('./sensors.js')


let collisonAvoidance = true;
let usSensorVals = [[23, 18]];
let usSensor = []
usSensorVals.forEach((sensorVal) => {
	let sensor = new DistanceMeter(sensorVal[0], sensorVal[1]);
	usSensor.push(sensor)
})

const isNearSensor = async() => {
	if(collisonAvoidance){
		let highestVal = 0;
		for(let i = 0; i < usSensor.length; i++){
			let distance = await usSensor[i].getDistance().then(result => result)
			if(distance > highestVal){
				highestVal = distance
			}
		}
		
		console.log(highestVal)
		if(highestVal > 5){
			return true
		}else{
			return false
		}
	}

	return true
	
    

}








const moveMotor = async(motor, direction) => {
		let checkInterval = setInterval(async() => {
			console.log("Runnign Interval")
			if(await isNearSensor() !=true ){
				console.log("stopping")
				motor.GPIO_forwards.writeSync(motor.GPIO_forwards.readSync ^ 0);
				motor.GPIO_backwards.writeSync(motor.GPIO_backwards.readSync ^ 0);
			}else{
				clearInterval(checkInterval)
			}
		}, 1000)
	
		console.log(await isNearSensor())
		if(await isNearSensor()){
				if(direction.toLowerCase() === "forward"){
					
					console.log("forward")
					motor.GPIO_backwards.writeSync(motor.GPIO_backwards.readSync ^ 0);
					motor.GPIO_forwards.writeSync(motor.GPIO_forwards .readSync ^ 1);
			}else if(direction.toLowerCase() === "backward"){
				
					motor.GPIO_forwards.writeSync(motor.GPIO_forwards.readSync ^ 0);
					motor.GPIO_backwards.writeSync(motor.GPIO_backwards.readSync ^ 1);
			}else if(direction.toLowerCase() === "stop"){
					clearInterval(checkInterval)
					motor.GPIO_forwards.writeSync(motor.GPIO_forwards.readSync ^ 0);
					motor.GPIO_backwards.writeSync(motor.GPIO_backwards.readSync ^ 0);
			}else{
					console.log("Command Not Reconigsed");
					return 0; 
			}
		}else{
			motor.GPIO_forwards.writeSync(motor.GPIO_forwards.readSync ^ 0);
			motor.GPIO_backwards.writeSync(motor.GPIO_backwards.readSync ^ 0);
			clearInterval(checkInterval)
		}
		
	}


module.exports.moveMotor = moveMotor;





