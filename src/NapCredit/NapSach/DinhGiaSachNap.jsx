import { Box, Divider, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CustomButton } from "../../CommonComponent/CustomButton";
import { BASE_API } from "../../constants";
import { axiosGet } from "../../ultils/axiosUtils";
import MiniCart from '../NapSach/MiniCart/MiniCart';
import NapSachStepper from "./NapSachStepper";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  submitButton: {
    width: '200px',
  }
}))

const DinhGiaSachNap = (props) => {
  const classes = useStyles()
  let { id } = useParams()
  const navigate = useNavigate()
  const smallLayout = useMediaQuery('(max-width:750px)')

  const getDepositBook = async () => {
    let response = await axiosGet(`${BASE_API}/deposit-carts/${id}`, null, true)
    if (!response) {
      navigate('/')
      return
    }
    if (response.data.status !== 'MONSTERS_PRICING') {
      navigate('/')
      return
    }
  }
  useEffect(() => {
    getDepositBook()
  }, [id])
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
        marginRight={2}
        style={{ backgroundColor: '#00000000' }}
      >

        <NapSachStepper step={1} />
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
            display={smallLayout ? 'block' : 'flex'}
            alignItems='center'
            justifyContent='space-between'
            marginBottom={smallLayout ? 1 : 0}
          >
            <Typography
              variant={smallLayout ? 'h6' : 'h5'}
              style={{ fontWeight: '500' }}
              gutterBottom
            >
              [Maxmin] Định giá hàng nạp
            </Typography>
            <Typography>
              Mã đơn: {id}
            </Typography>
          </Box>

          <Divider />

          <Box
            marginTop={5}
          >
            <Typography variant="h6" style={{ fontWeight: 500 }}>Vui lòng đợi trong quá trình Maxmin đánh giá số credit phù hợp!</Typography>
            <Typography>Hãy nhắc Maxmin nếu quá trình xử lý chậm nha!</Typography>
          </Box>

          <Box
            marginTop={5}
            marginBottom={2}
          >
            <Divider />
          </Box>


          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <CustomButton backgroundColor="white" variant="contained" >Nhắc Maxmin chậm trễ</CustomButton>
          </Box>
        </Box>

      </Box>

      <MiniCart
        showSubmitButton={false}
        isVertical={!smallLayout}
      />
    </Box>
  )
}

DinhGiaSachNap.defaultProps = {
  username: 'Tuan'
}

export default DinhGiaSachNap