import styled from "styled-components";
import { useState, useRef, useEffect } from 'react';
import SierpinskiBackground from './assets/bggrid.jpg';
import { device, colors } from './style/stylevars';
import Draggable from 'react-draggable';
import addicon from './assets/add.svg';
import deleteicon from './assets/delete.svg';
import magicicon from './assets/magic.svg';
import arrowupicon from './assets/arrowup.svg';
import arrowdownicon from './assets/arrowdown.svg';
import musiconicon from './assets/musicon.svg';
import musicofficon from './assets/musicoff.svg';
import useSound from 'use-sound';

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
  font-size: 2.5rem;
  color: ${colors.lightblue};
  text-align: center;
  z-index: 1;
  @media ${device.mobile} {
    display: none;
  };
`

const StyledMobileAppInstructions = styled.span`
  display: none;
  position: relative;
  bottom: 8rem;
  font-size: 1.5rem;
  color: ${colors.lightblue};
  text-align: center;
  z-index: 1;
  @media ${device.mobile} {
    display: block;
  };
`

const StyledControlPanel = styled.div`
  background-color: ${colors.darkblue};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  position: absolute;
  left: 0;
  border: 1px solid ${colors.lightblue};
  padding: 1rem;
  color: ${colors.lightblue};
  box-sizing: border-box;
  cursor: grab;
  z-index: 2;
  & h2 {
    color: ${colors.pink};
  };
  & input {
    border: inherit;
    width: 6rem;
    font-size: 1.5rem;
    background-color: ${colors.darkblue};
    color: inherit;
  };
  @media ${device.mobile} {
    display: none;
  };
`

const StyledCPButton = styled.div`
  border: 1px outset;
  width: 100%;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  &:hover {
    color: ${colors.pink}
  };
  @media ${device.mobile} {
    padding: 0.25rem;
  };
  &.disabled {
    opacity: 0.5;
    &:hover {
      color: inherit;
    };
    cursor: auto;
  };
`

const StyledColorPicker = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const StyledColorButton = styled.div`
  background-color: ${props=>props.color};
  border: 2px outset;
  height: 2rem;
  width: 2rem;
  cursor: pointer;
  &:hover {
    color: ${colors.pink}
  };
  &.selected {
    border-color: ${colors.pink};
  }
  @media ${device.mobile} {
    height: 3rem;
    width: 3rem;
  };
`

const StyledDrawingContainer = styled.div`
  cursor: auto;
  &.drawing {
    cursor: crosshair;
  }
`

const StyledMobileControlPanel = styled.div`
  display: none;
  position: fixed;
  width: 100%;
  bottom: 0;
  @media ${device.mobile} {
    display: flex;
  };
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background-color: ${colors.darkblue};
  border: 1px solid ${colors.lightblue};
  color: ${colors.lightblue};
  padding: 0.5rem;
`

const StyledMobileActions = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`

const StyledMobileActionButton = styled.div`
  border: 1px solid;
  padding: 0.5rem;
  &.disabled {
    opacity: 0.5;
    cursor: auto;
  };
  cursor: pointer;
`

const StyledMobileExpandedActions = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`

const StyledMusicSettings = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
  @media ${device.mobile} {
    bottom: 6rem;
  };
`

