import React from 'react';
import './Modal.css';
import { ControlTypeButton }  from './ControlTypeButton.jsx'
import { useState } from 'react';



export const SensorConfigEditor = ({controlObj, setShowSensorModal, setControls, controls}) => {

  const [sensorIDs, setSensorIDs] = useState(controlObj.control.sensorIds);
  const [displayError, setDisplayError] = useState(false)

  console.log("sensor render")

  const handleClose = () => {
    setShowSensorModal(false)
  }

  const handleSensorConfigSubmit = (e) => {
    e.preventDefault()
    let inputData = e.target;
    let controlToUpdate = controlObj;
    if(inputData.cameraVal.value.toLowerCase() === "on"  && inputData.uSval.value.toLowerCase() === "on"){
      setDisplayError(true)
      return;
    }
    controlToUpdate.control.sensorIds.cameraVal = inputData.cameraVal.value.toLowerCase() === "on" ? true : false;
    controlToUpdate.control.sensorIds.ultraSonicSensor.uSval = inputData.uSval.value.toLowerCase() === "on" ? true : false;
    controlToUpdate.control.sensorIds.ultraSonicSensor.trig = isNaN(inputData.trig.value.toLowerCase()) ? null : parseInt(inputData.trig.value);
    controlToUpdate.control.sensorIds.ultraSonicSensor.echo = isNaN(inputData.echo.value.toLowerCase()) ? null : parseInt(inputData.echo.value);
    controlToUpdate.control.title = inputData.title.value;
    let controlsCopy = controls;
    controlsCopy[controlToUpdate.key] =  controlToUpdate.control;
    setControls(controlsCopy)
  }


  console.log("sensor Control Obj", controlObj.control)

  const handleCameraDropdownChange = (e) => {
    let sensorIDsCopy = sensorIDs;
    let controlObjCopy = controlObj
    setDisplayError(false)
    if(e.target.value === "on" && sensorIDs.ultraSonicSensor.uSval === false){
      sensorIDsCopy.cameraVal = true
      sensorIDsCopy.ultraSonicSensor.uSval = false
      controlObjCopy.control.sensorIds.cameraVal = true
      controlObjCopy.control.sensorIds.ultraSonicSensor.uSval = false
    }else{
      sensorIDsCopy.cameraVal = false
      sensorIDsCopy.ultraSonicSensor.uSval = true
      controlObjCopy.control.sensorIds.cameraVal = false
      controlObjCopy.control.sensorIds.ultraSonicSensor.uSval = true
    }
    setSensorIDs(sensorIDsCopy);
    let controlsCopy = controls;
    controlsCopy[controlObjCopy.key] =  controlObjCopy.control;
    setControls(controlsCopy)
  }

  const handleUsDropdownChange = (e) => {
    let sensorIDsCopy = sensorIDs;
    let controlObjCopy = controlObj
    setDisplayError(false)
    if(e.target.value === "on" && sensorIDs.cameraVal === false){
      sensorIDsCopy.cameraVal = false
      sensorIDsCopy.ultraSonicSensor.uSval = true
      controlObjCopy.control.sensorIds.ultraSonicSensor.uSval = true
      controlObjCopy.control.sensorIds.cameraVal = false
    }else{
      sensorIDsCopy.cameraVal = true
      sensorIDsCopy.ultraSonicSensor.uSval = false
      controlObjCopy.control.sensorIds.ultraSonicSensor.uSval = false
      controlObjCopy.control.sensorIds.cameraVal = true
    }
    setSensorIDs(sensorIDsCopy);
    let controlsCopy = controls;
    controlsCopy[controlObjCopy.key] =  controlObjCopy.control;
    setControls(controlsCopy)
  }


  return (
    <div className="editorContainer">
      <div className="modalExitContainer">
        <div>
          <div className="modalExitTitleContainer">
              <h2>Sensor Configuration</h2>
          </div>

        </div>
        <div>
          <div>
            <button className="modalExit" onClick={() => {handleClose()}}>✗</button>
          </div>
        </div>
      </div>


      <form onSubmit={handleSensorConfigSubmit}>
          <div>
            <h3>Camera Options</h3>
            <div className="sensorDropDownContainer">
              <div>
                  <label>Camera on/off</label>
              </div>

              <div>
                <select type="" name="cameraVal" defaultValue={sensorIDs.cameraVal === true && sensorIDs.ultraSonicSensor.uSval === false  ? "on" : "off"} onChange={handleCameraDropdownChange}>
                  <option value="on">on</option>
                  <option value="off">off</option>
                </select>
              </div>

            </div>
            {displayError === true ? <div className="sensorError">
              <p>The camera and ultrasonic sensors cannot both be set to on</p>
            </div> : null}

          </div>
          <div>
            <h3>Ultrasonic Sensor</h3>
            <div className="sensorDropDownContainer">
              <div>
                <label>Ultrasonic Sensor on/off</label>
              </div>
              <div>
                <select type="" name="uSval" defaultValue={sensorIDs.ultraSonicSensor.uSval === true  && sensorIDs.cameraVal === false ? "on" : "off"} onChange={handleUsDropdownChange}>
                  <option value="on">on</option>
                  <option value="off">off</option>
                </select>
              </div>
            </div>
            {displayError === true ? <div className="sensorError">
              <p>The camera and ultrasonic sensors cannot both be set to on</p>
            </div> : null}
            <div className="usSensorContainer">
              <div>
                <label>Trigger GPIO</label>
              </div>
              <div>
                <label>Echo GPIO</label>
              </div>
            </div>
            <div className="usSensorContainer">
              <div>
                <input type="" name="trig" defaultValue={sensorIDs.ultraSonicSensor.trig === null ? "Unassigned" : sensorIDs.ultraSonicSensor.trig} />
              </div>
              <div>
                <input type="" name="echo" defaultValue={sensorIDs.ultraSonicSensor.echo === null ? "Unassigned" : sensorIDs.ultraSonicSensor.echo} />
              </div>
            </div>
          </div>
          <div className="changeTitleContainer">
            <h3>Sensor name</h3>
            <div>
              <input type="" name="title" defaultValue={controlObj.control.title} />
            </div>
          </div>
          <div>
              <button className="addControlSave motorConfigSave sensorSaveButton" type="submit">Save</button>
          </div>


      </form>
      <ControlTypeButton controlObj={controlObj} setControls={setControls} controls={controls} setModalState={setShowSensorModal}/>
      </div>
  )
}
