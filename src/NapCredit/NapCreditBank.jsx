import { Box, Divider, makeStyles, Radio, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_API } from "../constants";
import { refreshNavbar } from "../redux/rootReducer";
import { axiosGet, axiosPost } from "../ultils/axiosUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import ChuyenKhoan from "./Payment/ChuyenKhoan";
import NganLuong from "./Payment/NganLuong";
import { PayPal } from "./Payment/PayPal";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  typeBoxActive: {
    border: '1px solid #e7a976',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fdf8f3'
  },
  typeBoxInActive: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    cursor: 'pointer'
  },
}))

const choices = [
  {
    amount: 50000
  },
  {
    amount: 100000
  },
  {
    amount: 200000
  },
  {
    amount: 300000
  },
  {
    amount: 500000
  },
]

const NapCreditBank = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [method, setMethod] = useState(null)
  const [choice, setChoice] = useState(0)
  const [userInfo, setUserInfo] = useState(null)

  const getUserInfo = async () => {
    let response = await axiosGet(`${BASE_API}/users`, null, true)
    if (!response) return
    setUserInfo(response.data)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  let [searchParams] = useSearchParams()


  useEffect(() => {

    if (searchParams.get('order_code')) {
      const pay = async () => {
        let response = await axiosPost(`${BASE_API}/payments/notify`, {
          "paygate": "NGANLUONG",
          "error_code": searchParams.get('error_code'),
          "token": searchParams.get('token'),
          "order_code": searchParams.get('order_code'),
          "order_id": searchParams.get('order_id')
        }, true)
        if (!response || response.code !== 200) {
          return
        }
        dispatch(refreshNavbar())
        navigate(`/confirm?from=nap-credit-bank&amount=${response.data.amount}`)
      }
      pay()
    }
  }, [searchParams])

  return (
    <>
      {!!userInfo &&
        <Box
          className={classes.root}
          width='100%'
          height='fit-content'
          boxSizing='border-box'
          paddingTop={8}
          display='flex'
        >
          {/*Main area */}
          <Box
            width='100%'
            height='100%'
            padding={3}
            boxSizing='border-box'
            style={{ backgroundColor: '#fff' }}
            marginLeft={2}
            marginTop={2}
            marginRight={3}
          >
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography
                variant="h5"
                style={{ fontWeight: '500' }}
                gutterBottom
              >
                Nạp credit bằng thẻ ngân hàng
              </Typography>
              <Typography>
                Số dư: <b>{numberWithCommas(userInfo.credit)}đ</b>
              </Typography>
            </Box>

            <Divider />
            <Box marginTop={2} />

            <Typography variant="h6" style={{ fontWeight: 400 }}>Số credit muốn nạp (vnđ)</Typography>
            <Box
              width='100%'
              marginY={1}
              display='flex'
              flexWrap='wrap'
              gridColumnGap={10}
              gridRowGap={10}
            >
              {choices.map((obj, index) =>
                <Box
                  onClick={() => setChoice(index)}
                  className={choice === index ? classes.typeBoxActive : classes.typeBoxInActive}
                  width='150px'
                  height='50px'
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  paddingLeft={1}
                  boxSizing='border-box'
                >
                  <Typography
                    component='div'
                    style={{
                      fontWeight: choice === index ? 'bold' : 'normal',
                      color: choice === index ? '#a3331a' : 'black',
                      fontSize: '14px'
                    }}>
                    {numberWithCommas(obj.amount)}đ
                  </Typography>
                </Box>
              )}
            </Box>
            <Box marginTop={2} />
            <Typography variant="h6" style={{ fontWeight: 400 }}>Hình thức thanh toán</Typography>

            <Box
              display='flex'
              alignItems='center'
            >
              <Radio
                size="small"
                color="primary"
                checked={method === 'ngan-luong'}
                onClick={() => setMethod('ngan-luong')}
              />
              <Typography
                display="inline"
                onClick={() => setMethod('ngan-luong')}
                style={{ cursor: 'pointer' }}
              >
                Thẻ ATM ngân hàng nội địa qua Ngân lượng
              </Typography>
            </Box>

            {method === 'ngan-luong' && <NganLuong amount={choices[choice].amount} />}

            <Box
              display='flex'
              alignItems='center'
            >
              <Radio
                size="small"
                color="primary"
                checked={method === 'paypal'}
                onClick={() => setMethod('paypal')}
                disabled
              />
              <Typography
                display="inline"
                // onClick={() => setMethod('paypal')}
                // style={{ cursor: 'pointer' }}
                color="textSecondary"
              >
                Thẻ VISA, MASTER qua PayPal (Đang phát triển)
              </Typography>
            </Box>

            {method === 'paypal' && <PayPal product={{
              price: Number(choices[choice].amount),
              description: `Nạp ${Number(choices[choice].amount)}đ`,
              name: `${Number(choices[choice].amount)}đ`
            }} />}

            <Box
              display='flex'
              alignItems='center'
            >
              <Radio
                size="small"
                color="primary"
                checked={method === 'chuyen-khoan'}
                onClick={() => setMethod('chuyen-khoan')}
              />
              <Typography
                display="inline"
                onClick={() => setMethod('chuyen-khoan')}
                style={{ cursor: 'pointer' }}
              >
                Chuyển khoản trực tiếp (cần 30 phút để cập nhật)
              </Typography>
            </Box>

            {method === 'chuyen-khoan' && <ChuyenKhoan email={userInfo?.email} />}

          </Box>
        </Box>
      }
    </>
  )
}

export default NapCreditBank