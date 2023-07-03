import { Box, Button, Dialog, Divider, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { useEffect } from "react"
import { useState } from "react"
import { DialogActions, CustomDialogContent, CustomDialogTitle } from "../CommonComponent/CommentPopup/CommentPopup"
import { CustomButton } from "../CommonComponent/CustomButton"
import { BASE_API } from "../constants"
import { axiosGet } from "../ultils/axiosUtils"
import { numberWithCommas } from "../ultils/NumberUtils"

const OrderSummary = ({ open, onClose, id }) => {
  const smallLayout = useMediaQuery('(max-width:904px)')
  const theme = useTheme()
  const [data, setData] = useState(null)

  const getData = async (id) => {
    const response = await axiosGet(`${BASE_API}/deposit-carts/${id}/summary`, null, true)
    console.log(response)

    if (!response || response.code !== 200) return
    setData(response.data)
  }

  useEffect(() => {
    getData(id)
  }, [id])

  return (
    <Dialog open={open} onClose={onClose} style={{ overscrollBehavior: 'contain' }} fullScreen={smallLayout}>
      <CustomDialogTitle onClose={onClose}>
        Chi tiết đơn
      </CustomDialogTitle>
      <CustomDialogContent dividers>
        <Box width='100%' minWidth={smallLayout ? '0px' : '400px'}>
          <Box width='100%' display='flex' justifyContent='space-between'>
            <Typography variant="body2" style={{ flexGrow: 1 }} component='div'>
              Tổng giá trị hàng:
              <br />
              Credit có thể sử dụng ngay:
              <br />
              Credit treo:
              <br />
              Phí ship:
              <br />
              Phí dịch vụ:
              <br />
              {data?.ship_pcode_value > 0 &&
                <>
                  Khuyến mại:
                  <br />
                </>
              }
              <Divider style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }} />
              <b>Credit được cộng ngay:</b>
              {data?.suspended_price > 0 &&
                <>
                  <br />
                  Tổng credit được cộng khi không còn item treo:
                </>
              }
            </Typography>
            <Typography variant="body2" style={{ textAlign: 'end' }} component='div'>
              {numberWithCommas(data?.cprice)}
              <br />
              {numberWithCommas(data?.active_price)}
              <br />
              {numberWithCommas(data?.suspended_price)}
              <br />
              {numberWithCommas(data?.ship_cost)}
              <br />
              {numberWithCommas(data?.service_fee)}
              <br />
              {data?.ship_pcode_value > 0 &&
                <>
                  {numberWithCommas(data?.ship_pcode_value)}
                  <br />
                </>
              }
              <Divider style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }} />
              <b>{numberWithCommas(data?.active_add)}</b>
              {data?.suspended_price > 0 &&
                <>
                  <br />
                  {numberWithCommas(data?.active_add + data?.suspended_price)}
                </>
              }
            </Typography>
          </Box>
        </Box>
      </CustomDialogContent>
    </Dialog >
  )
}

export default OrderSummary