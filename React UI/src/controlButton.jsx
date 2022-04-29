import React from 'react';
import './Controls.css';

export const ControlButton = ({id, title, motors, assignedMotors, APIServerIP}) => {


  const startMotor = () => {
    assignedMotors.forEach(motorId => {
      console.log(motorId);
      let motorIndex = motorId[0];
      console.log(motorIndex);
      let motorDirection = motorId[1];
      console.log(motorDirection);
      let motor =  motors[motorIndex];


      let command = {
        motorId: motor.id,
        command: motorDirection
      };
      handleCommand(command)
    })

  };

  const stopMotor = () => {
    assignedMotors.forEach(motorId => {
      let motorIndex = motorId[0];
      let motor =  motors[motorIndex];


      let command = {
        motorId: motor.id,
        command: 'stop'
      };
      handleCommand(command)
    })

  };

  async function handleCommand(command){
    await fetch(`${APIServerIP}/command`, { method: 'POST', body: JSON.stringify(command), headers: { 'Content-Type': 'application/json' } });
  }

  return(
    <div className="controlButton">
      <button id={id} onMouseDown={startMotor} onMouseUp={stopMotor}>{title}</button>
    </div>
  )
}
