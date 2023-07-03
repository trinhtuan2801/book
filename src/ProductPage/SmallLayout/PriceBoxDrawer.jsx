import { Backdrop, Box, Button, Divider, Drawer, IconButton, makeStyles, TextField, Typography, useTheme } from '@material-ui/core'
import { AddBox, Clear, Code, IndeterminateCheckBox } from '@material-ui/icons'
import classNames from 'classnames'
import isNumber from 'is-number'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CustomButton } from '../../CommonComponent/CustomButton'
import { BASE_API, BASE_FILE } from '../../constants'
import { refreshNavbar } from '../../redux/rootReducer'
import { axiosPost } from '../../ultils/axiosUtils'
import { numberWithCommas } from '../../ultils/NumberUtils'
import { choices } from '../BookDetails'
import { PRICE_BOX_TYPE } from '../ProductPage'
import SeeAllImageSmall from './SeeAllImageSmall'
import { useSnackbar } from 'notistack'
import Ribbon from '../../CommonComponent/Ribbon/Ribbon'
import { getCTVCodes, SaleInfo } from '../PriceBox'
import { useMemo } from 'react'
import { signIn } from '../../ultils/SpecialRoute/SignedInRoute'

const useStyles = makeStyles((theme) => ({
  typeBoxActive: {
    border: '1px solid #e7a976',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fdf8f3',
    cursor: 'pointer'
  },
  typeBoxInactive: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    cursor: 'pointer'
  },
  typeBoxWrapper: {
    padding: '5px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  typeBoxDisabled: {
    border: `1px dashed ${theme.palette.grey[400]}`,
    cursor: 'default',
    color: theme.palette.grey[400],
    backgroundColor: theme.palette.common.white,
  },
  author: {
    color: '#3f51b5',
  },
}))

