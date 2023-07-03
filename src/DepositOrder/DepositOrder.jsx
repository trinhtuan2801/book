import { Box, Button, Divider, makeStyles, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Done, ExpandMore, FileCopyOutlined, LocalOffer, Visibility } from "@material-ui/icons"
import { useSnackbar } from "notistack"
import { Fragment, useEffect, useMemo, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { useNavigate } from "react-router-dom"
import AddressPopup from "../CommonComponent/AddressPopup"
import { CustomButton } from "../CommonComponent/CustomButton"
import { BASE_API, DEPOSIT_COLOR, DEPOSIT_STATUS_VN } from "../constants"
import FreeShipLevel from "../NapCredit/FreeShipLevel"
import { axiosGet, axiosPatch } from "../ultils/axiosUtils"
import { numberWithCommas, phoneNumberWithSpace } from '../ultils/NumberUtils'
import DepositOrderItem from "./DepositOrderItem"
import OrderSummary from "./OrderSummary"
import SeeMoreCover from "./SeeMoreCover"

const useStyles = makeStyles((theme) => ({
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
}))

const DepositOrder = ({
  _id,
  _status,
  hidden = false
}) => {
  const theme = useTheme()
  const smallLayout = useMediaQuery('(max-width:904px)')
  const classes = useStyles()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState(null)
  const [items, setItems] = useState([])
  const [approveList, setApproveList] = useState({})
  const [openSummary, setOpenSummary] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [openAddress, setOpenAddress] = useState(false)
  const [statPricing, setStatPricing] = useState(null)

  const getItems = async () => {
    const response = await axiosGet(`${BASE_API}/deposit-carts/${_id}`, null, true)
    console.log('deposit order', _id, response)
    if (!response) return
    const data = response.data
    const items = data.items
    setData(data)
    setItems(items)
    console.log(_id, data, _status)
    items.map(({ _id, credit_status, status }) => {
      if (credit_status === 'REJECTED' || status === 'MONSTERS_REJECTED' || status === 'USER_REJECTED' || _status === 'MONSTERS_PRICING') {
        //setApproveList(prev => ({ ...prev, [_id]: false }))//Thoses item already not in consideration of reapproval as well as approval, approval unfound id or shop rejected still update user_rejected
        //If this update cause problem for user approval in the first time, we might check item.status PRICED or ACTIVE to be updated only
      }
      else
        setApproveList(prev => ({ ...prev, [_id]: true }))
    })
    if (items.length <= 2 || ['MONSTERS_PRICING', 'USER_APPROVAL'].includes(_status))
      setShowAll(true)
  }

  const getStatPricing = async () => {
    const response = await axiosGet(`${BASE_API}/deposit-carts/${_id}/stat-pricing`, null, true)
    if (!response || response.code !== 200) {
      return
    }
    console.log('stat', _id, response.data)
    setStatPricing(response.data)
  }

  const goShipDinhGia = () => {
    navigate(`/chon-van-chuyen/${_id}`)
  }

  const changeApprove = (id, isApproved) => {
    setApproveList(prev => ({ ...prev, [id]: isApproved }))
  }

  useEffect(() => {
    if (hidden) return
    getItems()
    if (_status === 'MONSTERS_PRICING')
      getStatPricing()
  }, [_id, _status])

  const checkClickApprovable = useMemo(() => {
    return JSON.stringify(approveList).includes('true')
  }, [approveList])

  const approvedAmount = useMemo(() => {
    // const arr = JSON.stringify(approveList).split('true')
    // return arr.length - 1
    let count = 0
    for (const [key, value] of Object.entries(approveList)) {
      if (value) count++
    }
    return count
  }, [approveList])

  const approveOrder = async () => {
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let response = await axiosPatch(`${BASE_API}/deposit-cartitems/${item._id}`, {
        "field_name": "status",
        "value": approveList[item._id] ? 'APPROVED' : 'USER_REJECTED'
      }, true)
      if (!response) return
    }

    let response = await axiosPatch(`${BASE_API}/deposit-carts/${_id}`, {
      "field_name": "status",
      "value": "USER_SHIP_SELECT"
    }, true)
    if (!response) return
    goShipDinhGia()
  }

  const cancelOrder = async () => {
    let response = await axiosPatch(`${BASE_API}/deposit-carts/${_id}`, {
      "field_name": "status",
      "value": "CANCELLED"
    }, true)
    if (response && response.code === 200) {
      enqueueSnackbar(response?.message || 'Có lỗi khi hủy đơn', { variant: 'error' })
      return
    }
    enqueueSnackbar('Hủy đơn thành công', { variant: 'success' })
    setData(null)
  }

  const stopPricing = async () => {
    const response = await axiosPatch(`${BASE_API}/deposit-carts/${_id}`, {
      field_name: 'status',
      value: 'USER_APPROVAL'
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Lỗi khi chuyển trạng thái', { variant: 'error' })
      return
    }
    navigate('/deposit-order/USER_APPROVAL')
  }

  const reapproveOrder = async () => {
    let promises = []
    for (const item of items) {

      if (approveList[item._id] === false)
        promises.push(Promise.resolve(
          axiosPatch(`${BASE_API}/deposit-cartitems/${item._id}`, {
            "field_name": "status",
            "value": 'REQUEST_RETURN'
          }, true)
        ))
    }

    let allOk = true
    await Promise.all(promises).then((values) => {
      for (const value of values) {
        if (!value || value.code !== 200) {
          enqueueSnackbar(value?.message || 'Có lỗi khi update', { variant: 'error' })
          allOk = false
          break
        }
      }
    })

    if (allOk) {
      let response = await axiosPatch(`${BASE_API}/deposit-carts/${_id}`, {
        "field_name": "status",
        "value": "COMPLETED"
      }, true)
      if (!response) return
      setData(null)
      enqueueSnackbar('Đơn đã hoàn thành', { variant: 'success' })
    }
  }

  let total = data?.subtotal - data?.ship_cost - data?.ship_add - data?.service_fee + data?.ship_pcode_value

  return (
    <>
      {(!!data || hidden) &&
        <Box
          width='100%'
          padding={2}
          style={{ backgroundColor: 'white' }}
          boxSizing='border-box'
          id={_id}
          marginBottom={2}
        >
          <Box display='flex' alignItems='center' width='100%' position='relative'>
            <Typography component='div' variant='body2' style={{ color: DEPOSIT_COLOR[_status], fontWeight: 500 }}>{DEPOSIT_STATUS_VN[_status]}</Typography>
            <Typography component='div' style={{ position: 'absolute', right: '80px' }}>Định giá</Typography>
            <Typography component='div' style={{ position: 'absolute', right: 0 }}>Đồng ý</Typography>

          </Box>

          <Box marginTop={2} />
          <Divider />

          <SeeMoreCover
            _defaultShowAll={showAll}
            showExpandText={!showAll}
          >
            {items.map((item) => (
              <Fragment
                key={item._id}
              >
                <Box marginTop={1} />
                <DepositOrderItem
                  authors={item.authors}
                  buy_price={item.buy_price}
                  obuy_price={item.obuy_price}
                  original_price={item.original_price}
                  credit_status={item.credit_status}
                  images={item.images}
                  title={item.title}
                  otype={item.otype}
                  _id={item._id}
                  url_key={item.url_key}
                  // deleteBook={deleteBook}
                  changeApprove={changeApprove}
                  orderStatus={_status}
                  status={item.status}
                  _approve={approveList[item._id]}
                  // _status={_status}
                  changed={item.changed}
                  {...item}
                />
                <Box marginTop={1} />
                <Divider />
              </Fragment>
            ))}

          </SeeMoreCover>

          <Box marginTop={1} />

          {_status === 'USER_APPROVAL' &&
            <>
              <Typography variant="body2" style={{ fontWeight: 400, color: 'purple' }} gutterBottom>Giảm phí ship khi nạp nhiều hàng</Typography>
              <Box marginTop={2} />
              <FreeShipLevel value={approvedAmount} cart_id={_id} />
              <Box marginTop={1} />
              <Divider />
              <Box marginTop={1} />
            </>
          }

          {_status === 'USER_RE_APPROVAL' &&
            <>
              <Typography
                style={{ textAlign: 'end', fontStyle: 'italic' }}
                variant={smallLayout ? "caption" : "subtitle2"}
                component='p'
                color="textSecondary"
              >*Bạn sẽ trả phí chuyển hoàn nhưng mặt hàng không đồng ý</Typography>
              <Box marginTop={1} />
            </>
          }


          {_status === 'MONSTERS_PRICING' &&
            <>
              <Typography
                style={{ textAlign: 'end', fontStyle: 'italic' }}
                variant={smallLayout ? "caption" : "subtitle2"}
                component='p'
                color="textSecondary"
              >*Giá hiển thị theo shop định giá cao nhất</Typography>
              <Box marginTop={1} />
            </>
          }


          <Box width='100%' display='flex' justifyContent='space-between'>
            <Box
              maxWidth='800px'
            >
              <CopyToClipboard text={_id} onCopy={() => enqueueSnackbar('Đã copy mã đơn', { variant: 'success' })}>
                <Button
                  size="small"
                  startIcon={<FileCopyOutlined />}
                >
                  Mã đơn
                </Button>
              </CopyToClipboard>

              {data.bship_code &&
                <Typography
                  color='primary'
                  style={{ fontWeight: 'bold' }}
                  variant='body2'
                ><span style={{ color: 'black' }}>Mã vận đơn:</span> {data.bship_code}</Typography>
              }

              {/**address */}
              {!!data.address && data.ship_method === 'BY_MONSTERS' && ['SHIPPING', 'COMPLETED'].includes(_status) &&
                <>
                  <Typography variant='body2'>
                    <b>Người nhận:</b> {data.address.name}
                  </Typography>
                  <Typography variant='body2' className={classes.label}>
                    <b>Địa chỉ:</b> {data.address.street}, {data.address.ward}, {data.address.district}, {data.address.province}
                  </Typography>
                  <Typography variant='body2'>
                    <b>Số điện thoại:</b> {phoneNumberWithSpace(data.address.mobile)}
                    {/* <br />
                    <b>Phí ship:</b> {numberWithCommas(data.address.ship_cost)}đ */}
                  </Typography>
                </>
              }

              {data.ship_method === 'BY_USER' && ['SHIPPING', 'COMPLETED'].includes(_status) &&
                <>
                  <Typography variant='body2'>
                    *Bạn gửi hàng đến Maxmin theo địa chỉ sau
                  </Typography>
                  <Box marginTop={1} />

                  <CustomButton
                    onClick={() => setOpenAddress(true)}
                    size='small'
                    variant='contained'
                    backgroundColor='white'
                  >
                    Danh sách địa chỉ {'>'}
                  </CustomButton>
                  <AddressPopup open={openAddress} onClose={() => setOpenAddress(false)} />
                </>
              }
            </Box>
            {(data.ship_method === 'BY_USER' || data.ship_method === 'BY_MONSTERS') &&
              <Box marginRight={2} />
            }
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='flex-end'
              flexDirection='column'
              minWidth='fit-content'
            >
              {_status === 'USER_APPROVAL' &&
                <Box
                  display='flex'
                  // justifyContent='flex-end'
                  flexDirection='column'
                  alignItems='flex-end'
                >
                  <CustomButton
                    variant='contained'
                    backgroundColor='yellow'
                    width='160px'
                    onClick={approveOrder}
                    size='small'
                    disabled={!checkClickApprovable}
                  >
                    Đồng ý với định giá
                  </CustomButton>
                  <Box marginTop={1} />
                  <CustomButton
                    variant='outlined'
                    onClick={cancelOrder}
                    size='small'
                    width='80px'
                  >
                    Hủy đơn
                  </CustomButton>
                </Box>
              }
              {_status === 'USER_SHIP_SELECT' &&
                <>
                  <Typography>
                    <span style={{ color: 'orange', fontWeight: 'bold', fontSize: '1.25rem' }}>{numberWithCommas(data.subtotal)}đ</span>
                  </Typography>
                  <Box marginTop={2} />
                  <CustomButton
                    variant='contained'
                    backgroundColor='yellow'
                    // height='40px'
                    width='120px'
                    size='small'
                    onClick={goShipDinhGia}
                  >
                    Chọn địa chỉ
                  </CustomButton>
                </>
              }
              {(_status === 'SHIPPING' || _status === 'COMPLETED') &&
                <>
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='flex-end'
                  >
                    {/* <Typography variant='body2' style={{ textAlign: 'end' }}>
                      <span style={{ fontWeight: 'bold' }}>{numberWithCommas(data.subtotal)}đ</span>
                      <br />
                      - {numberWithCommas(ship_cost)}đ
                      <br />
                      + <span style={{color: 'purple'}}>{numberWithCommas(ship_pcode_value)}đ</span>
                    </Typography> */}
                    <Typography variant='h6'>
                      <span style={{ color: 'orange', fontWeight: 'bold' }}>{numberWithCommas(total)}đ</span>
                    </Typography>
                    <CustomButton
                      size='small'
                      variant='contained'
                      backgroundColor='white'
                      endIcon={<ExpandMore />}
                      style={{ marginTop: theme.spacing(1) }}
                      onClick={() => setOpenSummary(true)}
                    >
                      Chi tiết
                    </CustomButton>
                    <OrderSummary
                      open={openSummary}
                      id={_id}
                      onClose={() => setOpenSummary(false)}
                    />
                  </Box>
                </>
              }
              {_status === 'MONSTERS_PRICING' && statPricing &&
                <Box
                  display='flex'
                  // justifyContent='flex-end'
                  flexDirection='column'
                  alignItems='flex-end'
                >
                  <Typography variant='caption' style={{ fontWeight: '500' }}>
                    <span style={{ color: 'purple', fontWeight: '600' }}>
                      <Visibility fontSize="inherit" />&nbsp;
                      {statPricing.VIEW}
                    </span> đã xem
                    <br />
                    <span style={{ color: 'orange', fontWeight: '600' }}>
                      <LocalOffer fontSize="inherit" />&nbsp;
                      {statPricing.PRICING}
                    </span> đang định giá
                    <br />
                    <span style={{ color: 'green', fontWeight: '600' }}>
                      <Done fontSize="inherit" />&nbsp;
                      {statPricing.PRICED}
                    </span> đã định giá

                  </Typography>
                  <Box mt={1} />
                  <CustomButton
                    variant='contained'
                    backgroundColor='yellow'
                    width='160px'
                    onClick={stopPricing}
                    size='small'
                    disabled={!statPricing.PRICED}
                  >
                    Dừng định giá
                  </CustomButton>
                </Box>
              }
              {_status === 'USER_RE_APPROVAL' &&
                <>
                  <CustomButton
                    variant='contained'
                    backgroundColor='yellow'
                    width='160px'
                    size='small'
                    onClick={reapproveOrder}
                  >
                    Đã phê duyệt xong
                  </CustomButton>
                </>
              }
            </Box>
          </Box>
        </Box>
      }
    </>
  )
}

export default DepositOrder
