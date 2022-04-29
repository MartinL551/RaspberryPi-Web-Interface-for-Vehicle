import './App.css';
import { useState } from 'react';
import { Container } from './Container'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './Modal.css';
const store = require('store')

class Control {
  constructor(top, left, title, motorIds, sensorIds, type){
    this.top = top;
    this.left = left;
    this.title = title;
    this.motorIds = motorIds;
    this.sensorIds = sensorIds;
    this.type = type;
  }
}

class Motor {
  constructor(id, vanityName, output1, output2){
    this.id = id.toString();
    this.vanityName = vanityName;
    this.output1 = output1;
    this.output2 = output2;
  }
}




// http://192.168.1.147:5000
const APIServerIP = 'http://192.168.1.147:5000';
async function getConfigFile() {
  await fetch(`${APIServerIP}/config`, { method: 'GET'})
    .then(res => res.json())
    .then(data => {
        console.log("fetching config File", data)
        store.set('motors', data);
      })
    .catch(e => console.log(e))
}
getConfigFile()

async function saveLayout(controls) {
  console.log("saveLayout", controls)
  await fetch(`${APIServerIP}/saveLayout`, { method: 'POST', body: JSON.stringify(controls), headers: { 'Content-Type': 'application/json' } });
}

async function loadLayout(){
  await fetch(`${APIServerIP}/loadLayout`, { method: 'GET'})
  .then(res => res.json())
  .then(data => {
    console.log('Loaded Controls', data)
    store.set('controls', data);
  }).catch(e => console.log(e))
}

async function saveMotorsFile(motorsFile) {
  await fetch(`${APIServerIP}/saveConfig`, { method: 'POST', body: JSON.stringify(motorsFile), headers: { 'Content-Type': 'application/json' } });
}

loadLayout()

function App() {

  const [motorsFile, setMotorsFile] = useState(store.get('motors'))

  // const testMotorFile = [{"id": 0 , "vanityName": "Front Left", "output1" : 3, "output2": 4}, {"id": 1 , "vanityName": "Front Left", "output1" : 3, "output2": 4}];
  // const [controls, setControls] = useState({
  //   a: { top: 20, left: 80, title: 'Arrow Up', motorIds: [[1, 'forward'], [2, 'forward'], [3, 'forward'], [4, 'forward']]},
  //   b: { top: 80, left: 80, title: 'Arrow Down', motorIds: [[1, 'backward'], [2, 'backward'], [3, 'backward'], [4, 'backward']]},
  // });

  const [controls, setControls] = useState(store.get('controls'));

  console.log("first Render", controls)
  console.log("motorfile", motorsFile)

  const [showAddControlModal, setShowAddControlModal] = useState(false);
  const [showMotorConfig, setShowMotorConfig] = useState(false);

  const handleAddControl = () => {
    setShowAddControlModal(true);
  }

  const handleLoadLayout = async() => {
    await loadLayout()
    setControls(store.get('controls'))
  }

  const handleSaveLayout = () => {
    saveLayout(controls)
  }

  const handleMotorConfig = () => {
    setShowMotorConfig(true)
  }


  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <div>
          <div className="navBar">
            <div className="navBar-left">
              <button type="button" onClick = {handleAddControl} >Add Empty Control/Sensor</button>
              <button style={{marginLeft: "40px"}} type="button" onClick = {handleMotorConfig}>Edit Motor Config</button>
            </div>
            <div className="navBar-right">
              <button  type="button" onClick = {handleSaveLayout}> Save Layout </button>
              <button style={{marginLeft: "40px"}} type="button" onClick = {handleLoadLayout}> Load Layout </button>
            </div>


          </div>
          <Container motors={ motorsFile }
              APIServerIP={ APIServerIP }
              controls={ controls }
              setControls = { setControls }/>
        </div>

        </DndProvider>
        <div>
          {showAddControlModal ? <AddControlForm controls={controls} setControls={setControls} setShowAddControlModal={setShowAddControlModal}/> : null}
          {showMotorConfig ? <EditConfigForm motorsFile={motorsFile} setMotorsFile={setMotorsFile} setShowMotorConfig={setShowMotorConfig} controls={controls} setControls={setControls}/> : null}
        </div>
    </div>
  );
}

const AddControlForm = ({controls, setControls, setShowAddControlModal}) => {

  const [dropDownState, setDropdownState] = useState("control")

  const handleAddControl = (e) => {
    e.preventDefault(e)
    let controlsCopy = controls;
    let objectKey = e.target.id.value;
    let objectTitle = e.target.title.value;
    let objectType = e.target.type.value;

    const newControl = new Control(100, 100, objectTitle, [], {cameraVal : false, ultraSonicSensor : {uSval : false, trig: null, echo: null}}, objectType.toLowerCase());

    controlsCopy[objectKey] = newControl;
    setControls(controlsCopy);
    handleClose();
  }

  const handleClose = () => {
    setShowAddControlModal(false);
  }

  const handleChangeDropdownState = (e) => {
    setDropdownState(e.target.value)
  }

  return(
    <div className="editorContainer addControlModal">
      <div className="modalExitContainer">
        <div>
          <div className="modalExitTitleContainer">
              <h2>Add Empty Control/Sensor</h2>
          </div>

        </div>
        <div>
          <div>
            <button className="modalExit" onClick={() => {handleClose()}}>✗</button>
          </div>
        </div>
      </div>
      <form  onSubmit={handleAddControl}>
        <ul>
          <li>
            <div>
              <p>Control Id</p>
            </div>
            <div>
              <input type="" name="id" defaultValue="Control ID" />
            </div>
          </li>
          <li>
            <div>
                <p>Control Title</p>
            </div>
            <div>
                <input type="" name="title"  defaultValue="Control Title" />
            </div>
          </li>
          <li>
            <div>
              <p>Control Type</p>
            </div>
            <div>
              <select name="type" value={dropDownState} onChange={handleChangeDropdownState}>
                  <option value="control">control</option>
                  <option value="sensor">sensor</option>
                </select>
            </div>
          </li>
        </ul>
        <div className="addControlSaveContainer">
          <button className="addControlSave" type="submit">Save</button>

        </div>
      </form>

    </div>

  )
}


