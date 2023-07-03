import { Box, Divider, IconButton, makeStyles, TextField, Typography } from "@material-ui/core";
import { AddBox, IndeterminateCheckBox } from "@material-ui/icons";
import isNumber from "is-number";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomLinearProgress } from "../BookPage/Book2";
import AmountInput from "../CommonComponent/AmountInput";
import { CustomButton } from "../CommonComponent/CustomButton";
import { BASE_API } from "../constants";
import { refreshNavbar } from "../redux/rootReducer";
import { axiosPost } from "../ultils/axiosUtils";
import { getTimeDiff } from "../ultils/DateUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import { signIn } from "../ultils/SpecialRoute/SignedInRoute";
import AllBuyOptions from "./AllBuyOptions/AllBuyOptions";
import FreeReturn from "./FreeReturn";
import { SeeAllImage, SeeAllImageThumbnail } from "./SeeAllImage";
import './TextField.css';

const useStyles = makeStyles((theme) => ({
  priceBox: {
    backgroundColor: theme.palette.common.white,
  },
  bigImage: {
    objectFit: 'fill',
    width: '95%',
    height: 'auto',
    boxShadow: '0px 0px 15px 0px grey',
    objectPosition: 'top'
  },
  smallImage: {
    objectFit: 'cover',
    width: '24%',
    height: '50px',
    objectPosition: 'top'
  },
}))

const optionNames = [
  'Mới', 'Cũ như mới', 'Cũ nhưng rất tốt', 'Cũ nhưng tốt', 'Cũ dùng được'
]

const calcPercent = (num1, num2) => {
  if (!num1 || !num2) return null
  return (100 - num1 / num2 * 100).toFixed(0)
}

export const getCTVCodes = (id) => {
  let rcodes = JSON.parse(localStorage.getItem('rcodes'))
  let ccodes = JSON.parse(localStorage.getItem('ccodes'))
  let max_time_diff = 5
  let rcode = '', ccode = ''
  console.log(rcodes, ccodes)
  if (rcodes) {
    let rcode_obj = rcodes[id]
    if (rcode_obj) {
      let rdate = rcode_obj.date
      let current_date = new Date()
      console.log('time diff', getTimeDiff(rdate, current_date, 'day'))
      if (getTimeDiff(rdate, current_date, 'day') <= max_time_diff) {
        console.log('noice')
        rcode = rcode_obj.code
      }
    }
  }
  if (ccodes) {
    let ccode_obj = ccodes[id]
    if (ccode_obj) {
      let cdate = ccode_obj.date
      let current_date = new Date()
      if (getTimeDiff(cdate, current_date, 'day') <= max_time_diff) {
        console.log('nice')
        ccode = ccode_obj.code
      }
    }
  }
  return [rcode, ccode]
}


