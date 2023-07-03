import { Box, Button, Collapse, Divider, FormControl, FormControlLabel, IconButton, InputAdornment, makeStyles, MenuItem, Radio, RadioGroup, TextField, Typography, useMediaQuery } from "@material-ui/core";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddressPopup from "../../../CommonComponent/AddressPopup";
import { CustomButton } from "../../../CommonComponent/CustomButton";
import { BASE_API } from "../../../constants";
import { axiosGet, axiosPatch, axiosPut } from "../../../ultils/axiosUtils";
import { numberWithCommas } from "../../../ultils/NumberUtils";
import DepositSummary from "../DepositSummary";
import MiniCart from "../MiniCart/MiniCart";
import NapSachStepper from "../NapSachStepper";
import PackagingTips from "./PackagingTips";
import Loading from "../../../Loading";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  submitButton: {
    width: '200px',
  }
}))

const SHIP_CHOICE = {
  USER_SHIP: 0,
  MBOOKS_SHIP: 1
}

const ChonVanChuyen = () => {
  const classes = useStyles()
  const [choice, setChoice] = useState(SHIP_CHOICE.MBOOKS_SHIP);
  const { id } = useParams()
  const [cartInfo, setCartInfo] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [openAddress, setOpenAddress] = useState(false)
  const smallLayout = useMediaQuery('(max-width:700px)')
  const [openSummary, setOpenSummary] = useState(false)
  const [pickUpTimes, setPickUpTimes] = useState([])
  const submitButtonRef = useRef()
  const [loading, setLoading] = useState(false)
  const handleChange = (event) => {
    setChoice(event.target.value)
  }

  const navigate = useNavigate()

  const getUserInfo = async () => {
    let response = await axiosGet(`${BASE_API}/users`, null, true)
    if (!response) return
    setUserInfo(response.data)
  }

  const getDepositCartInfo = async () => {
    let response = await axiosGet(`${BASE_API}/deposit-carts/${id}`, null, true)
    if (!response) {
      navigate('/')
      return
    }
    if (response.data.status !== 'USER_SHIP_SELECT') {
      navigate('/')
      return
    }
    setCartInfo(response.data)
  }

  const getPickUpTimes = async () => {
    const response = await axiosGet(`${BASE_API}/transport/pick-up-times`)
    if (!response || response.code !== 200) return
    setPickUpTimes(response.data)
  }

  useEffect(() => {
    getUserInfo()
    getDepositCartInfo()
    getPickUpTimes()
  }, [])

  const confirmUserShip = async () => {
    let response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
      "field_name": "ship_method",
      "value": "BY_USER"
    }, true)
    if (!response || response.code !== 200) return
    setOpenSummary(true)
  }

  const confirmMbookShip = async (form) => {
    const elements = form.target.elements

    const getValue = (name) => {
      return elements[name].value
    }

    let response = await axiosPut(`${BASE_API}/deposit-carts/${cartInfo._id}/ship-box`, {
      "weight": getValue("weight"),
      "length": null,
      "width": null,
      "height": null,
      "pick_up_type": getValue("pick_up_type")
    }, true)
    if (!response || response.code !== 200) return
    response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
      "field_name": "ship_method",
      "value": "BY_MONSTERS"
    }, true)
    if (!response || response.code !== 200) return

    navigate(`/chon-dia-chi?procedure=deposit&id=${cartInfo._id}`)
  }



  const confirmDepositShip = async () => {
    setLoading(true)
    const response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
      "field_name": "status",
      "value": "SHIPPING"
    }, true)
    setLoading(false)
    if (!response || response.code !== 200) return
    navigate(`/dang-van-chuyen/${cartInfo._id}`)
  }

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
        >
          <Box
            width='100%'
            height='fit-content'
            boxSizing='border-box'
            marginLeft={2}
            marginTop={2}
            marginRight={2}
            style={{ backgroundColor: '#00000000' }}
            paddingBottom={smallLayout ? 8 : 0}
          >
            <NapSachStepper step={3} />
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
                  <span style={{ color: 'purple' }}>[{userInfo.name}]</span> Lựa chọn hình thức vận chuyển
                </Typography>
                <Box
                  minWidth='120px'
                  alignItems={smallLayout ? 'flex-start' : 'flex-end'}
                  display='flex'
                  flexDirection='column'
                >
                  <Typography component='div'>
                    Giá trị đơn hàng nạp:
                  </Typography>
                  <Typography variant="h6" display='inline' style={{ color: 'orange' }}>
                    {numberWithCommas(cartInfo.subtotal)}đ
                  </Typography>
                </Box>

              </Box>

              <Divider />

              <Box
                marginTop={2}
              >
                <Typography variant="h6" style={{ fontWeight: 500 }}>Hình thức vận chuyển</Typography>
                <FormControl component="fieldset">
                  <RadioGroup name="gender1" value={choice} onChange={handleChange}>
                    <FormControlLabel
                      value={SHIP_CHOICE.USER_SHIP}
                      control={<Radio disabled color="primary" />}
                      label={
                        <Typography >
                          {userInfo?.name} vận chuyển tới đại lý Maxmin (-0đ) (Hình thức này sẽ được hỗ trợ sau)
                        </Typography>
                      }
                    />
                    <Collapse in={choice === 'user-ship'}>
                      <Box paddingLeft={4} marginBottom={2} marginTop={1}>
                        <CustomButton
                          onClick={() => setOpenAddress(true)}
                          size='small'
                          variant='contained'
                          backgroundColor='white'
                          width='200px'
                        >
                          Xem địa chỉ Maxmin {'>'}
                        </CustomButton>
                        <AddressPopup open={openAddress} onClose={() => setOpenAddress(false)} />
                      </Box>
                    </Collapse>

                    <FormControlLabel
                      value={SHIP_CHOICE.MBOOKS_SHIP}
                      control={<Radio color="primary" />}
                      label={
                        <Typography >
                          Maxmin nhận hàng tại địa chỉ của {userInfo.name}
                        </Typography>
                      }
                    />

                    <Collapse in={choice === SHIP_CHOICE.MBOOKS_SHIP}>
                      <Box paddingLeft={4} marginBottom={2} marginTop={1}>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          confirmMbookShip(e)
                        }}>
                          <Box display='flex' flexDirection='column'>
                            <PackagingTips />
                            <Box marginTop={1} />

                            <Typography
                              variant='body2'
                              style={{ fontStyle: 'italic' }}
                            >*Vui lòng điền thông tin chính xác để phí ship ước lượng sát thực tế và tiết kiệm nhất</Typography>

                            <Box marginTop={2} />

                            <TextField
                              name="weight"
                              label='Khồi lượng'
                              required
                              variant='outlined'
                              size='small'
                              InputProps={{
                                endAdornment: <InputAdornment position="end">
                                  <span style={{ color: 'black' }}>
                                    gram
                                  </span>
                                </InputAdornment>,
                              }}
                            />
                            {/* <TextField
                              name="length"
                              label='Chiều dài'
                              required
                              variant='outlined'
                              size='small'
                              InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                              }}
                            /> */}
                            {/* <TextField
                              name="width"
                              label='Chiều rộng'
                              required
                              variant='outlined'
                              size='small'
                              InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                              }}

                            /> */}
                            {/* <TextField
                              name="height"
                              label='Chiều cao'
                              required
                              variant='outlined'
                              size='small'
                              InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                              }}
                            /> */}
                            <Box marginTop={2} />

                            <TextField
                              name="pick_up_type"
                              label="Thời gian lấy hàng"
                              required
                              variant="outlined"
                              size='small'
                              select
                            >
                              {pickUpTimes.map(time =>
                                <MenuItem key={time._id} value={time._id}>
                                  {time.text}
                                </MenuItem>
                              )}
                            </TextField>
                            <button type='submit' ref={submitButtonRef} style={{ display: 'none' }}></button>
                          </Box>
                        </form>
                      </Box>
                    </Collapse>
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box
                marginTop={2}
                marginBottom={2}
              >
                <Divider />
              </Box>


              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <CustomButton
                  backgroundColor='yellow'
                  variant='contained'
                  className={classes.submitButton}
                  borderRadius='amazon'
                  onClick={() => {
                    if (choice === SHIP_CHOICE.USER_SHIP) confirmUserShip()
                    else submitButtonRef.current.click()
                  }}
                  disabled={!choice}
                >Tiếp tục</CustomButton>
              </Box>
            </Box>
          </Box>

          <MiniCart
            showSubmitButton={false}
            isVertical={!smallLayout}
          />
          <DepositSummary
            open={openSummary}
            onClose={() => setOpenSummary(false)}
            confirm={confirmDepositShip}
            id={id}
            loading={loading}
          />
          {loading && <Loading />}
        </Box>
      }
    </>
  )
}

export default ChonVanChuyen

// const nextStep = async () => {
//   if (choice === 'user-ship') {
//     let response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
//       "field_name": "ship_method",
//       "value": "BY_USER"
//     }, true)
//     if (!response || response.code !== 200) return
//     setOpenSummary(true)
//   }
//   else {
//     let response = await axiosPut(`${BASE_API}/deposit-carts/${cartInfo._id}/ship-box`, {

//     }, true)
//     if (!response || response.code !== 200) return
//     response = await axiosPatch(`${BASE_API}/deposit-carts/${cartInfo._id}`, {
//       "field_name": "ship_method",
//       "value": "BY_MONSTERS"
//     }, true)
//     if (!response || response.code !== 200) return

//     navigate(`/chon-dia-chi?procedure=deposit&id=${cartInfo._id}`)
//   }
// }