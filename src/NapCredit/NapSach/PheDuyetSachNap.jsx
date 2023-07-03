import { Box, Divider, makeStyles, Typography } from "@material-ui/core";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../CommonComponent/CustomButton";
import MiniCart from "./MiniCart/MiniCart";
import NapSachStepper from "./NapSachStepper";
import PheDuyetItem from "./PheDuyetItem";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  submitButton: {
    width: '200px',
  }
}))

const item = {
  src: 'https://i2-prod.walesonline.co.uk/incoming/article6890072.ece/ALTERNATES/s615b/hp1.jpg',
  title: 'Harry Potter',
  author: 'JK Rowling',
  price: 13.02,
}

const items = new Array(3).fill(item)

const PheDuyetSachNap = (props) => {
  const classes = useStyles()

  const getTotalPrice = () => {
    let result = items.reduce((prev, curr) => {
      const { price } = curr
      return prev + price
    }, 0)
    return result.toFixed(2)
  }

  const navigate = useNavigate()
  const nextStep = (event) => {
    navigate('/chon-van-chuyen')
  }

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
        <NapSachStepper step={2} />
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
              [{props.username}] Phê duyệt
            </Typography>
            <Typography>
              Mã đơn: 1111111AAAAA
            </Typography>
          </Box>

          <Divider />

          <Box>
            {items.map((item, index) => (
              <Fragment key={index}>
                <PheDuyetItem
                  src={item.src}
                  title={item.title}
                  author={item.author}
                  price={item.price}
                >
                </PheDuyetItem>

                {index !== items.length - 1 && <Divider />}
              </Fragment>
            ))}
          </Box>

          <Box
            marginTop={1}
            marginBottom={2}
          >
            <Divider />
          </Box>

          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex'>
              {/* <Button color="primary" variant="contained" className={classes.submitButton} onClick={nextStep}>Tiếp tục</Button> */}
              <CustomButton backgroundColor="yellow" variant="contained" className={classes.submitButton} onClick={nextStep}borderRadius='amazon'>Tiếp tục</CustomButton>
              <Box marginLeft={2} />
              {/* <Button color="default" variant="outlined" className={classes.submitButton}>Huỷ đơn</Button> */}
              <CustomButton backgroundColor="white" variant="contained" className={classes.submitButton} borderRadius='amazon'>Huỷ đơn</CustomButton>
            </Box>

            <Typography component="div" style={{ fontWeight: 500 }}>Tổng ({items.length} sản phẩm): {getTotalPrice()}</Typography>
          </Box>
        </Box>

      </Box>


      {/*Cart */}
      <MiniCart showSubmitButton={false} />
    </Box>
  )
}

PheDuyetSachNap.defaultProps = {
  username: 'Tuan'
}

export default PheDuyetSachNap