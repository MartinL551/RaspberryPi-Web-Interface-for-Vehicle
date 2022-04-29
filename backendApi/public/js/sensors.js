
// This code is taken from the hc-sr04-pi node package.
// HAd some issues importing the class so moved to a new file and changed the export method.  
const pigpio_1 = require("pigpio");
const SPEED_OF_SOUND = 0.03432;
class DistanceMeter {
    constructor(triggerPin, echoPin) {
        this.trigger = new pigpio_1.Gpio(triggerPin, { mode: pigpio_1.Gpio.OUTPUT });
        this.echo = new pigpio_1.Gpio(echoPin, { mode: pigpio_1.Gpio.INPUT, alert: true });
        this.trigger.digitalWrite(0);
    }
    getDistance() {
        if (this.currentMeasuringPromise) {
            return this.currentMeasuringPromise;
        }
        this.currentMeasuringPromise = new Promise(async (resolve) => {
            const firstDistance = await this.readDistance();
            this.wait(150);
            const secondDistance = await this.readDistance();
            this.wait(150);
            const thirdDistance = await this.readDistance();
            const totalDistance = firstDistance + secondDistance + thirdDistance
                - Math.max(firstDistance, secondDistance, thirdDistance)
                - Math.min(firstDistance, secondDistance, thirdDistance);
            this.currentMeasuringPromise = undefined;
            resolve(totalDistance);
        });
        return this.currentMeasuringPromise;
    }
    readDistance() {
        return new Promise((resolve) => {
            let startTick;
            const echoListenerCallback = (level, tick) => {
                if (level === 1) {
                    startTick = tick;
                    return;
                }
                const endTick = tick;
                const timeBetweenTicks = (endTick >> 0) - (startTick >> 0);
                const measuredDistance = (timeBetweenTicks / 2) * SPEED_OF_SOUND;
                const distance = measuredDistance > 500 || measuredDistance < 0 ? -1 : measuredDistance;
                resolve(distance);
                this.echo.removeListener('alert', echoListenerCallback);
            };
            this.echo.on('alert', echoListenerCallback);
            this.trigger.trigger(10, 1);
        });
    }
    wait(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}


// let testSensor = new DistanceMeter(23, 18);
// async function test() {
//     testSensor.getDistance().then(result => console.log(result))
// }
// test()


module.exports = {
    DistanceMeter : DistanceMeter
}




