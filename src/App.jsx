import styled from "styled-components";
import { useEffect, useState } from 'react';
import { useStateWithCallback } from "./useStateWithCallback";

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: navy;
`

const StyledSTContainer = styled.div`
  width: 550px;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  flex-direction: column;
`

const SerpinskiTriangle = () => {
  const [firstPoint, setFirstPoint] = useState({id: 1, x: 250, y: 0});
  const [secondPoint, setDecondPoint] = useState({id: 2, x: 500, y: 500});
  const [thirdPoint, setThirdPoint] = useState({id: 3, x: 0, y: 500});
  const [startPoint, setStartPoint] = useState({id: 4, x: 300, y:300});
  const [pointList, setPointList] = useState([
    firstPoint, secondPoint, thirdPoint, startPoint
  ]);

  const getRandomPoint = () => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return (firstPoint);
      case 1:
        return (secondPoint);
      case 2:
        return (thirdPoint);
    };
  };

  const handleNewPointClick = () => {
    drawNewPoint();
  };

  const drawNewPoint = () => {
    const referencepoint = getRandomPoint();
    const lastPoint = pointList[pointList.length-1];
    const newPoint = {
      id: lastPoint.id + 1,
      x: Math.round((lastPoint.x + referencepoint.x)/2*100)/100,
      y: Math.round((lastPoint.y + referencepoint.y)/2*100)/100,
    };
    setPointList((current)=>[...current, newPoint]);
  };

  return(
    <>
      <button onClick={()=>{handleNewPointClick()}}>Draw new point</button>
      <button >Stop drawing points</button>
      <span>{pointList.length}</span>
      <svg 
      xmlns="http://www.w3.org/2000/svg" 
      height="500"
      width="500"
      >
        {pointList.map((point)=>(
          <circle key={point.id} cx={point.x} cy={point.y} r="1" stroke="black" fill="black" strokeWidth="2"/>
        ))}
      </svg>
    </>
  ) 
}


function App() {
  return (
    <StyledApp>
      <StyledSTContainer>
        <SerpinskiTriangle/>
      </StyledSTContainer>
    </StyledApp>
  )
}

export default App
