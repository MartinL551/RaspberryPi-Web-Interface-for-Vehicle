import React from 'react';
import './Modal.css';


export const ControlTypeButton =  ({controlObj, setControls, controls, setModalState}) => {
  console.log(controlObj)
  const handleChangeType = (e) =>{
    e.preventDefault()
    let controlObjCopy  = controlObj;
    let controlsCopy = controls;

    controlObjCopy.control.type = controlObjCopy.control.type === "sensor" ? "control" : "sensor";
    controlsCopy[controlObjCopy.key] = controlObjCopy.control;

    console.log("Control Type", controlsCopy)

    setControls(controlsCopy)
    setModalState(false)

  }

  return (
    <div >
      <h2>Control Type</h2>
      <button className="addControlSave typeButton" type="button" onClick={(e) => handleChangeType(e)}>{controlObj.control.type === "sensor" ? <p>Change to Control</p> : <p>Change to Sensor</p>}</button>
    </div>
  )
}