function App() {
  const [triangles, setTriangles] = useState([]);
  const [generatorStep, setGeneratorStep] = useState(0);
  const [newPointsCount, setNewPointsCount] = useState(93);
  const [pointColor, setPointColor] = useState(colors.pink);
  let pointsCount = useRef(0);
  let lastPoint = useRef({});
  const [dimensions, setDimensions] = useState({height: window.innerHeight,width: window.innerWidth});
  const [mobileMenuIsExpanded, setMobileMenuIsExpanded] = useState(false);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [playMusic, { stop }] = useSound("/music.mp3", {
    onend: () => {
      setMusicIsPlaying(false);
    },
  });

  // Listening for screen size changes to re-render page

  useEffect(()=>{
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const handleWindowResize = () => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    })
  };

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

  // Instructions string provider

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
  
  const getMobileInstruction = () => {
    switch (generatorStep) {
      case 0:
        return "Click +";
      case 1:
        return "Draw the first point";
      case 2:
        return "Draw the second point";
      case 3:
        return "Draw the third point";
      case 4:
        return "Click the magic button";
    }
  };

  // Music player handling
  const HandleMusicClick = () => {
    switch (musicIsPlaying) {
      case false:
        setMusicIsPlaying(true);
        playMusic()
        break;
      case true:
        setMusicIsPlaying(false);
        stop()
        break;
    }
  }

  return (
    <>
      <StyledApp onClick={generatorStart}>
        <StyledAppTitle>Sierpinski Generator 3000</StyledAppTitle>
          <Draggable
            bounds='parent'
          >
            <StyledControlPanel>
              <h2>Control Panel</h2>
              <span>{pointsCount.current} points</span>
              <label htmlFor="quantity">New points:</label>
              <input id="quantity" type="number" min="1" max="999" maxLength="3" value={newPointsCount} onChange={handlePointsCountChange}></input>
              <StyledColorPicker>
                <StyledColorButton className={pointColor===colors.pink?'selected':''} color={colors.pink} onClick={()=>{setPointColor(colors.pink)}}/>
                <StyledColorButton className={pointColor===colors.lightblue?'selected':''} color={colors.lightblue} onClick={()=>{setPointColor(colors.lightblue)}}/>
                <StyledColorButton className={pointColor===colors.green?'selected':''} color={colors.green} onClick={()=>{setPointColor(colors.green)}}/>
                <StyledColorButton className={pointColor===colors.purple?'selected':''} color={colors.purple} onClick={()=>{setPointColor(colors.purple)}}/>
              </StyledColorPicker>
              <StyledCPButton onClick={()=>{setGeneratorStep(1)}}>Start new</StyledCPButton>
              <StyledCPButton className={pointsCount.current <= 2 ? 'disabled':''} onClick={clearGenerator}>Clear</StyledCPButton>
              <StyledCPButton className={pointsCount.current <= 2 ? 'disabled':''} onClick={handleDrawPointsClick}>Draw points</StyledCPButton>
            </StyledControlPanel>
          </Draggable>
          <StyledMobileControlPanel>
            {mobileMenuIsExpanded && (
              <>
                <StyledMobileExpandedActions>
                  <input size="4" id="quantity" type="number" min="1" max="999" maxLength="3" value={newPointsCount} onChange={handlePointsCountChange}></input>
                  <StyledColorButton className={pointColor===colors.pink?'selected':''} color={colors.pink} onClick={()=>{setPointColor(colors.pink)}}/>
                  <StyledColorButton className={pointColor===colors.lightblue?'selected':''} color={colors.lightblue} onClick={()=>{setPointColor(colors.lightblue)}}/>
                  <StyledColorButton className={pointColor===colors.green?'selected':''} color={colors.green} onClick={()=>{setPointColor(colors.green)}}/>
                  <StyledColorButton className={pointColor===colors.purple?'selected':''} color={colors.purple} onClick={()=>{setPointColor(colors.purple)}}/>
                
                </StyledMobileExpandedActions>
              </>
            )}
            <StyledMobileActions>
              {!mobileMenuIsExpanded && (<StyledMobileActionButton onClick={()=>{setMobileMenuIsExpanded(true)}}><img src={arrowupicon}/></StyledMobileActionButton>)}
              {mobileMenuIsExpanded && (<StyledMobileActionButton onClick={()=>{setMobileMenuIsExpanded(false)}}><img src={arrowdownicon}/></StyledMobileActionButton>)}
              <StyledMobileActionButton onClick={()=>{setGeneratorStep(1)}}><img src={addicon}/></StyledMobileActionButton>
              <StyledMobileActionButton className={pointsCount.current <= 2 ? 'disabled':''} onClick={clearGenerator}><img src={deleteicon}/></StyledMobileActionButton>
              <StyledMobileActionButton className={pointsCount.current <= 2 ? 'disabled':''} onClick={handleDrawPointsClick}><img src={magicicon}/></StyledMobileActionButton>
            </StyledMobileActions>
          </StyledMobileControlPanel>
        <StyledDrawingContainer className={generatorStep === 1 || generatorStep === 2 || generatorStep === 3 ? 'drawing' : ''}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height={dimensions.height}
            width={dimensions.width}
          >
            {triangles.map(triangle=>(
              triangle.points.map(point=>(
                <circle key={point.id} cx={point.x} cy={point.y} r="1" stroke={triangle.color} fill={triangle.color} strokeWidth="2"/>
              ))
            ))}
          </svg>
        </StyledDrawingContainer>
        <StyledAppInstructions>{getInstruction()}</StyledAppInstructions>
        <StyledMobileAppInstructions>{getMobileInstruction()}</StyledMobileAppInstructions>
        <StyledMusicSettings onClick={HandleMusicClick}><img src={musicIsPlaying ? musiconicon : musicofficon}/></StyledMusicSettings>
      </StyledApp>
    </>
  )
}

export default App