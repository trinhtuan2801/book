import { Box, Card, CardActionArea, CardMedia, makeStyles, useTheme } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"


const BookSkeleton = ({ height = '300px', minWidth = 'none', elevation=1 }) => {
  const theme = useTheme()
  return (
    <Card
      style={{
        height: height,
        width: '100%',
        minWidth: minWidth,
        boxSizing: 'border-box',
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5)
      }}
      elevation={elevation}
    >
      <Skeleton variant="rect" animation="wave" height={190} />
      <Box marginTop={1} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width='60%' />

    </Card >
  )
}

export default BookSkeleton