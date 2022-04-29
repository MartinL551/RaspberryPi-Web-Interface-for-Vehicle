import React from 'react';
import './Modal.css';
import { ControlTypeButton }  from './ControlTypeButton.jsx'
import { useState, useEffect } from 'react';

export const ControlConfigEditor = ({controlObj, motors, setModalState, setControls, controls}) => {
  const handleClose = () => {
    setModalState(false)
  }

  return (
    <div className="editorContainer controlConfigModal">
      <div className="modalExitContainer">
        <div>
          <div className="modalExitTitleContainer">
              <h2>Control Configuration</h2>
          </div>

        </div>
        <div>
          <div>
            <button className="modalExit" onClick={() => {handleClose()}}>✗</button>
          </div>
        </div>
      </div>

      <h3>Available Motors</h3>
      <ul>
        <li className="motorsListContainer">
          <div>
            <p>ID</p>
          </div>
          <div>
            <p>Vanity Name</p>
          </div>
          <div>
            <p>Output1</p>
          </div>
          <div>
            <p>Output2</p>
          </div>
        </li>
        {motors.map((motor, index) => {
          return(
            <li className="motorsListContainer" key={index}>
              <div>
                <p>{motor.id}</p>
              </div>
              <div>
                <p>{motor.vanityName}</p>
              </div>
              <div>
                <p>{motor.output1}</p>
              </div>
              <div>
                <p>{motor.output2}</p>
              </div>
            </li>
          )
        })}
      </ul>
      <h2>Assigned Motors</h2>
      <Form controlObj={controlObj} setControls={setControls} motors={motors} controls={controls} />

      <ControlTypeButton controlObj={controlObj} setControls={setControls} controls={controls} setModalState={setModalState}/>

    </div>
  )
}

const Form = ({controlObj, setControls, motors, controls}) => {
  const [newControl, setNewControl] = useState(controlObj)
  const [directionDropDown, setDirectionDropdown] = useState("forward");



  console.log("Control Obj", newControl)

  const handleControlSubmit = (e) => {
    e.preventDefault()
    let inputData = e.target;
    let newMotorIds = [];
    console.log("inputDatais", e.target)

    for(let i=1; i < inputData.length - 1; i+=3){

      let newId = parseInt(inputData[i].value);
      let newDirection = inputData[i + 1].value;
      let motorArray = [newId, newDirection]
      newMotorIds = [...newMotorIds, motorArray]
    }

    let newControlCopy = newControl;

    newControlCopy.control.title = inputData[0].value;
    newControlCopy.control.motorIds = newMotorIds;
    setNewControl(newControlCopy)

    let controlsCopy = controls;
    controlsCopy[newControl.key] = newControl.control;

    setControls(controlsCopy);
    console.log("New Obj", controlsCopy);
  }

  const handleAddMotor = (e) =>
  {
    e.preventDefault()
    let newControlCopy = Object.create(newControl);
    let id = parseInt(e.target[0].value);
    let direction = e.target[1].value;
    let motorIdsArray =  newControlCopy.control.motorIds;
    let motorArray = [id, direction];
    let motorInUse = false;
    let motorInArray = false;


    for(let i=0; i < motorIdsArray.length; i++){
      if(motorIdsArray[i][0] === id){
        motorInUse = true;
        break;
      }
    }

    for(let i=0; i < motors.length; i++){
      if(parseInt(motors[i].id) === id){
        motorInArray = true;
      }
    }

    if(!motorInUse && motorInArray){
      let newMotorIdsArray = [...newControlCopy.control.motorIds, motorArray];
      newControlCopy.control.motorIds = newMotorIdsArray;
      setNewControl(newControlCopy)
      console.log(newControl)
    }else{
      console.log("Motor In Use or is not configured")
    }


  }

  const handleDeleteMotorFromControl = (motorId) =>{
    let newControlCopy = newControl;
    let motorIDs = newControl.control.motorIds

    for(let i=0; i < motorIDs.length; i++){
        if(motorIDs[i][0] === parseInt(motorId)){
          motorIDs.splice(i, 1)
        }
    }

    newControlCopy.control.motorIds = motorIDs;
    let controlsCopy = controls;
    controlsCopy[newControlCopy.key] = newControlCopy.control;
    setNewControl(Object.create(newControlCopy))
    setControls(controlsCopy);


    console.log("deleted motor from control", controls)
  }

  const handleChangeDropdownState = (e, index) => {
    console.log("Change Dropdown")
    let controlDirection = e.target.value;
    let newControlCopy = newControl;

    newControlCopy.control.motorIds[index][1] = controlDirection
    setNewControl(newControlCopy);


  }

  return(
    <div>
      <form className="controlConfigModal" onSubmit={handleControlSubmit}>
        <ul className="assignedMotorsList">
          <li><p className="assignedMotorTitleLabel">Control Name</p></li>
          <li><input className="assignedMotorTitle" type="text" name={controlObj.control.title} defaultValue={controlObj.control.title} /></li>
          <li className="assMotorsListContainer">
            <div>
              <p>ID</p>
            </div>
            <div>
              <p>Name</p>
            </div>
            <div>
              <p>Direction</p>
            </div>
          </li>

          {newControl.control.motorIds.map((assignedMotor, index) => {
            console.log("assMotorIs", assignedMotor)
             return(
              <li className="assMotorsListContainer" key={index}>
                <div>
                  <input type="text" name={motors[assignedMotor[0]].id} defaultValue={motors[assignedMotor[0]].id} />
                </div>
                <div>
                  <p>{motors[assignedMotor[0]].vanityName}</p>
                </div>
                <div>

                    <select name="type" defaultValue={assignedMotor[1]} onChange={(e) => {handleChangeDropdownState(e, index)}}>
                        <option value="forward">forward</option>
                        <option value="backward">backward</option>
                      </select>
                </div>
                <div>
                  <button className="modalExit deleteButton" type="button" onClick={(e) => {e.preventDefault(); handleDeleteMotorFromControl(motors[assignedMotor[0]].id)}}>✗</button>
                </div>
              </li>
            )
          })}
          <li><button className="addControlSave controlConfigSave" type="submit" >Save Changes</button></li>
        </ul>
      </form>

      <h2>Add New Motor to Control</h2>
      <form  onSubmit={handleAddMotor}>
        <div className="addMotorToControlForm">
          <div>
            <p>ID</p>
          </div>
          <div>
              <p>Direction</p>
          </div>
        </div>
        <div className="addMotorToControlForm">
          <div>
            <input type="text" name="Id" defaultValue="Enter ID"/>
          </div>
          <div>
              <select name="Direciton" defaultValue={directionDropDown} onChange={(e) => {setDirectionDropdown(e.target.value)}}>
                    <option value="forward">forward</option>
                    <option value="backward">backward</option>
              </select>
          </div>
          <div>
            <button className="modalExit addButton" type="submit">+</button>
          </div>
        </div>


      </form>
    </div>
  )
}
