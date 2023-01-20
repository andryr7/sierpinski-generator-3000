import styled, { keyframes } from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import useSound from 'use-sound';
import SierpinskiBackground from './assets/bggrid.jpg';
import { device, colors } from './style/stylevars';
import musiconicon from './assets/musicon.svg';
import musicofficon from './assets/musicoff.svg';
import ControlPanel from './components/ControlPanel';
import MobileControlPanel from './components/MobileControlPanel';
import Instructions from './components/Instructions';
import backgroundsquare from './assets/backgroundsquare.png';
import NoiseFilter from './components/NoiseFilter';

const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(#05004D, #2D0842, #05004D);
  z-index: 0;
  /* background-image: url(${SierpinskiBackground});
  background-size: cover;
  background-position: center;
  background-color: ${colors.darkblue}; */
`;

const StyledAppTitle = styled.h1`
  position: absolute;
  top: 5vh;
  font-size: 7rem;
  font-family: 'Broadway Gradient 3D', sans-serif;
  color: ${colors.lightblue};
  text-align: center;
  z-index: 2;
  @media ${device.tablet} {
    top: 2vh;
    font-size: 4rem;
  };
  @media ${device.mobile} {
    font-size: 3rem;
  };
`;

const StyledDrawingContainer = styled.div`
  cursor: auto;
  z-index: 1;
  &.drawing {
    cursor: crosshair;
  }
`;

const StyledMusicSettings = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
  z-index: 2;
  @media ${device.mobile} {
    top: 0;
    bottom: auto;
    right: 0;
  };
`;

const baserotation = keyframes`
  0% {
    transform: translateY(23%) rotateX(80deg) rotateZ(0deg);
  }
  100% {
    transform: translateY(23%) rotateX(80deg) rotateZ(360deg);
  }
`;

const BottomBackground = styled.div`
  width: 200vh;
  height: 200vh;
  position: fixed;
  background-image: url(${backgroundsquare});
  background-size: 7% 7%;
  background-repeat: repeat;
  animation: ${baserotation} 60s linear infinite;
  border-radius: 50%;
  opacity: 0.75;
`;

function App() {
  const [triangles, setTriangles] = useState([]);
  const [generatorStep, setGeneratorStep] = useState(0);
  const [newPointsCount, setNewPointsCount] = useState(93);
  const [pointColor, setPointColor] = useState(colors.pink);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [mobileMenuIsExpanded, setMobileMenuIsExpanded] = useState(false);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const pointsCount = useRef(0);
  const lastPoint = useRef({});
  const [playMusic, { stop }] = useSound('/music.mp3', {
    onend: () => {
      setMusicIsPlaying(false);
    },
  });

  function handleWindowResize() {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  // Listening for screen size changes to re-render page
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  // Point generation functions
  const getRandomPoint = (triangle) => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return (triangle.points.find((point) => point.id === 0));
      case 1:
        return (triangle.points.find((point) => point.id === 1));
      default:
        return (triangle.points.find((point) => point.id === 2));
    }
  };

  const drawNewPoints = () => {
    const newPoints = [];
    for (let i = 0; i < newPointsCount; i += 1) {
      const referencepoint = getRandomPoint(triangles[triangles.length - 1]);
      const newPoint = {
        id: lastPoint.current.id + 1,
        x: Math.round((lastPoint.current.x + referencepoint.x) / 2 * 100) / 100,
        y: Math.round((lastPoint.current.y + referencepoint.y) / 2 * 100) / 100,
      };
      lastPoint.current = newPoint;
      pointsCount.current += 1;
      newPoints.push(newPoint);
    }
    const updatedTriangle = triangles.pop();
    updatedTriangle.points.push(...newPoints);
    setTriangles((current) => [...current, updatedTriangle]);
  };

  const handleDrawPointsClick = () => {
    if (generatorStep === 4) {
      drawNewPoints();
    }
  };

  // Generator engine
  const generatorStart = (event) => {
    if (generatorStep === 1) {
      const newtriangle = {
        id: 0,
        color: pointColor,
        points: [
          {
            id: 0,
            x: event.clientX,
            y: event.clientY,
          },
        ],
      };
      pointsCount.current += 1;
      setTriangles((current) => [...current, newtriangle]);
      setGeneratorStep(2);
    } else if (generatorStep === 2) {
      const newtriangle2 = triangles.pop();
      newtriangle2.points.push({
        id: 1,
        x: event.clientX,
        y: event.clientY,
      });
      pointsCount.current += 1;
      setTriangles((current) => [...current, newtriangle2]);
      setGeneratorStep(3);
    } else if (generatorStep === 3) {
      const newtriangle3 = triangles.pop();
      const newPoint = {
        id: 2,
        x: event.clientX,
        y: event.clientY,
      };
      pointsCount.current += 1;
      newtriangle3.points.push(newPoint);
      lastPoint.current = newPoint;
      setTriangles((current) => [...current, newtriangle3]);
      setGeneratorStep(4);
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
    } else {
      setNewPointsCount(999);
    }
  };

  // Music player handling
  const HandleMusicClick = () => {
    switch (musicIsPlaying) {
      case true:
        setMusicIsPlaying(false);
        stop();
        break;
      default:
        setMusicIsPlaying(true);
        playMusic();
        break;
    }
  };

  return (
    <StyledApp onClick={generatorStart}>
      <NoiseFilter />
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
      <BottomBackground className="TEST" />
      <StyledDrawingContainer className={generatorStep === 1 || generatorStep === 2 || generatorStep === 3 ? 'drawing' : ''}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={dimensions.height}
          width={dimensions.width}
        >
          {triangles.map((triangle) => (
            triangle.points.map((point) => (
              <circle key={point.id} cx={point.x} cy={point.y} r="1" stroke={triangle.color} fill={triangle.color} strokeWidth="2" />
            ))
          ))}
        </svg>
      </StyledDrawingContainer>
      <Instructions generatorStep={generatorStep} />
      <StyledMusicSettings onClick={HandleMusicClick}>
        <img alt="music button icon" src={musicIsPlaying ? musiconicon : musicofficon} />
      </StyledMusicSettings>
    </StyledApp>
  );
}

export default App;
