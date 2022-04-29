import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
    position: 'absolute',
    border: '2px solid #d9d9d9',
    borderRadius : '10px',
    backgroundColor: 'white',
    cursor: 'move',
};
export const ControlComponent = ({ id, left, top, children, motors, motorIds, sensorIds, type}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.CONTROLTYPE,
        item: { id, left, top, motorIds, sensorIds, type},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [id, left, top]);
    if (isDragging) {
        return <div ref={drag}/>;
    }


    return (<div ref={drag} style={{ ...style, left, top }} role="controlType">
			{children}
		</div>);
};
