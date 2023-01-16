import styled from 'styled-components';
import { colors, device } from '../style/stylevars';
import addicon from '../assets/add.svg';
import deleteicon from '../assets/delete.svg';
import magicicon from '../assets/magic.svg';
import arrowupicon from '../assets/arrowup.svg';
import arrowdownicon from '../assets/arrowdown.svg';

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
`;

const StyledMobileActions = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const StyledMobileActionButton = styled.div`
  border: 1px solid;
  padding: 0.5rem;
  &.disabled {
    opacity: 0.5;
    cursor: auto;
    &:active {
      border-color: inherit;
    }
  };
  &:active {
    border-color: ${colors.pink};
  }
  cursor: pointer;
`;

const StyledMobileExpandedActions = styled.div`
  display: flex;
  justify-content: space-around;
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

export default function MobileControlPanel({
  pointsCount,
  pointColor,
  setPointColor,
  setGeneratorStep,
  clearGenerator,
  handleDrawPointsClick,
  newPointsCount,
  handlePointsCountChange,
  setMobileMenuIsExpanded,
  mobileMenuIsExpanded,
}) {
  return (
    <StyledMobileControlPanel>
      {mobileMenuIsExpanded && (
        <StyledMobileExpandedActions>
          <input size="4" id="quantity" type="number" min="1" max="999" maxLength="3" value={newPointsCount} onChange={handlePointsCountChange} />
          <StyledColorButton className={pointColor === colors.pink ? 'selected' : ''} color={colors.pink} onClick={() => { setPointColor(colors.pink); }} />
          <StyledColorButton className={pointColor === colors.lightblue ? 'selected' : ''} color={colors.lightblue} onClick={() => { setPointColor(colors.lightblue); }} />
          <StyledColorButton className={pointColor === colors.green ? 'selected' : ''} color={colors.green} onClick={() => { setPointColor(colors.green); }} />
          <StyledColorButton className={pointColor === colors.purple ? 'selected' : ''} color={colors.purple} onClick={() => { setPointColor(colors.purple); }} />

        </StyledMobileExpandedActions>
      )}
      <StyledMobileActions>
        {!mobileMenuIsExpanded && (
          <StyledMobileActionButton onClick={() => { setMobileMenuIsExpanded(true); }}>
            <img alt="open menu icon" src={arrowupicon} />
          </StyledMobileActionButton>
        )}
        {mobileMenuIsExpanded && (
          <StyledMobileActionButton onClick={() => { setMobileMenuIsExpanded(false); }}>
            <img alt="close menu icon" src={arrowdownicon} />
          </StyledMobileActionButton>
        )}
        <StyledMobileActionButton onClick={() => { setGeneratorStep(1); }}>
          <img alt="add triangle icon" src={addicon} />
        </StyledMobileActionButton>
        <StyledMobileActionButton className={pointsCount.current <= 2 ? 'disabled' : ''} onClick={clearGenerator}>
          <img alt="clear generator icon" src={deleteicon} />
        </StyledMobileActionButton>
        <StyledMobileActionButton className={pointsCount.current <= 2 ? 'disabled' : ''} onClick={handleDrawPointsClick}>
          <img alt="create points icon" src={magicicon} />
        </StyledMobileActionButton>
      </StyledMobileActions>
    </StyledMobileControlPanel>
  );
}
