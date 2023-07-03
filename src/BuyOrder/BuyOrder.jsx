import { Box, Button, Divider, makeStyles, Typography } from "@material-ui/core"
import { FileCopyOutlined } from "@material-ui/icons"
import { useSnackbar } from "notistack"
import { Fragment, useEffect, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { useNavigate, useParams } from "react-router-dom"
import { BASE_API, BUY_COLOR, BUY_STATUS_VN } from "../constants"
import { axiosGet, axiosPatch } from "../ultils/axiosUtils"
import { numberWithCommas, phoneNumberWithSpace } from '../ultils/NumberUtils'
import BuyOrderItem from "./BuyOrderItem"
import { CustomButton } from "../CommonComponent/CustomButton"
import ReturnBuyDialog from "./ReturnBuyDialog/ReturnBuyDialog"

const useStyles = makeStyles((theme) => ({
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
}))
const hide_cancel_status = ['USER_RECEIVED', 'COMPLETED', 'REJECTED', 'CANCELLED', 'ORDERED']

const BuyOrder = ({
  _id,
  _status,
  url_status,
  hidden = false
}) => {
  const classes = useStyles()
  const { status } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [openReturnDialog, setOpenReturnDialog] = useState(false)


  const [data, setData] = useState(null)
  const [items, setItems] = useState([])
  const getItems = async () => {
    const response = await axiosGet(`${BASE_API}/carts/${_id}`, null, true)
    if (!response) return
    console.log('buy order detail', response.data)
    setData(response.data)
    setItems(response.data.items)
  }

  useEffect(() => {
    if (_status === 'COMPLETED' && url_status === '*') return
    if (hidden) return
    getItems()
  }, [_id])

  const cancelOrder = async () => {
    let response = await axiosPatch(`${BASE_API}/carts/${_id}`, {
      "field_name": "status",
      "value": "CANCELLED"
    }, true)
    if (response && response.code === 200) setData(null)
  }

  const completeOrder = async () => {
    let response = await axiosPatch(`${BASE_API}/carts/${_id}`, {
      "field_name": "status",
      "value": "COMPLETED"
    }, true)
    if (response && response.code === 200) setData(null)
  }

  return (
    <>
      {!!data &&
        <Box
          width='100%'
          padding={2}
          style={{ backgroundColor: 'white' }}
          boxSizing='border-box'
          id={_id}
          marginBottom={2}
        >
          <Box display='flex' alignItems='center' width='100%' position='relative'>
            <Typography component='div' variant='body2' style={{ color: BUY_COLOR[_status], fontWeight: 500 }}>{BUY_STATUS_VN[_status]}</Typography>

          </Box>

          <Box marginTop={2} />
          <Divider />

          <Box>
            {items.map((item) => (
              <Fragment
                key={item._id}
              >
                <Box marginTop={1} />
                <BuyOrderItem
                  authors={item.authors}
                  otype={item.otype}
                  price={item.price}
                  quantity={item.quantity}
                  thumb_url={item.thumb_url}
                  title={item.title}
                  url_key={item.url_key}
                  _id={item._id}
                />
                <Box marginTop={1} />
                <Divider />
              </Fragment>
            ))}
          </Box>

          <Box marginTop={1} />

          <Box width='100%' display='flex' justifyContent='space-between'>
            <Box maxWidth='800px'>
              <CopyToClipboard text={_id} onCopy={() => enqueueSnackbar('Đã copy mã đơn', { variant: 'success' })}>
                <Button
                  size="small"
                  startIcon={<FileCopyOutlined />}
                >
                  Mã đơn
                </Button>
              </CopyToClipboard>
              {!!data.address &&
                <>
                  <Typography variant='body2'>
                    <b>Người nhận:</b> {data.address.name}
                  </Typography>
                  <Typography variant='body2' className={classes.label}>
                    <b>Địa chỉ:</b> {data.address.street}, {data.address.ward}, {data.address.district}, {data.address.province}
                  </Typography>
                  <Typography variant='body2'>
                    <b>Số điện thoại:</b> {phoneNumberWithSpace(data.address.mobile)}
                    <br />
                    <b>Phí ship:</b> {numberWithCommas(data.ship_cost)}đ

                    {!!data.pship_value &&
                      <span style={{ color: 'purple' }}>
                        <br />
                        <b >Freeship:</b> {numberWithCommas(data.pship_value)}đ
                      </span>
                    }
                    {!!data.pvalue_value &&
                      <span style={{ color: 'purple' }}>
                        <br />
                        <b >Giảm giá:</b> {numberWithCommas(data.pvalue_value)}đ
                      </span>
                    }
                  </Typography>
                </>
              }
            </Box>
            <Box marginLeft={1} />
            <Box display='flex' flexDirection='column'>
              <Box
                display='flex'
                flexDirection='column'
                alignItems='flex-end'
              >
                <Typography variant='h6'>
                  <span style={{ color: 'orange', fontWeight: 'bold' }}>{numberWithCommas(data.total)}đ</span>
                </Typography>
              </Box>


              {!hide_cancel_status.includes(_status) &&
                <>
                  <Box marginTop={2} />

                  <Button
                    variant='outlined'
                    onClick={cancelOrder}
                    style={{ height: '30px' }}
                    size='small'
                  >
                    Hủy đơn
                  </Button>
                </>
              }

              {status === 'USER_RECEIVED' &&
                <>
                  <Box mt={1} />
                  <CustomButton
                    variant='contained'
                    backgroundColor='yellow'
                    width='110px'
                    size='small'
                  >
                    Hoàn thành
                  </CustomButton>
                  <Box mt={1} />
                  <CustomButton
                    variant='outlined'
                    size='small'
                    onClick={() => setOpenReturnDialog(true)}
                  >
                    Trả hàng
                  </CustomButton>
                  <ReturnBuyDialog
                    open={openReturnDialog}
                    onClose={() => setOpenReturnDialog(false)}
                    items={items}
                    cb={completeOrder}
                  />
                </>
              }

            </Box>
          </Box>
        </Box>
      }
    </>
  )
}

export default BuyOrder