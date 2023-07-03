import { Box, CircularProgress, Typography } from "@material-ui/core"

const LoadingCircle = ({ progress, size=80, textColor = 'grey' }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={progress} size={size}/>
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" component="div" style={{color: textColor}}>{`${progress}%`}</Typography>
      </Box>
    </Box>
  )

}

export default LoadingCircle