import styled from "styled-components";
import { useEffect, useState, useRef } from 'react';
import { useMousePosition } from './useMousePosition';
import Draggable from "react-draggable";

const colors = {
  pink: '#FF61C6',
  lightblue: '#5CECFF',
  yellow: '#F4FF61',
  orange: '#FF9900',
  blue: '#375971',
  darkblue: '#0A0C37',
}

const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('../public/bggrid.jpg');
  background-size: cover;
  overflow: hidden;
  background-color: ${colors.darkblue};
`

const StyledAppTitle = styled.h1`
  position: absolute;
  top: 5vh;
  font-size: 7vw;
  font-family: 'Broadway Gradient 3D', sans-serif;
  color: ${colors.lightblue};
`

const StyledAppInstructions = styled.span`
  position: absolute;
  bottom: 5vh;
  font-size: 3.5rem;
  color: ${colors.lightblue};
`

const StyledControlPanel = styled.div`
  background-color: ${colors.darkblue};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid ${colors.lightblue};
  padding: 1rem;
  cursor: grab;
  color: ${colors.lightblue};
  & input {
    border: inherit;
    width: 6rem;
    font-size: 1rem;
    background-color: ${colors.darkblue};
    color: inherit;
  }
`

const StyledCPButton = styled.div`
  border: 1px outset;
  padding: 1rem;
  /* border-radius: 15px; */
  cursor: pointer;
  width: 90%;
  text-align: center;
  &:hover {
    color: ${colors.pink}
  }
`

const StyledDrawingContainer = styled.div`
cursor: auto;
&.drawing {
  cursor: crosshair;
}
`

function App() {
  const [generatorStep, setGeneratorStep] = useState(0);

  // Mouse coordinates
  const mouseCoords= useMousePosition();

  // Starting points variables
  const firstPoint = useRef({id: 1, x: 0, y: 0});
  const secondPoint = useRef({id: 2, x: 0, y: 0});
  const thirdPoint = useRef({id: 3, x: 0, y: 0});
  const startPoint = useRef({id: 4, x: 0, y: 0});

  // Generator options and variables
  const [newPointsCount, setNewPointsCount] = useState(100);

  // Drawn point list
  const [pointList, setPointList] = useState([]);

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
        x: Math.round((lastPoint.x + referencepoint.x)/2*100)/100,
        y: Math.round((lastPoint.y + referencepoint.y)/2*100)/100,
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
    setGeneratorStep(0);
    setPointList([]);
  };


  // Generator engine
  const handleGeneratorStart = () => {
    switch (generatorStep) {
      case 0:
        break;
      case 1:
        firstPoint.current.x = mouseCoords.x;
        firstPoint.current.y = mouseCoords.y;
        setPointList((current)=>[...current, firstPoint.current]);
        setGeneratorStep(2);
        break;
      case 2:
        secondPoint.current.x = mouseCoords.x;
        secondPoint.current.y = mouseCoords.y;
        setPointList((current)=>[...current, secondPoint.current]);
        setGeneratorStep(3);
        break;
      case 3:
        thirdPoint.current.x = mouseCoords.x;
        thirdPoint.current.y = mouseCoords.y;
        startPoint.current.x = firstPoint.current.x;
        startPoint.current.y = firstPoint.current.y;
        // startPoint.current.x = (firstPoint.current.x + secondPoint.current.x + thirdPoint.current.x) / 3;
        // startPoint.current.y = (firstPoint.current.y + secondPoint.current.y + thirdPoint.current.y) / 3;
        setPointList((current)=>[...current, thirdPoint.current]);
        setGeneratorStep(4);
        break;
      case 4:
        break;
    }
  }

  const handlePointsCountChange = (event) => {
    if (event.target.value < 1000) {
    setNewPointsCount(event.target.value);
    }
    else {
      setNewPointsCount(999);
    };
  };

  const getInstruction = () => {
    switch (generatorStep) {
      case 0:
        return "Click start";
      case 1:
        return "Draw the first point";
      case 2:
        return "Draw the second point";
      case 3:
        return "Draw the third point";
      case 4:
        return "Click draw points";
    }
  }

  return (
    <StyledApp onClick={handleGeneratorStart} className={pointList.length>2000?'done':''}>
      <StyledAppTitle>Sierpinski Generator 3000</StyledAppTitle>
      <Draggable bounds="parent">
        <StyledControlPanel>
          <h2>Control Panel</h2>
          <span>{getInstruction()}</span>
          <label for="quantity">New points count:</label>
          <input id="quantity" type="number" min="1" max="999" maxLength="3" value={newPointsCount} onChange={handlePointsCountChange}></input>
          <span>Points : {pointList.length}</span>
          <StyledCPButton color="green" onClick={()=>{setGeneratorStep(1)}}>Start</StyledCPButton>
          <StyledCPButton color="red" onClick={clearGenerator}>Clear</StyledCPButton>
          <StyledCPButton color="yellow" onClick={()=>{setGeneratorStep(1)}}>Start new</StyledCPButton>
          <StyledCPButton color="blue" onClick={drawNewPoints}>Draw points</StyledCPButton>
        </StyledControlPanel>
      </Draggable>
      <StyledDrawingContainer className={generatorStep === 1 || generatorStep === 2 || generatorStep === 3 ? 'drawing' : ''}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height={window.innerHeight - 2}
          width={window.innerWidth }
        >
          {pointList.map((point)=>(
            <circle key={point.id} cx={point.x} cy={point.y} r="1" stroke={colors.pink} fill={colors.pink} strokeWidth="2"/>
          ))}
        </svg>
      </StyledDrawingContainer>
      <StyledAppInstructions>{getInstruction()}</StyledAppInstructions>
    </StyledApp>
  )
}

export default App
