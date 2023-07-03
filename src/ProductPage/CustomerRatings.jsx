import { Box, Button, Divider, Grid, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({

}))


const CustomerRatings = (props) => {
  return (
    <Box
      width='25%'
      maxWidth='400px'
      paddingRight='50px'
      boxSizing='border-box'
    // style={{backgroundColor:'yellow'}}
    >
      <Typography variant="h5">Đánh giá</Typography>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='flex-start'
        marginTop={1}
        marginBottom={1}
      >
        <Rating
          name="read-only"
          precision={0.1}
          value={Number(props.stars)}
          readOnly>
        </Rating>
        <Box marginLeft={1} />
        <Typography variant="body1">{props.stars}/5</Typography>
      </Box>
      <Typography variant="body2">{props.votes}&nbsp;đánh giá</Typography>

      <Box marginTop={2} />

      {props.ratings.map((rating, index) => (
        <Grid container alignItems="center" spacing={2} key={index}>
          <Grid item >
            <Typography color="primary" component='div' variant="body2">{5 - index}&nbsp;sao</Typography>
          </Grid>
          <Grid item xs={7}>
            <LinearProgress value={rating} variant="determinate" style={{ height: '20px', borderRadius: '5px' }} />
          </Grid>
          <Grid item >
            <Typography color="primary" component='div' variant="body2">{rating}%</Typography>
          </Grid>
        </Grid>
      ))}

      <Box marginTop={4} marginBottom={3}><Divider /></Box>

      <Typography variant="h6">Đánh giá sản phẩm này</Typography>
      <Box marginTop={0.5} />
      <Typography variant='body2'>Chia sẻ suy nghĩ của bạn với mọi người</Typography>
      <Box marginTop={2} />

      <Button variant="outlined" color="primary" fullWidth >Viết đánh giá</Button>

    </Box>
  )
}

CustomerRatings.defaultProps = {
  stars: '',
  votes: '',
  ratings: []
}

export default CustomerRatings