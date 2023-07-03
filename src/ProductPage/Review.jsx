import { Avatar, Box, Button, Divider, Typography } from "@material-ui/core"
import { Check } from "@material-ui/icons"
import { Rating } from "@material-ui/lab"

const Review = (props) => {
  return (
    <Box
      width='100%'
      marginBottom={4}
    >
      <Box
        display='flex'
        alignItems='center'
      >
        <Avatar src={props.src} />
        <Box marginLeft={2} />
        <Typography>{props.username}</Typography>
      </Box>

      <Box
        display='flex'
        alignItems='center'
        marginY={1}
      >
        <Rating
          name="read-only"
          precision={0.1}
          value={Number(props.stars)}
          readOnly
          size="small">
        </Rating>
        <Box marginLeft={1.5} />
        <Typography component='div' style={{ fontWeight: 600 }}>{props.summary}</Typography>
      </Box>

      <Typography variant="body2" style={{ color: '#575959' }}>Đánh giá ở&nbsp;
        <Typography display="inline" variant="inherit">{props.place}</Typography>
        ,&nbsp;
        <Typography display="inline" variant="inherit">{props.date}</Typography>
      </Typography>
      {props.verified && (
        <Box marginY={1} display='flex'>
          <Typography style={{ fontWeight: 500, color: '#ffa500' }} variant='body2'>Xác thực đã mua hàng</Typography>
          &nbsp;
          <Check fontSize="small" style={{ color: 'orange' }}/>
        </Box>
      )}
      <Typography variant='body1'>{props.details}</Typography>
      <Box marginTop={1}/>
      <Typography variant="body1" style={{ color: '#575959' }}>{props.votes}&nbsp;người đồng ý</Typography>
      <Box display='flex' marginTop={1.5}>
        <Button variant="outlined" size='small' style={{paddingLeft: 30, paddingRight: 30}}> Đồng ý </Button>
        <Divider orientation="vertical" flexItem variant="middle"/>
        <Button style={{ color: '#575959' }} size='small'>Báo cáo lạm dụng</Button>
      </Box>
    </Box>
  )
}

Review.defaultProps = {
  src: '',
  username: 'Tuan',
  stars: '4',
  summary: 'Nice summary',
  place: 'Ha Noi',
  date: '13/4/2018',
  verified: true,
  details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque delectus eligendi porro, eum iste unde nam, veniam ut culpa quas doloribus? Ducimus suscipit sint quod ipsa quis praesentium hic, autem saepe aperiam earum repellat pariatur debitis fugiat reprehenderit magni nemo vero dolore adipisci, quo harum inventore accusantium non fugit placeat. Eos voluptatem quas a? Perspiciatis quaerat optio, beatae nulla aliquam sunt! Delectus sequi accusamus quo sunt modi, voluptatum voluptatibus ipsam nihil nesciunt odit saepe! Cupiditate debitis exercitationem ab dolores sit molestias. Aspernatur perferendis libero distinctio impedit natus, similique nemo! Assumenda amet ex ad inventore laudantium omnis hic voluptas vitae pariatur.',
  votes: '1,100'
}

export default Review