import styled from "styled-components";
import { useEffect, useState, useRef } from 'react';
import SierpinskiBackground from './assets/bggrid.jpg';
import { device, colors } from './style/stylevars';

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
  /* @media ${device.mobile} {
    filter: blur(1rem);
  }; */
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

const StyledColorPicker = styled.div`
  border: 1px outset;
  padding: 1rem;
  cursor: pointer;
  width: 90%;
  text-align: center;
  display: flex;
  justify-content: space-between;
`

const StyledColorButton = styled.div`
  background-color: ${props=>props.color};
  border: 1px outset;
  height: 3rem;
  width: 3rem;
  cursor: pointer;
  &:hover {
    color: ${colors.pink}
  };
`

const StyledDrawingContainer = styled.div`
  cursor: auto;
  &.drawing {
    cursor: crosshair;
  }
`

function App() {
  const [triangles, setTriangles] = useState([]);
  const [generatorStep, setGeneratorStep] = useState(0);
  const [newPointsCount, setNewPointsCount] = useState(25);
  const [pointColor, setPointColor] = useState(colors.pink);
  let pointsCount = useRef(0);
  let lastPoint = useRef({});

  // Point generation functions
  const getRandomPoint = (triangle) => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return (triangle.points.find(point=>point.id===0));
      case 1:
        return (triangle.points.find(point=>point.id===1));
      case 2:
        return (triangle.points.find(point=>point.id===2));
    };
  };

  const drawNewPoints = () => {
    let newPoints = [];
    for (let pas = 0; pas < newPointsCount; pas++) {
      const referencepoint = getRandomPoint(triangles[triangles.length-1]);
      const newPoint = {
        id: lastPoint.current.id + 1,
        x: Math.round((lastPoint.current.x + referencepoint.x)/2*100)/100,
        y: Math.round((lastPoint.current.y + referencepoint.y)/2*100)/100,
      };
      lastPoint.current = newPoint;
      pointsCount.current++;
      newPoints.push(newPoint);
    };
    const updatedTriangle = triangles.pop();
    updatedTriangle.points.push(...newPoints);
    setTriangles(current=>[...current, updatedTriangle]);
  };

  const handleDrawPointsClick = () => {
    generatorStep===4 && drawNewPoints();
  };

  // Generator engine
  const generatorStart = (event) => {
    switch (generatorStep) {
      case 0:
        break;
      case 1:
        const newtriangle = {
          id: 0,
          color: pointColor,
          points: [
            {
              id: 0,
              x: event.clientX,
              y: event.clientY,
            }
          ]
        };
        pointsCount.current++;
        setTriangles(current=>[...current, newtriangle]);
        setGeneratorStep(2);
        break;
      case 2:
        const newtriangle2 = triangles.pop();
        newtriangle2.points.push({
          id: 1,
          x: event.clientX,
          y: event.clientY,
        });
        pointsCount.current++;
        setTriangles(current=>[...current, newtriangle2]);
        setGeneratorStep(3);
        break;
      case 3:
        const newtriangle3 = triangles.pop();
        const newPoint = {
          id: 2,
          x: event.clientX,
          y: event.clientY,
        }
        pointsCount.current++;
        newtriangle3.points.push(newPoint);
        lastPoint.current = newPoint;
        setTriangles(current=>[...current, newtriangle3]);
        setGeneratorStep(4);
        break;
      case 4:
        break;
    }
  };

  const clearGenerator = () => {
    pointsCount.current = 0; 
    setGeneratorStep(0);
    setTriangles([]);
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
  };

  return (
    <>
      {/* <StyledMobileWarning>This website only works on desktop and tablets for now.</StyledMobileWarning> */}
      <StyledApp onClick={generatorStart}>
        <StyledAppTitle>Sierpinski Generator 3000</StyledAppTitle>
        {/* <Draggable bounds="parent"> */}
          <StyledControlPanel>
            <h2>Control Panel</h2>
            <span className="mobile-instructions">{getInstruction()}</span>
            <label htmlFor="quantity">New points count:</label>
            <input id="quantity" type="number" min="1" max="999" maxLength="3" value={newPointsCount} onChange={handlePointsCountChange}></input>
            <span>Points : {pointsCount.current}</span>
            <StyledColorPicker>
              <StyledColorButton color={colors.pink} onClick={()=>{setPointColor(colors.pink)}}/>
              <StyledColorButton color={colors.lightblue} onClick={()=>{setPointColor(colors.lightblue)}}/>
              <StyledColorButton color={colors.green} onClick={()=>{setPointColor(colors.green)}}/>
              <StyledColorButton color={colors.purple} onClick={()=>{setPointColor(colors.purple)}}/>
            </StyledColorPicker>
            <StyledCPButton color="green" onClick={()=>{setGeneratorStep(1)}}>Start</StyledCPButton>
            <StyledCPButton color="red" onClick={clearGenerator}>Clear</StyledCPButton>
            <StyledCPButton color="blue" onClick={handleDrawPointsClick}>Draw points</StyledCPButton>
          </StyledControlPanel>
        {/* </Draggable> */}
        <StyledDrawingContainer className={generatorStep === 1 || generatorStep === 2 || generatorStep === 3 ? 'drawing' : ''}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height={window.innerHeight}
            width={window.innerWidth}
          >
            {triangles.map(triangle=>(
              triangle.points.map(point=>(
                <circle key={point.id} cx={point.x} cy={point.y} r="1" stroke={triangle.color} fill={triangle.color} strokeWidth="2"/>
              ))
            ))}
          </svg>
        </StyledDrawingContainer>
        <StyledAppInstructions>{getInstruction()}</StyledAppInstructions>
      </StyledApp>
    </>
  )
}

export default App