import { Box, Button, Dialog, Divider, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton } from "../CommonComponent/CustomButton";
import { BASE_API, WITHDRAW_CHOICES } from "../constants";
import { refreshNavbar } from "../redux/rootReducer";
import { axiosDelete, axiosGet, axiosPost } from "../ultils/axiosUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import useGetWithDrawHistory from "./useGetWithdrawHistory";
import { CustomDialogTitle, CustomDialogContent, CustomDialogActions } from '../CommonComponent/CommentPopup/CommentPopup'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],

  },
  submitButton: {
    width: '300px',
  },
  typeBoxActive: {
    border: '1px solid #e7a976',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    backgroundColor: '#fdf8f3',
    boxSizing: 'border-box'
  },
  typeBoxInActive: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    cursor: 'pointer',
    boxSizing: 'border-box'
  },

}))

const initExchangeInfo = {
  "ncredit": 0,
  "transfer_fee": 0,
  "exchange_rate": 0,
  "nvnd": 0
}

const RutTienPage = () => {
  const theme = useTheme()
  const classes = useStyles()
  const [userInfo, setUserInfo] = useState(null)
  const smallLayout = useMediaQuery('(max-width:780px)')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const [refreshTable, setRefreshTable] = useState(false)
  const [boxIndex, setBoxIndex] = useState(0)
  const [exchangeInfo, setExchangeInfo] = useState(initExchangeInfo)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const getUserInfo = async () => {
    let response = await axiosGet(`${BASE_API}/users`, null, true)
    if (!response) return
    setUserInfo(response.data)
    setRefreshTable(prev => !prev)
  }

  useEffect(() => {
    getUserInfo()
    getExchangeInfo(boxIndex)
  }, [])

  const getExchangeInfo = async (index) => {
    const response = await axiosGet(`${BASE_API}/users/payment-requests/exchange`, {
      ncredit: WITHDRAW_CHOICES[index].price
    }, true)

    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Không lấy được thông tin quy đổi', { variant: 'error' })
    }
    setExchangeInfo(response.data)
  }

  const onClickBoxType = (index) => (event) => {
    if (WITHDRAW_CHOICES[index].price <= userInfo.credit) {
      setBoxIndex(index)
      getExchangeInfo(index)
    }
    else {
      setBoxIndex(-1)
      setExchangeInfo(initExchangeInfo)
    }
  }

  const withdraw = async () => {
    let response = await axiosPost(`${BASE_API}/users/payment-requests`, {
      "ncredit": WITHDRAW_CHOICES[boxIndex].price
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Có lỗi', { variant: 'error' })
    } else {
      enqueueSnackbar(`Bạn đã tạo yêu cầu thành công`, { variant: 'success' })
      dispatch(refreshNavbar())
      getUserInfo()
    }
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
            id='scroll-to'
          >
            Rút tiền về tải khoản ngân hàng
          </Typography>
          {/* <Typography style={{ textAlign: 'end' }}>
                  <b>{numberWithCommas(userInfo.credit)}đ</b>
                </Typography> */}
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

        <Box marginTop={1} />

        <Typography variant='h6' style={{ fontWeight: 400 }}>Chọn mệnh giá</Typography>

        <Box
          width='100%'
          marginY={1}
          display='flex'
          flexWrap='wrap'
          gridColumnGap={10}
          gridRowGap={10}
        >
          {WITHDRAW_CHOICES.map((choice, index) => (
            <Box
              onClick={onClickBoxType(index)}
              className={boxIndex === index ? classes.typeBoxActive : classes.typeBoxInActive}
              width='130px'
              key={index}
            >
              <Typography
                component='div'
                style={{
                  fontWeight: boxIndex === index ? 'bold' : 'normal',
                  fontSize: '14px'
                }}>
                {choice.name}
              </Typography>
              <Typography
                component='div'
                style={{
                  fontWeight: boxIndex === index ? 'bold' : 'normal',
                  color: boxIndex === index ? '#a3331a' : 'black',
                  fontSize: '14px'
                }}>
                {numberWithCommas(choice.price)}đ
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography color="secondary" style={{ display: boxIndex !== -1 ? 'none' : 'block' }}>*Cần có số credit dư lớn hơn mệnh giá cần rút</Typography>

        <Box marginTop={2} />

        <Typography variant='h6' style={{ fontWeight: 400 }}>
          Thông tin chi tiết
        </Typography>

        <Box marginTop={1} display='flex' style={{
          border: '1px solid #00000050',
          width: 'fit-content',
          padding: theme.spacing(2),
          borderRadius: '4px'
        }}>
          <Typography variant="body2">
            Số credit rút:
            <br />
            Phí rút:
            <br />
            Phí chuyển khoản:
            <br />
            <b>Số tiền nhận về:</b>
          </Typography>
          <Box marginLeft={2} />
          <Typography variant="body2" style={{ textAlign: 'end' }}>
            {numberWithCommas(exchangeInfo.ncredit)}
            <br />
            {numberWithCommas(exchangeInfo.withdraw_fee)}
            <br />
            {numberWithCommas(exchangeInfo.transfer_fee)}
            <br />
            <b>{numberWithCommas(exchangeInfo.nvnd)}đ</b>
          </Typography>
        </Box>

        <Box marginTop={2} />

        <CustomButton
          size="small"
          backgroundColor="yellow"
          variant="contained"
          className={classes.submitButton}
          onClick={() => setOpenConfirmModal(true)}
          borderRadius='amazon'
          disabled={boxIndex === -1}
        >Rút tiền</CustomButton>

        <Box
          marginTop={2}
          marginBottom={2}
        >
          <Divider />
        </Box>

        <WithdrawTable key={`refresh-table-${refreshTable ? '1' : '0'}`} />

        <ConfirmModal
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          exchangeInfo={exchangeInfo}
          confirm={withdraw}
        />
      </Box>

    </Box>
  )
}

export default RutTienPage

const createStatusTypo = (status) => {
  switch (status) {
    case 'WAIT': return <span style={{ color: 'orange', fontWeight: '500' }}>Đợi kỳ thanh toán</span>
    case 'COMPLETED': return <span style={{ color: 'green' }}>Hoàn thành</span>
    default: return <></>
  }

}

const WithdrawTable = () => {
  const [offset, setOffset] = useState(0)
  const { loading, error, hasMore, data } = useGetWithDrawHistory(offset)

  const observer = useRef()
  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const getDate = (raw) => {
    let date = new Date(raw)
    let time = date.toLocaleString().split(',')[1]
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: `350px` }} >
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: '100px' }}>Ngày tạo</TableCell>
              <TableCell align="center" style={{ minWidth: '100px' }}>Credit rút</TableCell>
              {/* <TableCell align="center" style={{ minWidth: '100px' }}>Phí giao dịch</TableCell> */}
              <TableCell align="center" style={{ minWidth: '100px' }}>Tiền nhận về (VNĐ)</TableCell>
              <TableCell align="center" style={{ minWidth: '120px' }}>Trạng thái</TableCell>
              <TableCell align="center" style={{ minWidth: '150px' }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell style={{ minWidth: '100px' }}>{getDate(row.created_date)}</TableCell>
                <TableCell align="center" style={{ minWidth: '100px' }}>{numberWithCommas(row.ncredit)}</TableCell>
                {/* <TableCell align="center" style={{ minWidth: '100px' }}>{numberWithCommas(row.transfer_fee)}</TableCell> */}
                <TableCell align="center" style={{ minWidth: '100px' }}>{numberWithCommas(row.nvnd)}</TableCell>
                <TableCell align="center" style={{ minWidth: '120px' }}>{createStatusTypo(row.status)}</TableCell>
                <TableCell align="center" style={{ minWidth: '150px' }}>{row.note}</TableCell>
              </TableRow>
            ))}
            {hasMore &&
              <TableRow innerRef={lastElementRef}>
                <TableCell style={{ minWidth: '160px' }}>...</TableCell>
                <TableCell align="center" style={{ minWidth: '120px' }}>...</TableCell>
                <TableCell align="center" style={{ minWidth: '100px' }}>...</TableCell>
                <TableCell align="center" style={{ minWidth: '80px' }}>...</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>

      {!data.length && !loading && !error &&
        <Box marginTop={2} width='100%' display='flex' justifyContent='center'>
          <Typography variant="h5">Không có thông tin</Typography>
        </Box>
      }
      {!loading && error && <Typography>Lỗi tải dữ liệu</Typography>}
    </>
  )
}

