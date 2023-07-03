import { Box, Divider, TextField, Typography, useMediaQuery } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { CustomButton } from "../CommonComponent/CustomButton"
import { BASE_API } from "../constants"
import { refreshNavbar } from "../redux/rootReducer"
import { axiosGet, axiosPatch } from "../ultils/axiosUtils"

const BankManage = () => {
  const [loading, setLoading] = useState(false)
  const smallLayout = useMediaQuery('(max-width:615px)')
  const [data, setData] = useState(null)
  const [accNum, setAccNum] = useState('')
  const [accOwner, setAccOwner] = useState('')
  const [bankName, setBankName] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()

  useEffect(() => {
    getBankInfo()
  }, [])

  const getBankInfo = async () => {
    setLoading(true)
    let response = await axiosGet(`${BASE_API}/users/bank-acc`, null, true)
    setLoading(false)
    if (!response || response.code !== 200) return
    const data = response.data
    const sanitized_data = {}
    for (const key in data) {
      const value = data[key]
      if (value === null)
        sanitized_data[key] = ''
      else
        sanitized_data[key] = value
    }
    setData(sanitized_data)
    setAccNum(sanitized_data.acc_num)
    setAccOwner(sanitized_data.acc_owner)
    setBankName(sanitized_data.bank_name)
  }

  const update = async (e) => {
    e.preventDefault()

    if (accNum !== data?.acc_num || accOwner !== data?.acc_owner || bankName !== data?.bank_name) {
      let response = await axiosPatch(`${BASE_API}/users/bank-acc`, {
        "acc_num": accNum,
        "bank_name": bankName,
        "acc_owner": accOwner
      }, true)

      if (!response || response.code !== 200) {
        openFeedBack(false, response?.message)
        return
      }
    }

    openFeedBack(true)
    dispatch(refreshNavbar())
    getBankInfo()
  }

  const openFeedBack = (success, message = '') => {
    if (success) {
      enqueueSnackbar(message || 'Cập nhật thành công', { variant: 'success' })
    }
    else {
      enqueueSnackbar(message || 'Cập nhật không thành công', { variant: 'error' })
    }
  }

  const isFieldChanged = useMemo(() => {
    return (
      accNum !== data?.acc_num || accOwner !== data?.acc_owner || bankName !== data?.bank_name
    )
  }, [accNum, accOwner, bankName, data])

  return (
    <Box
      width='100%'
      height='fit-content'
      padding={3}
      boxSizing='border-box'
      style={{ backgroundColor: '#fff' }}
      marginTop={2}
      maxWidth='1480px'
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Typography
          variant={smallLayout ? "h6" : 'h5'}
          style={{ fontWeight: '500' }}
          gutterBottom
        >
          Tài khoản ngân hàng
        </Typography>

      </Box>

      <Divider />
      <Box marginTop={2} />
      <Box>
        <form>
          <TextField
            label="Số tài khoản"
            fullWidth
            variant="outlined"
            value={accNum}
            onChange={(e) => setAccNum(e.target.value)}
            size='small'
          />
          <Box marginTop={2} />
          <TextField
            label="Chủ tài khoản"
            fullWidth
            variant="outlined"
            value={accOwner}
            onChange={(e) => setAccOwner(e.target.value)}
            size='small'
          />
          <Box marginTop={2} />
          <TextField
            label="Tên ngân hàng"
            fullWidth
            variant="outlined"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            size='small'
          />
          <Box marginTop={2} />

          <CustomButton
            type="submit"
            variant="contained"
            backgroundColor="yellow"
            disabled={loading || !isFieldChanged}
            onClick={update}
            fullWidth
          >
            Cập nhật
          </CustomButton>
        </form>
      </Box>

    </Box>
  )
}

export default BankManage