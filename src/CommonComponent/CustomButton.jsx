import { Button } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';
const COLOR = {
  black: '#000',
  white: '#fff'
}

const BACKGROUND_COLOR = {
  yellow: '#FAD84C',
  orange: '#F3A741'
}

const BORDER_RADIUS = {
  normal: '4px',
  amazon: '8px',
  round: '30px'
}

// export const CustomButton = styled(Button)(({ backgroundColor, color, borderRadius, width, height, paddingX }) => ({
//   backgroundColor: BACKGROUND_COLOR[backgroundColor] || backgroundColor,
//   '&:hover': {
//     backgroundColor: BACKGROUND_COLOR[backgroundColor] || backgroundColor
//   },
//   color: COLOR[color] || color,
//   borderRadius: BORDER_RADIUS[borderRadius] || borderRadius,
//   width: width,
//   height: height,
// }))

export const CustomButton = styled(({ color, backgroundColor, borderRadius, width, height, paddingX, ...other }) => <Button {...other} />)({
  backgroundColor: (props) => BACKGROUND_COLOR[props.backgroundColor] || props.backgroundColor,
  '&:hover': {
    backgroundColor: (props) => BACKGROUND_COLOR[props.backgroundColor] || props.backgroundColor,
  },
  color: (props) => COLOR[props.color] || props.color,
  borderRadius: (props) => BORDER_RADIUS[props.borderRadius] || props.borderRadius,
  height: (props) => props.height,
  width: (props) => props.width
});

export const MyButton = styled(({ color, backgroundColor, borderRadius, width, height, paddingX, ...other }) => <Button {...other} />)({
  background: (props) =>
    props.color === 'red'
      ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: (props) =>
    props.color === 'red'
      ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
      : '0 3px 5px 2px rgba(33, 203, 243, .3)',
  // color: 'white',
  height: 48,
  padding: '0 30px',
  margin: 8,
});





