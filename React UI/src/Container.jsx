import './Controls.css';
import './Modal.css';
import { useCallback, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { ControlComponent } from './ControlComponent';
import { ControlConfigEditor } from './ControlConfigEditor';
import { SensorConfigEditor } from './SensorConfigEditor';
import update from 'immutability-helper';
import { ControlButton } from './controlButton';
import { SensorComponent } from './Sensor'


const styles = {
  border: '1px solid #d9d9d9',
  position: 'relative',
  top: '0%',
  margin: "auto"
}




export const Container = ({motors, APIServerIP, controls, setControls}) => {

  const [controlInEdit, setControlInEdit] = useState();
  const [showControlModal, setShowControlModal] = useState(false);
  const [showSensorModal, setShowSensorModal] = useState(false);
  const [playgroundSize, setPlaygroundSize] = useState({
    width: window.innerWidth * 0.99,
    height: window.innerHeight * 0.95
  });


  useEffect(() => {
     const updatePlaygroundSize = () =>{
       let size = {
         width: window.innerWidth * 0.99,
         height: window.innerHeight * 0.99
       }

      setPlaygroundSize(size);
    }
   window.addEventListener('resize', updatePlaygroundSize)

   return () =>   window.removeEventListener('resize', updatePlaygroundSize)

 }, [playgroundSize]);

 let updateControlPos = () => {
   let controlsCopy = controls;
   let controlSize = {};
   Object.keys(controlsCopy).map((key) => {
     let controlSize = controlsCopy[key].controlSize
     if(controlsCopy[key].type === "control"){
       let multiplyer = 0.05;
       if(window.innerWidth <= 768){
         multiplyer = 0.3;
       }else if(window.innerWidth <= 992){
         multiplyer = 0.15;
       }else if(window.innerWidth <= 1400){
         multiplyer = 0.075;
       }
       controlSize = {
         width: playgroundSize.width * multiplyer,
         height: playgroundSize.width * multiplyer,
       }
       controlsCopy[key].controlSize = controlSize;
     }else{
       let multiplyer = 0.3;
       if(window.innerWidth <= 768){
         multiplyer = 0.6;
       }else if(window.innerWidth <= 992){
         multiplyer = 0.4;
       }else if(window.innerWidth <= 1400){
         multiplyer = 0.35;
       }
       controlSize = {
         width: playgroundSize.width * multiplyer,
         height: (playgroundSize.width * multiplyer) * (9 / 16)
       }
       controlsCopy[key].controlSize = controlSize;
       if(controlsCopy[key].controlSize.height > playgroundSize.height){
         controlSize = {
           height: playgroundSize.height * multiplyer,
           width: (playgroundSize.height * multiplyer) * (16 / 9)
         }
         controlsCopy[key].controlSize = controlSize;
       }
     }

     if(controlsCopy[key].top + controlSize.height > playgroundSize.height){
       console.log("Top new val Re", controlsCopy[key].top - controlSize.height)
       controlsCopy[key].top = controlsCopy[key].top - controlSize.height
     }
     if(controlsCopy[key].top < 0){
       console.log("Top new val Re", controlsCopy[key].top - controlSize.height)
       controlsCopy[key].top = controlsCopy[key].top + controlSize.height
     }
     if(controlsCopy[key].left + controlSize.width > playgroundSize.width){
       console.log("left new val Re", controlsCopy[key].left - controlSize.height)
       controlsCopy[key].left = controlsCopy[key].left - controlSize.width
     }
     if(controlsCopy[key].left < 0){
       console.log("left new val Re", controlsCopy[key].left - controlSize.height)
       controlsCopy[key].left = controlsCopy[key].left + controlSize.width
     }
   })

   setControls(controlsCopy);
 }

updateControlPos()



 console.log("playgroundSize is ", playgroundSize)

  const handleControlButton = (control, key) => {
    setControlInEdit({key, control})
    setShowControlModal(true);
  }

  const handleSensorButton = (control, key) => {
    setControlInEdit({key, control})
    setShowSensorModal(true);
  }

  const handleDeleteButton = (control, key) => {
    let controlsCopy = {...controls};
    delete controlsCopy[key];
    setControls(controlsCopy);
  }


  const moveControls = useCallback((id, left, top, motorIds, sensorIds, type, controlSize) => {
      if(type === "control"){
        controlSize = {
          width: playgroundSize.width * 0.05,
          height: playgroundSize.width * 0.05,
        }
        controlSize = controlSize;
      }else{
        controlSize = {
          width: playgroundSize.width * 0.3,
          height: (playgroundSize.width * 0.3) * (9 / 16)
        }
       controlSize = controlSize;
        if(controlSize.height > playgroundSize.height){
          controlSize = {
            height: playgroundSize.height * 0.3,
            width: (playgroundSize.height * 0.3) * (16 / 9)
          }
          controlSize = controlSize;
        }
      }



    setControls(update(controls, {
      [id]: {
        $merge: {left, top, motorIds, sensorIds, type, controlSize},
      },
    }));


  }, [controls, setControls])

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CONTROLTYPE,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveControls(item.id, left, top, item.motorIds, item.sensorIds, item.type, item.controlSize);
      return undefined;
    }
  }), [moveControls]);


  return (
    <div ref={drop} style={{...playgroundSize, ...styles}}>
    {Object.keys(controls).map((key) => {
            const { left, top, title, motorIds, sensorIds, type, controlSize} = controls[key];
            console.log(key, controls[key])
            return (
            <ControlComponent  key={key} id={key} left={left} top={top} motorIds={motorIds} sensorIds={sensorIds} type={type} >
              <div style={controlSize}>
                {type === "control" ?<div className="controlContainer">
                  <div className="controlExitContainer">
                    <button className="controlExit" onClick={(e) => {handleDeleteButton(controls[key], key)}}>✗</button>
                  </div>
                  <div className="controlButtonContainer">
                   <ControlButton title={ title } motors={ motors } assignedMotors={ motorIds } APIServerIP={APIServerIP} />
                  </div>
                  <div className="controlConfigContainer">
                  <button className="controlConfig" onClick={(e) => {handleControlButton(controls[key], key)}} >⚙</button>
                  </div>
                </div> : null}

                {type === "sensor" ? <div className="controlContainer" >

                  {sensorIds.ultraSonicSensor.uSval === true ? <div className="usSensorDeleteContainer">
                    <button className="controlExit"  onClick={(e) => {handleDeleteButton(controls[key], key)}}>✗</button>
                    <p className="videoSensorTitle">{title}</p>
                  </div>: null}

                  <SensorComponent id={key} title={title} sensorIds={sensorIds} APIServerIP={APIServerIP} renderSize = {playgroundSize} />


                  {sensorIds.ultraSonicSensor.uSval === false ?<div className="videoSensorConfigContainer">
                    <button className="videoSensorConfig" onClick={(e) => {e.preventDefault(); handleSensorButton(controls[key], key)}} >⚙ Configure Sensor</button>
                    <p className="videoSensorTitle">{title}</p>
                    <button className="controlExit" onClick={(e) => {handleDeleteButton(controls[key], key)}}>✗</button>
                  </div>: null}

                  {sensorIds.ultraSonicSensor.uSval === true ?<div className="usSensorConfigContainer" >
                     <button className="controlConfig"  onClick={(e) => {e.preventDefault(); handleSensorButton(controls[key], key)}} >⚙</button>
                  </div>: null}

                </div> : null}

              </div>
            </ControlComponent>);
        })}

    {showControlModal ? <ControlConfigEditor controlObj={controlInEdit} motors={motors} setModalState={setShowControlModal} setControls={setControls} controls={controls}/> : null}
    {showSensorModal ? <SensorConfigEditor controlObj={controlInEdit} setShowSensorModal={setShowSensorModal} setControls={setControls} controls={controls}/> : null}
  </div>
  )
}
