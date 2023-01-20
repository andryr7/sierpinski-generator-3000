import styled, { keyframes } from 'styled-components';
import darknoise from '../assets/darknoise.png';

const noiseanimation = keyframes`
  0%,to{transform:translate(0)}
  10%{transform:translate(-7%,-11%)}
  20%{transform:translate(-14%,6%)}
  30%{transform:translate(8%,-24%)}
  40%{transform:translate(-6%,22%)}
  50%{transform:translate(-14%,11%)}
  60%{transform:translate(13%)}
  70%{transform:translateY(16%)}
  80%{transform:translate(4%,32%)}
  90%{transform:translate(-11%,9%)}
`;

const StyledNoiseFilter = styled.div`
  position: fixed;
  z-index: 3;
  top: -300%;
  left: -150%;
  height: 600%;
  width: 600%;
  animation: ${noiseanimation} 7s steps(10) infinite;
  background-image: url(${darknoise});
  image-rendering: pixelated;
  background-size: 400px;
  background-repeat: repeat;
  opacity: .2;
  pointer-events: none;
`;

export default function NoiseFilter() {
  return (
    <StyledNoiseFilter />
  );
}
