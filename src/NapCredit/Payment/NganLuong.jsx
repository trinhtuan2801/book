import { Box, Radio, Typography } from "@material-ui/core";
import { useState } from "react";
import { CustomButton } from "../../CommonComponent/CustomButton";
import { BASE_API } from "../../constants";
import Loading from "../../Loading";
import { axiosPost } from "../../ultils/axiosUtils";
import "./_nganLuong.scss";

const bank_ids = ['VCB', 'TCB', 'MB', 'VIB', 'ICB', 'EXB', 'ACB', 'HDB', 'MSB', 'NVB', 'DAB', 'SHB', 'OJB', 'TPB', 'PGB', 'BIDV', 'AGB', 'SCB', 'VPB', 'VAB', 'GPB', 'SGB', 'NAB', 'BAB']

const banks = bank_ids.map(id => ({ id }))

const NganLuong = ({ amount }) => {
  const [bankId, setBankId] = useState(null)
  const [loading, setLoading] = useState(false)
  const thanhToan = async () => {
    setLoading(true)
    let response = await axiosPost(`${BASE_API}/payments/credit-additions`, {
      "paygate": "NGANLUONG",
      "bank_code": bankId,
      "amount": amount
    }, true)
    setLoading(false)
    if (!response || response.code !== 200) {
      alert(response.message || 'Không thực hiện được giao dịch')
      return
    }
    window.open(response.data.checkout_url, '_blank')
  }

  return (
    <Box
      height='fit-content'
      padding={2}
      border={1}
      borderColor='#C4C4C4'
      borderRadius={5}
      maxWidth='80%'
      marginLeft={1}
      marginTop={1}
    >
      <Typography
        variant='caption'
        component='div'
      >
        <i><Typography
          display='inline'
          variant="inherit"
          color="secondary"
          style={{ textDecoration: 'underline' }}
        >Lưu ý:</Typography> Bạn cần đăng ký Internet-Banking hoặc dịch vụ thanh toán trực tuyến tại ngân hàng trước khi thực hiện.</i>
      </Typography>

      <Box
        marginTop={2}
        width='fit-content'
        display='flex'
        flexWrap='wrap'
        gridRowGap={30}
        gridColumnGap={30}
        paddingLeft={5}
      >
        {banks.map((bank, index) => (
          <Box
            key={index}
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <i
              className={bank.id}
              onClick={() => setBankId(bank.id)}
              style={{ cursor: 'pointer' }}
            />
            <Radio
              id={`radio-bank-${bank.id}`}
              size="small"
              checked={bankId === bank.id}
              onClick={() => setBankId(bank.id)}
              color='primary'
            />
          </Box>
        ))}
      </Box>
      <Box marginTop={2}>
        <CustomButton
          variant="contained"
          size='small'
          backgroundColor='yellow'
          disabled={bankId === null}
          style={{
            maxWidth: '100%',
            width: '300px'
          }}
          borderRadius='amazon'
          onClick={thanhToan}
        >
          Thanh toán
        </CustomButton>
      </Box>
      
      {loading && <Loading/>}
    </Box>
  )
}


export default NganLuong