import styled from "styled-components";
import { useEffect, useState, useRef } from 'react';
import { useMousePosition } from './useMousePosition';

const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.done {
    background-image: url('../public/isis.jpg');
    background-size: cover;
  }
`

const StyledControlPanel = styled.div`
  background-color: lightgrey;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 2rem;
  position: fixed;
  top: 50%;
  left: 0;
`

const StyledDrawingContainer = styled.div`
`

function App() {
  const [generatorStep, setGeneratorStep] = useState(1);

  // Mouse coordinates
  const mouseCoords= useMousePosition();

  // Starting points variables
  const firstPoint = useRef({id: 1, x: 0, y: 0});
  const secondPoint = useRef({id: 2, x: 0, y: 0});
  const thirdPoint = useRef({id: 3, x: 0, y: 0});
  const startPoint = useRef({id: 4, x: 0, y: 0});

  // Generator options and variables
  const [newPointsCount, setNewPointsCount] = useState(100);
  const [precision, setPrecision] = useState(100);

  // Drawn point list
  const [pointList, setPointList] = useState([
    firstPoint.current, 
    secondPoint.current, 
    thirdPoint.current, 
    startPoint.current
  ]);

  // Point generation functions
  const getRandomPoint = () => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return (firstPoint.current);
      case 1:
        return (secondPoint.current);
      case 2:
        return (thirdPoint.current);
    };
  };

  const drawNewPoints = () => {
    let lastPoint = pointList[pointList.length-1];
    let newPoints = [];
    for (let pas = 0; pas < newPointsCount; pas++) {
      const referencepoint = getRandomPoint();
      const newPoint = {
        id: lastPoint.id + 1,
        x: Math.round((lastPoint.x + referencepoint.x)/2*precision)/precision,
        y: Math.round((lastPoint.y + referencepoint.y)/2*precision)/precision,
      };
      lastPoint = newPoint;
      newPoints.push(newPoint);
    };
    setPointList((current)=>[...current, ...newPoints]);
  };

  const clearGenerator = () => {
    firstPoint.current = {id: 1, x: 0, y: 0};
    secondPoint.current = {id: 2, x: 0, y: 0};
    thirdPoint.current = {id: 3, x: 0, y: 0};
    startPoint.current = {id: 4, x: 0, y: 0};
    setGeneratorStep(1);
    setPointList([
      firstPoint.current, 
      secondPoint.current, 
      thirdPoint.current, 
      startPoint.current
    ])
  }


  // Generator engine
  const handleGeneratorStart = () => {
    switch (generatorStep) {
      case 1:
        firstPoint.current.x = mouseCoords.x;
        firstPoint.current.y = mouseCoords.y;
        setGeneratorStep(2);
        break;
      case 2:
        secondPoint.current.x = mouseCoords.x;
        secondPoint.current.y = mouseCoords.y;
        setGeneratorStep(3);
        break;
      case 3:
        thirdPoint.current.x = mouseCoords.x;
        thirdPoint.current.y = mouseCoords.y;
        setGeneratorStep(4);
        break;
      case 4:
        startPoint.current.x = mouseCoords.x;
        startPoint.current.y = mouseCoords.y;
        setGeneratorStep(5);
        break;
      case 5:
        break;
    }
  }

  return (
    <StyledApp onClick={handleGeneratorStart} className={pointList.length>2000?'done':''}>
      <StyledControlPanel>
        <h2>Control Panel</h2>
        <span>Step: {generatorStep}</span>
        <span>global X: {mouseCoords.x}</span>
        <span>global Y: {mouseCoords.y}</span>
        <span>First point: X={firstPoint.current.x} Y={firstPoint.current.y}</span>
        <span>Second point: X={secondPoint.current.x} Y={secondPoint.current.y}</span>
        <span>Third point: X={thirdPoint.current.x} Y={thirdPoint.current.y}</span>
        <span>Start point: X={startPoint.current.x} Y={startPoint.current.y}</span>
        <span>Points: {pointList.length}</span>
        <button onClick={clearGenerator}>Clear</button>
        <button onClick={drawNewPoints}>Draw points</button>
        <button onClick={()=>{setGeneratorStep(1)}}>Another one</button>
      </StyledControlPanel>
      <StyledDrawingContainer>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height={window.innerHeight - 2}
          width={window.innerWidth }
        >
          {pointList.map((point)=>(
            <circle key={point.id} cx={point.x} cy={point.y} r="1" stroke="black" fill="black" strokeWidth="2"/>
          ))}
          
          <circle cx={firstPoint.current.x} cy={firstPoint.current.y} r="1" stroke="black" fill="black" strokeWidth="50"/>
          <circle cx={secondPoint.current.x} cy={secondPoint.current.y} r="1" stroke="black" fill="black" strokeWidth="50"/>
          <circle cx={thirdPoint.current.x} cy={thirdPoint.current.y} r="1" stroke="black" fill="black" strokeWidth="50"/>
        </svg>
      </StyledDrawingContainer>
    </StyledApp>
  )
}

export default App
