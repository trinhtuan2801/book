import { Box, makeStyles, Typography, Divider, useMediaQuery } from "@material-ui/core";
import { CardGiftcard, CheckCircle, CreditCard, KeyboardArrowRight, LocalShipping, NotInterested } from "@material-ui/icons";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomButton } from "../CommonComponent/CustomButton";
import { BASE_API } from "../constants";
import { refreshNavbar } from "../redux/rootReducer";
import { axiosGet, axiosPatch } from "../ultils/axiosUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import ThanhToanStepper from "./ThanhToanStepper";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },

}))


const ThanhToan = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  const user_address = useRef(null)

  const [cartInfo, setCartInfo] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const dispatch = useDispatch()
  let [searchParams] = useSearchParams()
  let procedure = searchParams.get('procedure')
  let id = searchParams.get('id')
  const smallLayout = useMediaQuery('(max-width:700px)')

  useEffect(() => {

    if (!['buy'].includes(procedure)) {
      navigate('/')
      return
    }

    const getCartInfo = async () => {
      let response = await axiosGet(`${BASE_API}/carts/${id}`, null, true)
      if (!response) {
        navigate('/')
        return
      }
      if (response.data.status.toLowerCase() !== 'active' || !response.data.address) {
        navigate('/')
        return
      }
      setCartInfo(response.data)
      console.log(response.data)
      user_address.current = response.data.address
    }
    const getUserInfo = async () => {
      let response = await axiosGet(`${BASE_API}/users`, null, true)
      if (!response) return
      setUserInfo(response.data)
    }
    getCartInfo()
    getUserInfo()
  }, [])

  const placeOrder = async () => {
    // await axiosPatch(`${BASE_API}/carts/${cartInfo._id}`, {
    //   "field_name": "address",
    //   "value": user_address.current
    // }, true)

    let total = cartInfo.subtotal + cartInfo.ship_cost
    let payment_method = (userInfo.credit >= total) ? 'CREDIT' : 'AT_DELIVERY'
    await axiosPatch(`${BASE_API}/carts/${cartInfo._id}`, {
      "field_name": "payment_method",
      "value": payment_method
    }, true)

    let response = await axiosPatch(`${BASE_API}/carts/${cartInfo._id}`, {
      "field_name": "status",
      "value": "ORDERED"
    }, true)
    if (!response || response.code !== 200) {
      return
    }
    dispatch(refreshNavbar())

    navigate('/confirm?from=thanh-toan')
  }

  const goToPage = (name) => {
    navigate(`/${name}`)
  }

  const [payLater, setPayLater] = useState(false)

  const clickPayLater = () => {
    setPayLater(prev => !prev)
  }

  return (
    <>
      {userInfo && cartInfo &&
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
            <ThanhToanStepper step={2} />
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
              >
                <Typography
                  variant={smallLayout ? 'h6' : 'h5'}
                  style={{ fontWeight: '500' }}
                  gutterBottom
                >
                  Thanh toán
                </Typography>
                <Typography component='div'>
                  Giá trị giỏ hàng:
                  <b> {numberWithCommas(cartInfo.subtotal)}đ</b>
                  &nbsp;
                  {smallLayout && <br />}
                  + Vận chuyển:
                  {!!cartInfo.ship_cost ?
                    <b>
                      &nbsp;{numberWithCommas(cartInfo.ship_cost)}đ
                      {smallLayout && <br />}
                      =&nbsp;
                      <Typography variant="h6" display='inline' style={{ color: 'orange' }}>
                        {numberWithCommas(cartInfo.subtotal + cartInfo.ship_cost)}đ
                      </Typography>
                    </b>
                    :
                    <>
                      <b> 0đ </b> = <Typography variant="h6" display='inline' style={{ color: 'orange' }}>
                        {numberWithCommas(cartInfo.subtotal)}đ
                      </Typography>
                    </>
                  }
                </Typography>
              </Box>

              <Divider />
              <Box marginTop={2} />

              <Box>

                {(userInfo.credit >= cartInfo.subtotal + cartInfo.ship_cost) ?
                  <Box
                    display='flex'
                  >
                    {/* <CheckCircle style={{ color: 'green', height: '100px', width: '100px' }} fontSize="large" /> */}
                    <Box display='flex' flexDirection='column' justifyContent='center'>
                      <Typography variant="h6" style={{ fontWeight: 400 }}>Thanh toán bằng số dư credit</Typography>
                      <Typography >( Hiện có <b style={{color: 'orange'}}>{numberWithCommas(userInfo.credit)}đ</b> )</Typography>
                    </Box>
                  </Box>
                  :
                  <Box
                    display='flex'
                  >
                    <NotInterested style={{ color: 'red', height: '100px', width: '100px' }} fontSize="large" />
                    <Box display='flex' flexDirection='column' justifyContent='center' paddingLeft={3}>
                      <Typography variant="h6" style={{ fontWeight: 400 }}>Số dư credit không đủ</Typography>
                      <Typography >( Hiện có <b>{numberWithCommas(userInfo.credit)}đ</b> )</Typography>
                      <Box marginTop={2} />
                      {!smallLayout &&
                        <Box>
                          <Typography><b>Cách 1:</b> Nạp thêm credit</Typography>
                          <Box marginTop={1} />
                          <Box paddingLeft={2} display='flex'>
                            <CustomButton
                              startIcon={<CreditCard />}
                              endIcon={<KeyboardArrowRight />}
                              // variant='text'
                              onClick={() => { goToPage('nap-credit-bank') }}
                              variant='contained'
                              backgroundColor='white'
                            >
                              bằng thẻ ngân hàng
                            </CustomButton>
                            <Box marginLeft={2} />
                            <CustomButton
                              startIcon={<CardGiftcard />}
                              endIcon={<KeyboardArrowRight />}
                              // variant='text'
                              onClick={() => { goToPage('nap-credit-gift') }}
                              variant='contained'
                              backgroundColor='white'
                            >
                              bằng thẻ quà tặng
                            </CustomButton>
                          </Box>
                          <Box marginTop={1} />
                          <Typography><b>Cách 2:</b></Typography>
                          <Box marginTop={1} />
                          <Box paddingLeft={2} display='flex' alignItems='center'>
                            <CustomButton
                              startIcon={<LocalShipping />}
                              // variant='text'
                              style={{ color: payLater ? 'green' : '#212121' }}
                              onClick={clickPayLater}
                              variant='contained'
                              backgroundColor='white'
                            >
                              Thanh toán khi nhận hàng
                            </CustomButton>
                            <Box marginLeft={1} />
                            {payLater && <CheckCircle style={{ color: 'green' }} />}
                          </Box>

                        </Box>
                      }

                    </Box>
                  </Box>
                }

                {smallLayout && userInfo.credit < cartInfo.subtotal + cartInfo.ship_cost &&
                  <Box>
                    <Typography><b>Cách 1:</b> Nạp thêm credit</Typography>
                    <Box marginTop={1} />
                    <Box display='flex'>
                      <CustomButton
                        startIcon={<CreditCard />}
                        endIcon={<KeyboardArrowRight />}
                        // variant='text'
                        onClick={() => { goToPage('nap-credit-bank') }}
                        variant='contained'
                        backgroundColor='white'
                      >
                        bằng thẻ ngân hàng
                      </CustomButton>
                      <Box marginLeft={2} />
                      <CustomButton
                        startIcon={<CardGiftcard />}
                        endIcon={<KeyboardArrowRight />}
                        // variant='text'
                        onClick={() => { goToPage('nap-credit-gift') }}
                        variant='contained'
                        backgroundColor='white'
                      >
                        bằng thẻ quà tặng
                      </CustomButton>
                    </Box>
                    <Box marginTop={1} />
                    <Typography><b>Cách 2:</b></Typography>
                    <Box marginTop={1} />
                    <Box display='flex' alignItems='center'>
                      <CustomButton
                        startIcon={<LocalShipping />}
                        // variant='text'
                        onClick={clickPayLater}
                        variant='contained'
                        backgroundColor='white'
                        style={{
                          color: payLater ? 'green' : '#212121',
                          width: '100%',
                          maxWidth: '300px'
                        }}
                      >
                        Thanh toán khi nhận hàng
                      </CustomButton>
                      {payLater &&
                        <>
                          <Box marginLeft={1} />
                          <CheckCircle style={{ color: 'green' }} />
                        </>
                      }
                    </Box>

                  </Box>
                }

                <Box marginY={2}>
                  <Divider />
                </Box>

                <Box>
                  {/* <Button variant="contained" color="primary" onClick={placeOrder}>Hoàn thành đặt hàng</Button> */}
                  <CustomButton
                    variant="contained"
                    backgroundColor="yellow"
                    onClick={placeOrder}
                    disabled={(userInfo.credit < cartInfo.subtotal + cartInfo.ship_cost) && !payLater}
                    style={{
                      width: '100%',
                      maxWidth: '300px'
                    }}
                  >
                    Xác nhận thanh toán
                  </CustomButton>
                </Box>
              </Box>

            </Box>

            <Box marginTop={2.5} />
          </Box>
        </Box>
      }
    </>
  )
}

export default ThanhToan