import { Box, Divider, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddressPopup from "../../CommonComponent/AddressPopup";
import { CustomButton } from "../../CommonComponent/CustomButton";
import { BASE_API } from "../../constants";
import { axiosGet } from "../../ultils/axiosUtils";
import { numberWithCommas, phoneNumberWithSpace } from "../../ultils/NumberUtils";
import NapSachStepper from "./NapSachStepper";
import { useSnackbar } from "notistack";
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

const DangVanChuyen = () => {
  const classes = useStyles()
  // const { state } = useLocation()
  const navigate = useNavigate()
  const smallLayout = useMediaQuery('(max-width:850px)')

  const { id } = useParams()

  const [cartInfo, setCartInfo] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [openAddress, setOpenAddress] = useState(false)

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {

    const getUserInfo = async () => {
      let response = await axiosGet(`${BASE_API}/users`, null, true)
      if (!response) return
      setUserInfo(response.data)
    }

    getUserInfo()

    const getDepositCartInfo = async () => {
      let response = await axiosGet(`${BASE_API}/deposit-carts/${id}`, null, true)
      if (!response) {
        navigate('/')
        return
      }
      if (response.data.status !== 'SHIPPING') {
        navigate('/')
        return
      }
      const cart_info = response.data
      setCartInfo(cart_info)
      console.log(cart_info)
      if (cart_info.ship_method === 'BY_MONSTERS')
        enqueueSnackbar(<b>Bạn cần ghi mã đơn ở dưới lên kiện hàng</b>, { variant: 'warning', autoHideDuration: 5000 })

    }

    getDepositCartInfo()

  }, [])

  let ship_total = cartInfo?.ship_cost - cartInfo?.ship_pcode_value
  let subtotal = cartInfo?.subtotal
  let total = subtotal - ship_total

  return (
    <>
      {cartInfo && userInfo &&
        <Box
          className={classes.root}
          width='100%'
          height='fit-content'
          boxSizing='border-box'
          paddingTop={8}
          display='flex'
          paddingBottom={2}
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
            {!smallLayout &&
              <>
                <NapSachStepper step={3} />
                <Box marginTop={2} />
              </>
            }


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
              >
                <Typography
                  variant={smallLayout ? 'h6' : 'h5'}
                  style={{ fontWeight: '500' }}
                  gutterBottom
                >
                  <span style={{ color: 'purple' }}>
                    {cartInfo.ship_method === 'BY_MONSTERS' ? '[Maxmin] ' : `[${userInfo.name}] `}
                  </span>
                  {cartInfo.ship_method === 'BY_MONSTERS' ? 'Đang đến địa chỉ của bạn' : 'Maxmin đang chờ bạn'}
                </Typography>
                {/* <Typography>
                  Mã đơn: {cartInfo._id}
                </Typography> */}
                {/* <Typography component='div' style={{textAlign: 'end'}}>
                  Giá trị đơn hàng nạp sách:
                  <b> {numberWithCommas(subtotal)}đ</b>
                  &nbsp;
                  {smallLayout && <br />}
                  - Vận chuyển:
                  <b>
                    &nbsp;{numberWithCommas(ship_total)}đ
                    {smallLayout && <br />}
                    =&nbsp;
                    <Typography variant="h6" display='inline' style={{ color: 'orange' }}>
                      {numberWithCommas(total)}đ
                    </Typography>
                  </b>
                </Typography> */}
              </Box>

              <Divider />

              <Box
                display='flex'
                marginTop={3}
                boxSizing='border-box'
                paddingLeft={smallLayout ? 0 : 5}
                flexDirection={smallLayout ? 'column' : 'row'}
                alignItems={smallLayout ? 'center' : 'none'}
              >
                <img src='https://cdn-icons-png.flaticon.com/512/237/237383.png' alt="shipping-truck" className={classes.image} />
                <Box marginLeft={4} />
                <Box
                  width='100%'
                  marginTop={smallLayout ? 5 : 0}
                  display='flex'
                  flexDirection='column'
                  justifyContent={smallLayout ? 'center' : 'flex-start'}
                  alignItems={smallLayout ? 'center' : 'flex-start'}
                >
                  {cartInfo.ship_method === 'BY_MONSTERS' ? (
                    <Typography
                      variant="h6"
                      style={{ textAlign: smallLayout ? 'center' : 'left' }}
                    >Vui lòng đóng gói bảo quản hàng hóa và sẵn sàng giao cho nhân viên vận chuyển tại địa chỉ đã chọn</Typography>
                  ) : (
                    <Typography variant="h6"
                      style={{ textAlign: smallLayout ? 'center' : 'left' }}
                    >Vui lòng vận chuyển tới cơ sở Maxmin, chú ý bảo quản sách</Typography>
                  )}
                  {cartInfo.ship_method === 'BY_MONSTERS' &&
                    <>
                      <Typography
                        style={{ textAlign: smallLayout ? 'center' : 'left', fontWeight: 'bold' }}
                        color='primary'
                      >
                        Mã vận đơn: {cartInfo.bship_code}
                      </Typography>
                      <Typography
                        style={{ textAlign: smallLayout ? 'center' : 'left', fontWeight: 'bold' }}
                        color='secondary'
                      >
                        ( Bạn cần ghi mã này lên kiện hàng )
                      </Typography>
                    </>
                  }

                  <Box marginTop={1} />
                  {cartInfo.ship_method === 'BY_MONSTERS' ?
                    <Typography>
                      {userInfo.name}
                      <br />
                      {cartInfo.address.street}
                      <br />
                      {cartInfo.address.ward}, {cartInfo.address.district}, {cartInfo.address.province}
                      <br />
                      Số điện thoại:&nbsp;<span style={{ fontWeight: 500 }}>{phoneNumberWithSpace(cartInfo.address.mobile)}</span>
                    </Typography>
                    :
                    <>
                      <CustomButton
                        onClick={() => setOpenAddress(true)}
                        variant='contained'
                        backgroundColor='white'
                        style={{ maxWidth: '300px' }}
                        fullWidth
                      >
                        Danh sách địa chỉ {'>'}
                      </CustomButton>
                      <AddressPopup open={openAddress} onClose={() => setOpenAddress(false)} />
                    </>

                  }

                  <Box marginTop={2} />
                  <CustomButton
                    onClick={() => { navigate('/') }}
                    backgroundColor='yellow'
                    variant='contained'
                    style={{ maxWidth: '300px' }}
                    fullWidth
                  >
                    Trở về trang chủ
                  </CustomButton>

                </Box>
              </Box>

              <Box marginTop={1.5} />

            </Box>
          </Box>
        </Box>
      }
    </>
  )
}

export default DangVanChuyen