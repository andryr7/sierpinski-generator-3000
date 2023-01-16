import { useRef } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { colors, device } from '../style/stylevars';

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
`;

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
`;

const StyledColorPicker = styled.div`
cursor: pointer;
display: flex;
justify-content: space-between;
width: 100%;
`;

const StyledColorButton = styled.div`
background-color: ${(props) => props.color};
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
`;

function ControlPanel({
  pointsCount,
  pointColor,
  setPointColor,
  setGeneratorStep,
  clearGenerator,
  handleDrawPointsClick,
  newPointsCount,
  handlePointsCountChange,
}) {
  const nodeRef = useRef(null);

  return (
    <Draggable bounds="parent" nodeRef={nodeRef}>
      <StyledControlPanel ref={nodeRef}>
        <h2>Control Panel</h2>
        <span>
          {pointsCount.current}
          {' '}
          points
        </span>
        <label htmlFor="newpointscount">
          New points:
          <input id="newpointscount" type="number" min="1" max="999" maxLength="3" value={newPointsCount} onChange={handlePointsCountChange} />
        </label>
        <StyledColorPicker>
          <StyledColorButton className={pointColor === colors.pink ? 'selected' : ''} color={colors.pink} onClick={() => { setPointColor(colors.pink); }} />
          <StyledColorButton className={pointColor === colors.lightblue ? 'selected' : ''} color={colors.lightblue} onClick={() => { setPointColor(colors.lightblue); }} />
          <StyledColorButton className={pointColor === colors.green ? 'selected' : ''} color={colors.green} onClick={() => { setPointColor(colors.green); }} />
          <StyledColorButton className={pointColor === colors.purple ? 'selected' : ''} color={colors.purple} onClick={() => { setPointColor(colors.purple); }} />
        </StyledColorPicker>
        <StyledCPButton onClick={() => { setGeneratorStep(1); }}>Start new</StyledCPButton>
        <StyledCPButton className={pointsCount.current <= 2 ? 'disabled' : ''} onClick={clearGenerator}>Clear</StyledCPButton>
        <StyledCPButton className={pointsCount.current <= 2 ? 'disabled' : ''} onClick={handleDrawPointsClick}>Draw points</StyledCPButton>
      </StyledControlPanel>
    </Draggable>
  );
}

export default ControlPanel;
