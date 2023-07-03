import { Box, makeStyles, Typography, Divider, ButtonGroup, Button } from "@material-ui/core";
import { numberWithCommas, phoneNumberWithSpace } from "../../ultils/NumberUtils";
import NapSachStepper from "./NapSachStepper";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  submitButton: {
    width: '200px',
  },
  image: {
    width: 'auto',
    height: '200px',
    objectFit: 'cover',
  }
}))

const VanChuyenXong = (props) => {
  const classes = useStyles()

  return (
    <Box
      className={classes.root}
      width='100%'
      height='fit-content'
      boxSizing='border-box'
      paddingTop={8}
      display='flex'
    >
      <Box
        width='100%'
        height='fit-content'
        boxSizing='border-box'
        marginLeft={2}
        marginTop={2}
        marginRight={3}
        style={{ backgroundColor: '#00000000' }}
      >
        <NapSachStepper step={5} />
        <Box marginTop={2} />
        {/*Main area */}
        <Box
          width='100%'
          height='fit-content'
          padding={3}
          boxSizing='border-box'
          style={{ backgroundColor: '#fff' }}
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography
              variant="h5"
              style={{ fontWeight: '500' }}
              gutterBottom
            >
              Kết thúc
            </Typography>
            <Typography>
              Mã đơn: 1111111AAAAA
            </Typography>
          </Box>

          <Divider />

          <Box
            display='flex'
            marginTop={3}
            boxSizing='border-box'
            paddingLeft={5}
          >
            <img src='https://cdn.shopify.com/s/files/1/0444/6109/7128/files/21A75853-22AA-4D9F-B08F-2F4EFB5D6188.png?v=1637493293' alt="shipping-truck" className={classes.image} />
            <Box marginLeft={4} />
            <Box
              width='60%'
              display='flex'
              flexDirection='column'
              justifyContent='center'
            >
              <Typography variant="h6">Đơn hàng đã hoàn thành</Typography>
              <Box marginTop={1} />
              <Typography component='div'>Credit bổ sung: <Typography display="inline" style={{ color: 'green' }}>+{props.creditBoSung}</Typography></Typography>
              <Typography component='div'>Credit treo: <Typography display="inline" style={{ color: 'orange' }}>+{props.creditTreo}</Typography></Typography>
              <Box marginTop={1} />
              <ButtonGroup variant='outlined' color='primary'>
                <Button>Biến động số dư</Button>
                <Button>Mua hàng thôi nào</Button>
              </ButtonGroup>
            </Box>

          </Box>



          <Box
            marginTop={5}
            marginBottom={2}
          >
            <Divider />
          </Box>



        </Box>
      </Box>

    </Box >
  )
}

VanChuyenXong.defaultProps = {
  creditBoSung: 10,
  creditTreo: 5
}

export default VanChuyenXong