const EditConfigForm = ({motorsFile, setMotorsFile, setShowMotorConfig, controls, setControls}) => {
  const [motorsFileCopy, setMotorsFileCopy] = useState(motorsFile);


  const handleClose = () => {
    setShowMotorConfig(false);
  }

  const handleDeleteMotor = (idToDelete) => {
    let motorsFileUpdate = motorsFileCopy;
    let controlsToUpdate = controls;
    let newMotorsFileArr = [];

    for(let i=0; i < motorsFileUpdate.length; i++){
      if(motorsFileUpdate[i].id !== idToDelete){
        newMotorsFileArr.push(motorsFileUpdate[i])
      }
    }

    setMotorsFileCopy(newMotorsFileArr)
    setControls(controlsToUpdate);
  }

  const checkIfMotorExistsInControl = () =>{
    let controlsCopy = controls;


    Object.keys(controlsCopy).forEach((key) => {
      let newMotorIds = []

      for(let i = 0; i < motorsFileCopy.length; i++){
        controlsCopy[key].motorIds.forEach((motor, index) => {
          console.log("motorsFileId", motorsFile[i].id)
          console.log("motorControlId", motor[0])
          if(parseInt(motorsFile[i].id) === motor[0]){
            console.log("adding motor to new Array")
            newMotorIds.push(motor)
          }
        })
      }

      console.log(newMotorIds)
      controlsCopy[key].motorIds = newMotorIds;

    })
    setControls(controlsCopy)
    console.log("deletedMotors", controls)
  }

  const handleEditorSubmit = (e) => {
    e.preventDefault()
    let inputData = e.target;
    let newMotorsArray = [];
    for(let i=0; i < inputData.length - 1; i+=5){
      let newMotor = new Motor(inputData[i].value,inputData[i + 1].value,inputData[i + 2].value,
                                inputData[i + 3].value)
      newMotorsArray.push(newMotor)
    }
    handleUpdateMotorsFile(newMotorsArray)
    checkIfMotorExistsInControl()
  }

  const handleUpdateMotorsFile = (newMotorsArray) => {
    store.set('motors', newMotorsArray)
    saveMotorsFile(newMotorsArray)
    setMotorsFile(newMotorsArray)
  }



  const handleAddMotorSubmit = (e) => {
    e.preventDefault()
    let motorsFileCopyToUpdate = [...motorsFileCopy];
    let inputData = e.target;
    console.log(inputData)
    if(isNaN(inputData[1].value) || isNaN(inputData[2].value) || inputData[0].value.toLowerCase() === "vanity name"
      || inputData[0].value.toLowerCase() === "" || inputData[0].value.toLowerCase() === ""){
      return
    }

    let newMotor = new Motor(parseInt(motorsFileCopyToUpdate.slice(-1)[0].id) + 1, inputData[0].value, inputData[1].value, inputData[2].value)
    motorsFileCopyToUpdate.push(newMotor);
    setMotorsFileCopy(motorsFileCopyToUpdate);



  }

  return (
    <div className="editorContainer motorConfigModal">
      <div className="modalExitContainer">
        <div>
          <div className="modalExitTitleContainer">
              <h2>Edit Motor Configuration</h2>
          </div>

        </div>
        <div>
          <div>
            <button className="modalExit" onClick={() => {handleClose()}}>✗</button>
          </div>
        </div>
      </div>

      <form onSubmit={handleEditorSubmit}>
        <ul>
          <li className="motorConfigModalTitleContainer">
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
          {motorsFileCopy.map((motor, index) => {
            return(
              <li className="motorConfigModalInputsContainer" key={index}>
                  <div className="idContainer">
                    <input readOnly name={motor.id} value={motor.id} />
                  </div>
                  <div>
                    <input type="" name={motor.vanityName} defaultValue={motor.vanityName} />
                  </div>
                  <div>
                    <input type="" name={motor.output1} defaultValue={motor.output1} />
                  </div>
                  <div>
                    <input type="" name={motor.output2} defaultValue={motor.output2} />
                  </div>
                  <div>
                    <button className="modalExit deleteButton" onClick={(e) => {e.preventDefault(); handleDeleteMotor(motor.id)}}>✗</button>
                  </div>

              </li>
            )
          })}
        </ul>
        <div className="addSaveContainer">
          <button className="addControlSave motorConfigSave" type="submit" >Save</button>
        </div>


      </form>

      <h2>Add New Motor</h2>

      <form onSubmit= {handleAddMotorSubmit}>
        <ul className="addMotorList">
          <li className="addNewMotorContainer">
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
          <li className="addNewMotorContainer">
            <div>
                <input type="" name="" defaultValue="Vanity Name" />
            </div>
            <div>
                <input type="" name="" defaultValue="Output1" />
            </div>
            <div>
                <input type="" name="" defaultValue="Output2"/>
            </div>
            <div>
              <button className="modalExit addButton" type="submit">+</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  )
}


export default App;