const PriceBoxDrawer = ({ open, onClose, buyOptionIndex, buyOptions, bookStatus, clickBuyOption, priceBoxType, bigImages, id, setOpenAllBuyOptions }) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const theme = useTheme()

  // const classes = useStyles()
  const [amount, setAmount] = useState(1)
  const [buyable, setBuyable] = useState(false)
  let [searchParams] = useSearchParams()
  let buy_amount = searchParams.get('buy_amount')
  const { signed_in } = useSelector(state => state.root)
  const dispatch = useDispatch()
  // const [fbOpen, setFbOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  let option = buyOptions[buyOptionIndex]

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

  const handleClickAmount = (isAdd) => (event) => {
    if (isAdd) setAmount(amount + 1)
    else if (amount > 0) setAmount(amount - 1)
  }

  const addToCart = async () => {
    if (!signed_in) {
      localStorage.setItem('buy_option', `${buyOptionIndex}`)
      localStorage.setItem('buy_amount', `${amount}`)
      signIn()

      return
    }

    let [rcode, ccode] = getCTVCodes(id)

    let response = await axiosPost(`${BASE_API}/cartitems`, {
      book_id: option.book_id,
      otype: option.otype,
      price: option.price,
      quantity: amount,
      ditem_id: option.ditem_id,
      rcode,
      ccode
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response.message || 'Đã xảy ra lỗi', { variant: 'error' })
      return
    }
    dispatch(refreshNavbar())
    // navigate(`/confirm?from=product-page&id=${id}`)
    // setFbOpen(true)
    enqueueSnackbar('Đã thêm vào giỏ', { variant: 'success' })
    onClose()
  }

  const buyNow = async () => {
    if (!signed_in) {
      localStorage.setItem('buy_option', `${buyOptionIndex}`)
      localStorage.setItem('buy_amount', `${amount}`)
      signIn()

      return
    }

    let [rcode, ccode] = getCTVCodes(id)

    let response = await axiosPost(`${BASE_API}/cartitems`, {
      book_id: option.book_id,
      otype: option.otype,
      price: option.price,
      quantity: amount,
      ditem_id: option.ditem_id,
      rcode,
      ccode
    }, true)
    if (!response) return
    dispatch(refreshNavbar())
    navigate(`/cart`)
  }

  const onChangeAmount = (event) => {
    let value = event.target.value
    setAmount(value)
  }

  const onBlur = (event) => {
    let value = Number(event.target.value)
    let isValid = isNumber(value) && value >= 0
    if (isValid) {
      if (value > option.quantity)
        setAmount(option.quantity)
      else
        setAmount(Math.floor(value))
    }
    else setAmount(0)
  }

  const [dialogState, setDialogState] = useState(false)

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
      case 'STOP_SELL':
        label = 'Ngừng kinh doanh'
        color = 'red'
        break
      case 'COMING_SOON':
        label = 'Sắp ra mắt'
        color = 'purple'
        break
      default:
        label = option.quantity > 0 ? 'Còn hàng' : 'Hết hàng'
        color = option.quantity > 0 ? 'green' : 'red'
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
        label = 'Thêm giỏ'
    }
    return label
  })
  const calcPercent = (num1, num2) => {
    if (!num1 || !num2) return null
    return (100 - num1 / num2 * 100).toFixed(0)
  }

  return (
    <>
      <Drawer
        variant="persistent"
        anchor='bottom'
        open={open}
        // onClose={(e, reason) => onClose()}
        // onOpen={() => { }}
        onClose={onClose}
      >
        <Box
          width='100%'
          height='fit-content'
          maxHeight='600px'
          style={{ backgroundColor: 'white' }}
        >
          <Box
            display='flex'
            padding={2}
            boxSizing='border-box'
            width='100%'
          >
            <Box
              width='150px'
              height='150px'
              minWidth='150px'
              minHeight='150px'
              position='relative'
            >
              <img
                width='100%'
                height='100%'
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  boxSizing: 'border-box',
                  border: '1px solid grey',
                }}
                src={`${BASE_FILE}/${option.images[0].thumb_url}`}
              />
              <IconButton
                size='small'
                style={{ width: '23px', height: '23px', position: 'absolute', right: '5px', top: '5px', background: 'rgba(0, 0, 0, 0.2)' }}
                onClick={() => setDialogState(true)}
              >
                <Code style={{ color: 'white', transform: 'rotate(-45deg)' }} />
              </IconButton>
              <SeeAllImageSmall open={dialogState} onClose={() => setDialogState(false)} bigImages={option.images.map(img => img.large_url)} />
            </Box>

            <Box marginLeft={2} flexGrow={1}>
              <Typography component='div' style={{ color: '#CC0B39' }} variant='body2'><b>{numberWithCommas(option.price)}đ</b></Typography>
              {option.price !== option.original_price &&
                <>
                  <Typography variant='body2'>
                    Giá bìa:&nbsp;
                    <span style={{ textDecoration: 'line-through' }}>{numberWithCommas(option.original_price)}đ</span>
                    <br />
                    (-{calcPercent(option.price, option.original_price)}%)
                  </Typography>
                </>
              }
              <Box marginTop={1} />
              {option.sales?.length > 0 ?
                <Box width='100%' boxSizing='border-box'>
                  <SaleInfo info={option.sales[0]} />
                </Box>
                :
                getBookStatusLabel
              }
            </Box>
            <IconButton size='small' style={{ width: '20px', height: '20px' }} onClick={onClose}><Clear /></IconButton>
          </Box>

          <Divider />

          <Box
            marginY={1}
            // paddingX={2}
            boxSizing='border-box'
            width='100%'
            style={{ overflowY: 'scroll' }}
          >
            <Box width='100%' paddingX={1} boxSizing='border-box' marginBottom={1}>
              <Typography style={{ fontWeight: '500', fontSize: '14px' }}>Tình trạng sách</Typography>
              <Box marginTop={1} />
              <Typography color="textPrimary" variant='body2'>
                {option.odesc}
                <br />
                {option.ditem_desc}
              </Typography>
            </Box>

            {/* <Divider /> */}
            <Box
              display='flex'
              width='100%'
              flexWrap='wrap'
              marginTop={1.5}
              marginBottom={1}
              justifyContent='center'
              gridColumnGap={8}
              paddingX={1}
              boxSizing='border-box'
            >
              {buyOptions.map((option, index) => (
                <Box
                  key={index}
                  onClick={option.quantity ? (() => clickBuyOption(index)) : null}
                  // className={buyOptionIndex === index ? classes.typeBoxActive : classes.typeBoxInactive}
                  className={classNames({
                    [classes.typeBoxActive]: buyOptionIndex === index,
                    [classes.typeBoxInactive]: buyOptionIndex !== index,
                    [classes.typeBoxDisabled]: option.quantity === 0
                  })}
                  height='50px'
                  boxSizing='border-box'
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  padding={1.5}
                  paddingX={1}
                  flexGrow={1}
                  maxWidth='110px'
                  minWidth='110px'
                  marginBottom={1}
                  position='relative'
                >
                  <Typography
                    component='div'
                    style={{ fontWeight: buyOptionIndex === index ? 'bold' : 'normal', fontSize: '12px' }}
                  >
                    {choices[option.otype]}
                  </Typography>
                  <Typography
                    component='div'
                    style={{
                      fontWeight: buyOptionIndex === index ? 'bold' : 'normal',
                      color: buyOptionIndex === index ? '#a3331a' : 'inherit',
                      fontSize: '12px'
                    }}
                  >
                    {numberWithCommas(option.price) || '- '}đ
                  </Typography>
                  {option.sales?.length > 0 &&
                    <Ribbon>-{option.sales[0].psale}%</Ribbon>
                  }


                </Box>
              ))}
            </Box>

            {/* <Divider /> */}



            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              boxSizing='border-box'
              paddingLeft={1}
            >
              <Typography variant='body2'>Số lượng:</Typography>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <IconButton
                  disabled={amount >= option.quantity}
                  onClick={handleClickAmount(true)}
                ><AddBox></AddBox></IconButton>
                <TextField
                  type='number'
                  value={amount}
                  onChange={onChangeAmount}
                  style={{ width: '50px', textAlign: 'center' }}
                  inputProps={{ style: { textAlign: 'center' } }}
                  onBlur={onBlur}
                  variant='outlined'
                  size="small"
                />
                <IconButton
                  disabled={amount === 0}
                  onClick={handleClickAmount(false)}
                ><IndeterminateCheckBox></IndeterminateCheckBox></IconButton>
              </Box>
            </Box>
          </Box>

          <Box paddingX={1}>
            <CustomButton
              backgroundColor='white'
              borderRadius='0px'
              variant="contained"
              fullWidth
              onClick={() => setOpenAllBuyOptions(true)}
            >
              Xem các lựa chọn khác
            </CustomButton>
          </Box>

          <Box
            display='flex'
            boxSizing='border-box'
            paddingX={1}
            mt={1}
            mb={1}
          >
            {priceBoxType !== PRICE_BOX_TYPE.BUY_NOW &&
              <CustomButton
                backgroundColor='yellow'
                borderRadius='0px'
                variant="contained"
                fullWidth
                onClick={addToCart}
                disabled={!buyable || option.quantity === 0}
              >
                {getAddButtonLabel()}
              </CustomButton>
            }

            {priceBoxType === PRICE_BOX_TYPE.BOTH &&
              <Box marginLeft={0.5} />
            }

            {priceBoxType !== PRICE_BOX_TYPE.ADD_TO_CART &&
              <CustomButton
                backgroundColor='orange'
                borderRadius='0px'
                variant="contained"
                fullWidth
                onClick={buyNow}
                disabled={!buyable || option.quantity === 0}
              >
                Mua ngay
              </CustomButton>
            }
          </Box>



        </Box>
      </Drawer>

      <Backdrop open={open} onClick={onClose} style={{ zIndex: theme.zIndex.drawer - 1 }} />
    </>
  )
}
export default PriceBoxDrawer