const ConfirmModal = ({ open, onClose, exchangeInfo, confirm }) => {
  const smallLayout = useMediaQuery('(max-width:904px)')
  const theme = useTheme()
  return (
    <Dialog open={open} onClose={onClose} style={{ overscrollBehavior: 'contain' }} fullScreen={smallLayout}>
      <CustomDialogTitle onClose={onClose}>
        Xác nhận tạo yêu cầu
      </CustomDialogTitle>
      <CustomDialogContent dividers>
        <Box width='100%' >
          <Box width='100%' display='flex' justifyContent='space-between'>
            <Typography variant="body2" style={{ flexGrow: 1 }}>
              Số credit rút:
              <br />
              Phí rút:
              <br />
              Phí chuyển khoản:
              <br />
              <Divider style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }} />
              <b>Số tiền nhận về:</b>
            </Typography>
            <Typography variant="body2" style={{ textAlign: 'end' }}>
              {numberWithCommas(exchangeInfo.ncredit)}
              <br />
              {numberWithCommas(exchangeInfo.withdraw_fee)}
              <br />
              {numberWithCommas(exchangeInfo.transfer_fee)}
              <br />
              <Divider style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }} />
              <b>{numberWithCommas(exchangeInfo.nvnd)}đ</b>
            </Typography>
          </Box>
          <Box marginTop={1} />
          <Typography
            color='secondary'
            variant='body2'
            style={{ fontStyle: 'italic' }}
          >
            *Lưu ý: Khi đã xác nhận tạo yêu cầu rút tiền, bạn không thể hoàn lại credit!
          </Typography>
        </Box>

      </CustomDialogContent>
      <CustomDialogActions>
        <Button onClick={() => {
          confirm()
          onClose()
        }} color="secondary">
          Xác nhận
        </Button>
        <Button onClick={() => {
          onClose()
        }} >
          Hủy
        </Button>
      </CustomDialogActions>
    </Dialog >
  )


}