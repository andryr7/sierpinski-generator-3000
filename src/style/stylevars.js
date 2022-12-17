// Style vars
export const colors = {
  pink: '#FF61C6',
  lightblue: '#5CECFF',
  darkblue: '#0D023C',
  orange: '#D35B38',
  green: '#2AD1AE',
}

const devicesizes = {
  mobile: '768px',
  tablet: '1280px',
  desktop: '2160px',
}

export const device = {
  mobile: `(max-width: ${devicesizes.mobile})`, 
  tablet: `(max-width: ${devicesizes.tablet})`,
  desktop: `(max-width: ${devicesizes.desktop})`,
};