import styled from "styled-components";
import { useEffect, useState, useRef } from 'react';
import SierpinskiBackground from './assets/bggrid.jpg';
import { device, colors } from './style/stylevars';
import { useMousePosition } from './utils/useMousePosition';

const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(${SierpinskiBackground});
  background-size: cover;
  background-position: center;
  background-color: ${colors.darkblue};
  @media ${device.mobile} {
    filter: blur(1rem);
    &::after {
      content:'TEST';
      filter: none;
    }
  };
`

const StyledMobileWarning = styled.div`
  display: none;
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  @media ${device.mobile} {
    display: flex;
    color: ${colors.pink};
    font-size: 2.5rem;
    text-align: center;
  };
`

const StyledAppTitle = styled.h1`
  position: absolute;
  top: 5vh;
  font-size: 7rem;
  font-family: 'Broadway Gradient 3D', sans-serif;
  color: ${colors.lightblue};
  text-align: center;
  @media ${device.tablet} {
    top: 2vh;
    font-size: 4rem;
  };
  @media ${device.mobile} {
    font-size: 3rem;
  };
`

const StyledAppInstructions = styled.span`
  position: absolute;
  bottom: 5vh;
  font-size: 3.5rem;
  color: ${colors.lightblue};
  text-align: center;
  @media ${device.mobile} {
    display: none;
  };
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
  left: 0;
  border: 1px solid ${colors.lightblue};
  padding: 1rem;
  /* cursor: grab; */
  color: ${colors.lightblue};
  box-sizing: border-box;
  & input {
    border: inherit;
    width: 6rem;
    font-size: 1rem;
    background-color: ${colors.darkblue};
    color: inherit;
  };
  & h2 {
    color: ${colors.pink};
    @media ${device.mobile} {
      display: none;
    };
  }
  & span.mobile-instructions {
    display: none;
    @media ${device.tablet} {
    display: block;
    };
  }
  @media ${device.tablet} {
    font-size: 1.5rem;
    padding: 0.5rem;
    gap: 0.5rem;
  };
  @media ${device.mobile} {
    font-size: 1rem;
    flex-direction: row;
    padding: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
    bottom: 0;
  };
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
  };
  @media ${device.mobile} {
    padding: 0.5rem;
  };
`

const StyledDrawingContainer = styled.div`
cursor: auto;
&.drawing {
  cursor: crosshair;
}
`

function App() {
  // Mouse coordinates
  const mouseCoords= useMousePosition();

  // Starting points variables
  const firstPoint = useRef({id: 1, x: 0, y: 0});
  const secondPoint = useRef({id: 2, x: 0, y: 0});
  const thirdPoint = useRef({id: 3, x: 0, y: 0});

  // Generator options and variables
  const [newPointsCount, setNewPointsCount] = useState(25);
  const [generatorStep, setGeneratorStep] = useState(0);

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

  const handleDrawPointsClick = () => {
    generatorStep===4 && drawNewPoints();
  }

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
        setPointList((current)=>[...current, thirdPoint.current]);
        setGeneratorStep(4);
        break;
      case 4:
        break;
    }
  }

  const clearGenerator = () => {
    firstPoint.current = {id: 1, x: 0, y: 0};
    secondPoint.current = {id: 2, x: 0, y: 0};
    thirdPoint.current = {id: 3, x: 0, y: 0};
    setGeneratorStep(0);
    setPointList([]);
  };

  // Points count input control
  const handlePointsCountChange = (event) => {
    if (event.target.value < 1000) {
    setNewPointsCount(event.target.value);
    }
    else {
      setNewPointsCount(999);
    };
  };

  // Instructions
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
        return "Click the draw points button";
    }
  }

  // Listening for screen size changes to reset app data
  // useEffect(()=>{
  //   window.addEventListener('resize', clearGenerator);
  //   return () => {
  //     window.removeEventListener('resize', clearGenerator);
  //   };
  // });

  return (
    <>
      <StyledMobileWarning>This website only works on desktop and tablets for now. Sorry !</StyledMobileWarning>
      <StyledApp onClick={handleGeneratorStart}>
        <StyledAppTitle>Sierpinski Generator 3000</StyledAppTitle>
        {/* <Draggable bounds="parent"> */}
          <StyledControlPanel>
            <h2>Control Panel</h2>
            <span className="mobile-instructions">{getInstruction()}</span>
            <label htmlFor="quantity">New points count:</label>
            <input id="quantity" type="number" min="1" max="999" maxLength="3" value={newPointsCount} onChange={handlePointsCountChange}></input>
            <span>Points : {pointList.length}</span>
            <StyledCPButton color="green" onClick={()=>{setGeneratorStep(1)}}>Start</StyledCPButton>
            <StyledCPButton color="red" onClick={clearGenerator}>Clear</StyledCPButton>
            <StyledCPButton color="yellow" onClick={()=>{setGeneratorStep(1)}}>Start new</StyledCPButton>
            <StyledCPButton color="blue" onClick={handleDrawPointsClick}>Draw points</StyledCPButton>
          </StyledControlPanel>
        {/* </Draggable> */}
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
    </>
  )
}

export default App