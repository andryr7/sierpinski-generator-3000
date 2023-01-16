import styled from 'styled-components';
import { colors, device } from '../style/stylevars';

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
`;

const StyledMobileAppInstructions = styled.span`
  display: none;
  position: fixed;
  bottom: 9rem;
  font-size: 1.5rem;
  color: ${colors.lightblue};
  text-align: center;
  z-index: 1;
  @media ${device.mobile} {
    display: block;
  };
`;

export default function Instructions({ generatorStep }) {
  // Instructions string provider
  const getInstruction = () => {
    switch (generatorStep) {
      case 1:
        return 'Draw the first point';
      case 2:
        return 'Draw the second point';
      case 3:
        return 'Draw the third point';
      case 4:
        return 'Click the draw points button';
      default:
        return 'Click start';
    }
  };

  const getMobileInstruction = () => {
    switch (generatorStep) {
      case 1:
        return 'Draw the first point';
      case 2:
        return 'Draw the second point';
      case 3:
        return 'Draw the third point';
      case 4:
        return 'Click the magic button';
      default:
        return 'Click +';
    }
  };

  return (
    <>
      <StyledAppInstructions>{getInstruction()}</StyledAppInstructions>
      <StyledMobileAppInstructions>{getMobileInstruction()}</StyledMobileAppInstructions>
    </>
  );
}
