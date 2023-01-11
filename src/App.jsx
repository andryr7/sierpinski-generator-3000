import styled from "styled-components";
import { useState, useRef, useEffect } from 'react';
import SierpinskiBackground from './assets/bggrid.jpg';
import { device, colors } from './style/stylevars';
import musiconicon from './assets/musicon.svg';
import musicofficon from './assets/musicoff.svg';
import useSound from 'use-sound';
import ControlPanel from './components/ControlPanel';
import MobileControlPanel from './components/MobileControlPanel';
import Instructions from "./components/Instructions";

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

const StyledDrawingContainer = styled.div`
  cursor: auto;
  &.drawing {
    cursor: crosshair;
  }
`

const StyledMusicSettings = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
  @media ${device.mobile} {
    top: 0;
    bottom: auto;
    right: 0;
  };
`

function App() {
  const [triangles, setTriangles] = useState([]);
  const [generatorStep, setGeneratorStep] = useState(0);
  const [newPointsCount, setNewPointsCount] = useState(93);
  const [pointColor, setPointColor] = useState(colors.pink);
  const [dimensions, setDimensions] = useState({height: window.innerHeight,width: window.innerWidth});
  const [mobileMenuIsExpanded, setMobileMenuIsExpanded] = useState(false);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  let pointsCount = useRef(0);
  let lastPoint = useRef({});
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
          <ControlPanel
            pointsCount={pointsCount}
            setNewPointsCount={setNewPointsCount} 
            pointColor={pointColor} 
            setPointColor={setPointColor} 
            setGeneratorStep={setGeneratorStep} 
            clearGenerator={clearGenerator} 
            handleDrawPointsClick={handleDrawPointsClick} 
            newPointsCount={newPointsCount} 
            handlePointsCountChange={handlePointsCountChange}
          />
          <MobileControlPanel 
            pointsCount={pointsCount}
            setNewPointsCount={setNewPointsCount}
            mobileMenuIsExpanded={mobileMenuIsExpanded}
            setMobileMenuIsExpanded={setMobileMenuIsExpanded}
            setGeneratorStep={setGeneratorStep}
            clearGenerator={clearGenerator}
            newPointsCount={newPointsCount}
            handleDrawPointsClick={handleDrawPointsClick}
            handlePointsCountChange={handlePointsCountChange}
            pointColor={pointColor}
            setPointColor={setPointColor}
          />
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
        <Instructions generatorStep={generatorStep}/>
        <StyledMusicSettings onClick={HandleMusicClick}><img src={musicIsPlaying ? musiconicon : musicofficon}/></StyledMusicSettings>
      </StyledApp>
    </>
  )
}

export default App