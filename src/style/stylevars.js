// Style vars
export const colors = {
  pink: '#FF61C6',
  lightblue: '#5CECFF',
  darkblue: '#0D023C',
  purple: '#B967FF',
  green: '#05FFA1',
};

const devicesizes = {
  mobile: '768px',
  tablet: '1280px',
  desktop: '2160px',
};

export const device = {
  mobile: `(max-width: ${devicesizes.mobile})`, 
  tablet: `(max-width: ${devicesizes.tablet})`,
  desktop: `(max-width: ${devicesizes.desktop})`,
};