const PriceBox = ({ buyOptions, buyOptionIndex, id, bookStatus, setOpenAllBuyOptions }) => {
  const classes = useStyles()
  const [amount, setAmount] = useState(1)
  const [buyable, setBuyable] = useState(false)
  let [searchParams] = useSearchParams()
  let buy_amount = searchParams.get('buy_amount')
  const { signed_in } = useSelector(state => state.root)
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [openSeeAllImage, setOpenSeeAllImage] = useState(false)

  let current_option = buyOptions[buyOptionIndex]
  const book_id = buyOptions[0].book_id

  useEffect(() => {
    setAmount(1)
  }, [buyOptionIndex])

  useEffect(() => {
    let value = parseInt(buy_amount)
    if (!isNumber(value)) return
    console.log('buy amount', value)
    if (value > 1) setAmount(value)
  }, [buy_amount])

  useEffect(() => {
    let buyable = isNumber(amount) && amount > 0 && parseFloat(amount) === parseInt(amount)
    setBuyable(buyable)
  }, [amount])

  const navigate = useNavigate()

  const callApiAddToCart = async (cb) => {
    if (!signed_in) signIn()

    let [rcode, ccode] = getCTVCodes(id)

    let response = await axiosPost(`${BASE_API}/cartitems`, {
      book_id: book_id,
      otype: current_option.otype,
      price: current_option.price,
      quantity: amount,
      ditem_id: current_option.ditem_id,
      rcode,
      ccode
    }, true)

    if (!response || response.code !== 200) {
      enqueueSnackbar(response.message || 'Đã xảy ra lỗi', { variant: 'error' })
      return
    }

    if (cb) cb()
  }

  const addToCart = async () => {
    callApiAddToCart(() => {
      dispatch(refreshNavbar())
      navigate(`/confirm?from=product-page&id=${encodeURIComponent(id)}`)
    })
  }

  const buyNow = async () => {
    callApiAddToCart(() => {
      dispatch(refreshNavbar())
      navigate(`/cart`)
    })
  }

  const getBookStatusLabel = useMemo(() => {
    let label = ''
    let color = ''

    switch (bookStatus) {
      // case 'ACTIVE':
      //   label = option.quantity > 0 ? 'Còn hàng' : 'Hết hàng'
      //   color = option.quantity > 0 ? 'green' : 'red'
      //   break
      // case 'OUT_STOCK':
      //   label = 'Hết hàng'
      //   color = 'red'
      //   break
      // case 'STOP_SELL':
      //   label = 'Ngừng kinh doanh'
      //   color = 'red'
      //   break
      case 'COMING_SOON':
        label = 'Sắp ra mắt'
        color = 'purple'
        break
      default:
        label = current_option.quantity > 0 ? 'Còn hàng' : 'Hết hàng'
        color = current_option.quantity > 0 ? 'green' : 'red'
    }


    return (
      <Typography
        style={{ color: color, fontWeight: '500' }}
        variant="h6"
      >
        {label}
      </Typography>
    )
  }, [buyOptionIndex])

  const getAddButtonLabel = useCallback(() => {
    let label = ''
    switch (bookStatus) {
      // case 'ACTIVE':
      //   label = 'Thêm vào giỏ hàng'
      //   break
      case 'COMING_SOON':
        label = 'Đặt trước'
        break
      default:
        label = 'Thêm vào giỏ hàng'
    }
    return label
  })

  return (
    <Box
      id='price-box'
      width='320px'
      minWidth='320px'
      height='fit-content'
      padding={2}
      boxSizing='border-box'
      className={classes.priceBox}
      border={6}
      borderRadius={10}
      borderColor='grey.200'
      overflow='hidden'
    >
      <Box
        height='100%'
        width='100%'
        overflow='hidden'
      >

        <Box
          display='flex'
          justifyContent='space-between'
        >
          <Typography component='div' variant='body2'>{optionNames[buyOptionIndex]}</Typography>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            width='fit-content'
          >
            <Typography component='div' style={{ color: '#CC0B39' }} variant='body2'><b>{numberWithCommas(current_option.price)}đ</b></Typography>
            {current_option.price !== current_option.original_price &&
              <>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  width='100%'
                >
                  <Typography component='div' variant='body2'>Giá bìa:&ensp;</Typography>
                  <Typography component='div' style={{ textDecoration: 'line-through' }} variant='body2'>{numberWithCommas(current_option.original_price)}đ</Typography>
                </Box>
                <Typography component='div' style={{ marginRight: '10px' }} variant='body2'>(-{calcPercent(current_option.price, current_option.original_price)}%)</Typography>
              </>
            }
          </Box>
        </Box>

        <Box mt={2} />
        <SeeAllImageThumbnail
          openDialog={() => setOpenSeeAllImage(true)}
          smallImages={current_option.images.map(image => image.thumb_url)}
        />
        <SeeAllImage
          open={openSeeAllImage}
          onClose={() => setOpenSeeAllImage(false)}
          bigImages={current_option.images.map(image => image.large_url)}
          smallImages={current_option.images.map(image => image.thumb_url)}
        />
        <Box paddingTop={0.5}><Divider /></Box>
        <FreeReturn />
        <Box paddingBottom={1.5}><Divider /></Box>

        <Typography color="textPrimary" variant='body2'>{current_option.odesc}</Typography>
        <Box marginTop={1} />
        <Typography color="textPrimary" variant='body2'>{current_option.ditem_desc}</Typography>

        <Box marginTop={1}></Box>

        {current_option.sales.length > 0 ?
          <SaleInfo info={current_option.sales[0]} />
          :
          getBookStatusLabel
        }

        <AmountInput
          amount={amount}
          setAmount={setAmount}
          minAmount={0}
          maxAmount={current_option.quantity}
        />
        <Box
          marginTop={2}
          mx={0.5}
        >
          <CustomButton
            backgroundColor='white'
            borderRadius='round'
            variant="contained"
            fullWidth
            onClick={() => setOpenAllBuyOptions(true)}
          >
            Xem các lựa chọn khác
          </CustomButton>
          <Box marginTop={1}></Box>

          {/* {['ACTIVE', 'COMING_SOON'].includes(bookStatus) && */}
          <CustomButton
            backgroundColor='yellow'
            borderRadius='round'
            variant="contained"
            fullWidth
            onClick={addToCart}
            disabled={!buyable || current_option.quantity === 0}
          >
            {getAddButtonLabel()}
          </CustomButton>

          <Box marginTop={1}></Box>

          <CustomButton
            backgroundColor='orange'
            borderRadius='round'
            variant="contained"
            fullWidth
            onClick={buyNow}
            disabled={!buyable || current_option.quantity === 0}
          >
            Mua ngay
          </CustomButton>
          <Box marginTop={1}></Box>

        </Box>
      </Box>



    </Box>
  )
}

export default PriceBox

export const SaleInfo = ({ info }) => {
  const endDate = new Date(info.etime)
  const currentDate = new Date()
  let redstr = ''
  let timestr = ''

  redstr = `-${info.psale}%`
  let hour = endDate.getHours()
  let minute = endDate.getMinutes()
  timestr = `Sale đến ${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`
  let day_diff = endDate.getDate() - currentDate.getDate()
  let hour_diff = Math.floor((endDate - currentDate) / 1000 / 60 / 60)
  if ((day_diff === 1 && hour_diff >= 12) || day_diff > 1) {
    timestr = `Sale đến ${endDate.getDate()}/${endDate.getMonth() + 1}`
  }
  let sold_percent = Math.floor(info.sold_quantity / info.quantity * 100)
  let remain_quantity = info.quantity - info.sold_quantity
  return (
    <Box
      marginBottom={1}
      marginTop={0.5}
      height='fit-content'
    >
      <Typography style={{ color: '#CC0B39', fontWeight: 600 }} variant='body2'>{timestr}</Typography>
      <CustomLinearProgress variant="determinate" value={sold_percent} />
      <Box display='flex' justifyContent='space-between' marginTop={0.5}>
        <Typography style={{ color: '#CC0B39', fontWeight: 600 }} variant='caption'>{sold_percent}%</Typography>
        <Typography style={{ color: '#CC0B39', fontWeight: 600 }} variant='caption'>{remain_quantity === 0 ? 'Bán hết' : `Còn lại ${remain_quantity}`}</Typography>
      </Box>
    </Box>
  )
}