import { useState, useEffect } from 'react';
import './Controls.css';


export const SensorComponent = ({id, title, sensorIds, APIServerIP, renderSize }) => {
  let cameraBool = false;
  let [cameraUrl, setCameraUrl] = useState("");
  let [ultraSonicValue, setUltraSonicValue] = useState("Fetching Distance")





  async function getDistance(trigg, echo){
    let reqBody = {
      "trigg" : trigg,
      "echo" : echo
    }
    console.log(reqBody)
    let distance = await fetch(`${APIServerIP}/ultraSonicValue`, { method: 'POST', body: JSON.stringify(reqBody), headers: { 'Content-Type': 'application/json' } })
    .then(res => res.json())
    .then(distanceObj => Math.round(distanceObj.distance))
    console.log("distance is", distance)
    setUltraSonicValue(`Distance: ${distance}cm`)
  }

  useEffect(() => {
    if(sensorIds.cameraVal){
      setCameraUrl(`${APIServerIP}/stream.mjpg`)
    };

    const interval = setInterval(() => {
      getDistanceAtIterval()
      async function getDistanceAtIterval() {
        if(sensorIds.ultraSonicSensor.uSval === true){
          try{
              getDistance(sensorIds.ultraSonicSensor.trig,sensorIds.ultraSonicSensor.echo)
            }catch(e){
              console.log(e);
          }
        }

      }

   }, 1000)
   return () => clearInterval(interval)
 }, [ultraSonicValue])




  return(
    <div className="sensorContainer">
      {sensorIds.cameraVal ?  <div className="sensorVideoContainer">
        <img style={{height: "100%"}}  src={cameraUrl} />
      </div> : null }
      {sensorIds.ultraSonicSensor.uSval ? <div className="usContainer">
         <p>{ultraSonicValue}</p>
      </div>: null}

    </div>


  )
}
