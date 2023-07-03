import { Box, Button, Divider, Typography } from "@material-ui/core"
import { FileCopyOutlined } from "@material-ui/icons"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { BASE_API, RETURN_DEPOSIT_CART_STATUS_VN, RETURN_COLOR } from "../constants"
import { axiosGet, axiosPatch } from "../ultils/axiosUtils"
import ItemTable from "./ItemTable"
import { CustomButton } from "../CommonComponent/CustomButton"

const ReturnCart = ({
  _id,
  cb = () => { }
}) => {

  const [data, setData] = useState(null)
  const [items, setItems] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  const getData = async () => {
    const response = await axiosGet(`${BASE_API}/return-carts/${_id}`, null, true)
    if (!response || response.code !== 200) return
    const data = response.data
    console.log(_id, data)
    setData(data)
    setItems(data.items)
  }

  useEffect(() => {
    getData()
  }, [])

  const daNhanDu = async () => {
    const response = await axiosPatch(`${BASE_API}/return-carts/${_id}`, {
      "field_name": "status",
      "value": "COMPLETED"
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Có lỗi khi chuyển trạng thái', { variant: 'error' })
      return
    }
    enqueueSnackbar('Đơn đã hoàn thành', { variant: 'success' })
    setData(null)
  }

  const baoNhanThieu = async () => {
    window.open('https://www.messenger.com/t/107889521984861', '_blank')
  }

  return (
    <>
      {data &&
        <Box
          paddingY={2}
          style={{ backgroundColor: 'white' }}
          marginBottom={2}
        >
          <Box px={2}>
            <Typography component='div' variant='body2' style={{ color: RETURN_COLOR[data.status], fontWeight: 500 }}>{RETURN_DEPOSIT_CART_STATUS_VN[data.status]}</Typography>
          </Box>

          <Box mt={1} px={2}>
            <Box border='1px solid #00000030' borderRadius={4}>
              <ItemTable
                items={items}
              />
            </Box>
            <Box mt={1} />
            <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
              <CopyToClipboard text={_id} onCopy={() => enqueueSnackbar('Đã copy mã đơn', { variant: 'success' })}>
                <Button
                  size="small"
                  startIcon={<FileCopyOutlined />}
                >
                  Mã đơn
                </Button>
              </CopyToClipboard>

              {data.status === 'USER_RECEIVED' &&
                <Box display='flex' flexDirection='column'>
                  <CustomButton
                    variant='contained'
                    backgroundColor='yellow'
                    onClick={daNhanDu}
                    size='small'
                  // disabled={!checkClickApprovable}
                  >
                    Đã nhận đủ
                  </CustomButton>
                  <Box mt={1} />
                  <CustomButton
                    onClick={baoNhanThieu}
                    size='small'
                    variant='contained'
                    backgroundColor='white'
                  >
                    Báo nhận thiếu
                  </CustomButton>
                </Box>
              }

            </Box>

          </Box>
        </Box>
      }
    </>
  )
}

export default ReturnCart