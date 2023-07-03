import { Box, Divider, makeStyles, TextField, Typography, useMediaQuery } from "@material-ui/core";
import { Cancel, CheckCircle } from "@material-ui/icons";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../CommonComponent/CustomButton";
import { BASE_API, GIFT_CARD_CHOICES } from "../constants";
import { refreshNavbar } from "../redux/rootReducer";
import { axiosGet, axiosPost } from "../ultils/axiosUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import CardTemplate from "./CardTemplate/CardTemplate";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  submitButton: {
    width: '300px',
  },
  image: {
    objectFit: 'cover',
    objectPosition: 'center',
    height: '100%',
  }
}))


const NapCreditGift = () => {
  const classes = useStyles()
  const [valid, setValid] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const smallLayout = useMediaQuery('(max-width:780px)')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const [checking, setChecking] = useState(false)
  const [code, setCode] = useState('')
  const [credit, setCredit] = useState(0)
  const [showVerify, setShowVerify] = useState(false)
  const cancelToken = useRef()
  const [giftCardName, setGiftCardName] = useState('')
  const [giftCardType, setGiftCardType] = useState('')
  const [oname, setOname] = useState('')


  useEffect(() => {
    setValid(false)
    setShowVerify(false)
    if (code.length === 18) checkCode()
  }, [code])

  const getUserInfo = async () => {
    let response = await axiosGet(`${BASE_API}/users`, null, true)
    if (!response) return
    setUserInfo(response.data)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  const checkCode = async (e) => {
    // e.preventDefault()
    if (typeof cancelToken.current !== typeof undefined) {
      cancelToken.current.cancel('canceled for new request')
    }

    cancelToken.current = axios.CancelToken.source()

    setChecking(true)
    setShowVerify(false)
    let ret = await axios({
      method: 'post',
      url: `${BASE_API}/users/credits/giftcards/checks`,
      data: {
        "code": code.replaceAll(' - ', '-'),
      },
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
      cancelToken: cancelToken.current.token
    })
    let response = ret.data
    // await new Promise((resolve) => { setTimeout(() => resolve(), 3000) })
    setChecking(false)
    if (!response || response.code !== 200) {
      setValid(false)
    } else {
      setValid(true)
      setCredit(response.data.ncredit)
      let choice = GIFT_CARD_CHOICES.find(choice => choice.price === response.data.ncredit)
      setGiftCardName(choice?.name)
      setGiftCardType(choice?.type)
      setOname(response.data.oname)
    }
    setShowVerify(true)
  }

  const redeem = async () => {
    setChecking(true)
    let response = await axiosPost(`${BASE_API}/users/credits/giftcards`, {
      "code": code.replaceAll(' - ', '-'),
    }, true)
    // await new Promise((resolve) => { setTimeout(() => resolve(), 1000) })
    setChecking(false)
    if (!response || response.code !== 200) {
      enqueueSnackbar('Mã không hợp lệ hoặc đã hết hạn', { variant: 'error' })
    } else {
      enqueueSnackbar(`Bạn đã nhận ${numberWithCommas(response.data.credit_added)}đ từ thẻ quà`, { variant: 'success' })
      dispatch(refreshNavbar())
      getUserInfo()
    }
    setCode('')
    setValid(false)
  }

  function formatCardNumber(value) {
    if (!value) return value;
    const cardNumber = value.replaceAll(' - ', "").replaceAll('-', '').toUpperCase();
    const cardNumberLength = cardNumber.length;
    if (cardNumberLength < 5) return cardNumber;

    if (cardNumberLength < 9) {
      return `${cardNumber.slice(0, 4)} - ${cardNumber.slice(4)}`;
    }

    return `${cardNumber.slice(0, 4)} - ${cardNumber.slice(4, 8)} - ${cardNumber.slice(8, 12)}`;
  }

  const handleInput = (e) => {
    const formattedCardNumber = formatCardNumber(e.target.value)
    setCode(formattedCardNumber)

  }


  return (
    <Box
      className={classes.root}
      width='100%'
      height='fit-content'
      boxSizing='border-box'
      paddingTop={8}
      display='flex'
      paddingX={2}
      flexDirection='column'
      alignItems='center'
    >
      {/*Main area */}
      <Box
        width='100%'
        height='fit-content'
        padding={3}
        boxSizing='border-box'
        style={{ backgroundColor: '#fff' }}
        maxWidth='1480px'
        marginTop={2}
      >
        <Box
          display={smallLayout ? 'block' : 'flex'}
          justifyContent='space-between'
        >
          <Typography
            variant={smallLayout ? 'h6' : 'h5'}
            style={{ fontWeight: '500' }}
            gutterBottom
          >
            Nạp credit bằng mã thẻ quà tặng
          </Typography>
          <Box
            minWidth='120px'
            display='flex'
            alignItems='baseline'
            width='fit-content'
            marginBottom={smallLayout ? 2 : 0}
          >
            <Typography component='div' style={{ textAlign: 'end' }}>
              Số dư hiện tại:&nbsp;
            </Typography>
            <Typography variant="h6" style={{ color: 'orange', textAlign: 'end' }}>
              {!!userInfo && numberWithCommas(userInfo.credit)}đ
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          width='100%'
          // minWidth='300px'
          marginTop={2}
          marginBottom={2}

        >
          <TextField
            label="Mã thẻ quà tặng"
            variant="outlined"
            size="small"
            value={code}
            onChange={handleInput}
            type='search'
            required
            style={{ minWidth: smallLayout ? 0 : 400 }}
            fullWidth={smallLayout}
          />
          {showVerify &&
            <Box display='flex' alignItems='center' marginTop={2}>
              {valid ?
                <>
                  <Typography style={{ color: 'green' }}>Hợp lệ</Typography>
                  <Box marginLeft={1} />
                  <CheckCircle style={{ color: 'green' }} />
                </>
                :
                <>
                  <Typography style={{ color: 'red' }}>Không hợp lệ</Typography>
                  <Box marginLeft={1} />
                  <Cancel style={{ color: 'red' }} />
                </>
              }
            </Box>
          }


        </Box>

        <Box marginTop={1.5} />
        {showVerify && valid &&
          <>
            <CardTemplate
              code={code}
              oname={oname}
              ncredit={credit}
            />
          </>
        }

        <Box
          marginTop={2}
          marginBottom={2}
        >
          <Divider />
        </Box>

        <Box
          display='flex'
          alignItems={smallLayout ? 'flex-start' : 'center'}
          flexDirection={smallLayout ? 'column' : 'row'}
        >
          {/* <Button color="primary" variant="contained" className={classes.submitButton} onClick={submit}>Submit</Button> */}
          <CustomButton
            backgroundColor="yellow"
            variant="contained"
            onClick={redeem}
            borderRadius='amazon'
            // width='300px'
            disabled={checking || !valid}
            style={{ minWidth: smallLayout ? 0 : 400 }}
            fullWidth={smallLayout}
          >Submit</CustomButton>

          {!!code && !checking && valid &&
            <>
              {smallLayout ? <Box marginTop={2} /> : <Box marginLeft={2} />}
              < Typography component='div' variant='body1'>{'(Credit nạp:'}
                <span style={{ color: '#279300' }}> +{numberWithCommas(credit)}đ</span>
                {')'}
              </Typography>
            </>
          }
        </Box>
      </Box>

    </Box >
  )
}

export default NapCreditGift