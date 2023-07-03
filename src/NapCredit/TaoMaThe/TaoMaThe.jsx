import { Box, Button, Dialog, Divider, IconButton, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@material-ui/core";
import { Delete, Visibility } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../CommonComponent/CustomButton";
import { BASE_API, GIFT_CARD_CHOICES } from "../../constants";
import { refreshNavbar } from "../../redux/rootReducer";
import { axiosDelete, axiosGet, axiosPost } from "../../ultils/axiosUtils";
import { numberWithCommas } from "../../ultils/NumberUtils";
import CardTemplateModal from "../CardTemplate/CardTemplateModal";
import useGetGiftHistory from "./useGetGiftHistory";

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


const TaoMaThe = () => {
  const classes = useStyles()
  const [userInfo, setUserInfo] = useState(null)
  const smallLayout = useMediaQuery('(max-width:780px)')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const [refreshTable, setRefreshTable] = useState(false)

  const getUserInfo = async () => {
    let response = await axiosGet(`${BASE_API}/users`, null, true)
    if (!response) return
    setUserInfo(response.data)
    setRefreshTable(prev => !prev)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  const [boxType, setBoxType] = useState(0)
  const onClickBoxType = (type) => (event) => {
    if (GIFT_CARD_CHOICES[type].price <= userInfo.credit) {
      setBoxType(type)
    }
    else {
      setBoxType(-1)
    }
  }

  const createGiftCard = async () => {
    let response = await axiosPost(`${BASE_API}/giftcards`, {
      "ncredit": GIFT_CARD_CHOICES[boxType].price
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Lỗi khi tạo thẻ', { variant: 'error' })
    } else {
      enqueueSnackbar(`Bạn đã tạo thành công thẻ quà tặng trị giá ${numberWithCommas(GIFT_CARD_CHOICES[boxType].price)}đ!`, { variant: 'success' })
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
            Tạo mã thẻ quà tặng
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

        <Typography variant='h6' style={{ fontWeight: 400 }}>Chọn thẻ quà tặng</Typography>

        <Box
          width='100%'
          marginY={1}
          display='flex'
          flexWrap='wrap'
          gridColumnGap={10}
          gridRowGap={10}
        >
          {GIFT_CARD_CHOICES.map((choice, index) => (
            <Box
              onClick={onClickBoxType(index)}
              className={boxType === index ? classes.typeBoxActive : classes.typeBoxInActive}
              width='130px'
              key={index}
            >
              <Typography
                component='div'
                style={{
                  fontWeight: boxType === index ? 'bold' : 'normal',
                  fontSize: '14px'
                }}>
                {choice.name}
              </Typography>
              <Typography
                component='div'
                style={{
                  fontWeight: boxType === index ? 'bold' : 'normal',
                  color: boxType === index ? '#a3331a' : 'black',
                  fontSize: '14px'
                }}>
                {numberWithCommas(choice.price)}đ
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography color="secondary" style={{ display: boxType !== -1 ? 'none' : 'block' }}>*Cần có số credit dư lớn hơn giá trị các thẻ quà tặng</Typography>

        <Box marginTop={2} />

        {/* <Button size="small" color="primary" variant="contained" className={classes.submitButton} onClick={submit}>Tạo</Button> */}
        <CustomButton
          size="small"
          backgroundColor="yellow"
          variant="contained"
          className={classes.submitButton}
          onClick={createGiftCard}
          borderRadius='amazon'
          disabled={boxType === -1}
        >Tạo</CustomButton>

        <Box
          marginTop={2}
          marginBottom={2}
        >
          <Divider />
        </Box>

        <GiftCodeTable key={`refresh-table-${refreshTable ? '1' : '0'}`} getUserInfo={getUserInfo} />
      </Box>

    </Box>
  )
}

export default TaoMaThe

const createStatusTypo = (status, word = '') => {

  switch (status) {
    case 'CREATED': return <span style={{ color: 'green' }}>{word ? word : 'Đã tạo'}</span>
    case 'USED': return <span style={{ color: 'black' }}>{word ? word : 'Đã dùng'}</span>
    default: return <></>
  }

}

const GiftCodeTable = ({ getUserInfo }) => {
  const [offset, setOffset] = useState(0)
  const { loading, error, hasMore, data } = useGetGiftHistory(offset)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openCardModal, setOpenCardModal] = useState(false)
  const [deleteCard, setDeleteCard] = useState(null)
  const [viewCard, setViewCard] = useState(null)
  const observer = useRef()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
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
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${time}`
  }

  const refund = async () => {
    let response = await axiosDelete(`${BASE_API}/giftcards/${deleteCard._id}`, null, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar('Thẻ không tại hoặc đã được hoàn', { variant: 'error' })
    } else {
      enqueueSnackbar(`Hủy thẻ thành công, bạn đã nhận lại ${numberWithCommas(deleteCard.ncredit)}đ`, { variant: 'success' })
      dispatch(refreshNavbar())
    }
    getUserInfo()
    setOpenDeleteModal(false)
    setOffset(0)
  }

  return (
    <>
      <Typography
        variant='subtitle2'
        style={{
          fontStyle: 'italic',
        }}
        color='textSecondary'
        gutterBottom
      >*Khi hủy thẻ, bạn sẽ nhận lại số credit đã dùng để tạo thẻ</Typography>
      { }
      <TableContainer component={Paper} style={{ maxHeight: `350px` }} >
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: '160px' }}>Ngày tạo</TableCell>
              <TableCell align="center" style={{ minWidth: '120px' }}>Mã thẻ</TableCell>
              <TableCell align="center" style={{ minWidth: '100px' }}>Giá trị (VNĐ)</TableCell>
              <TableCell align="center" style={{ minWidth: '80px' }}>Trạng thái</TableCell>
              <TableCell align="center" style={{ minWidth: '80px' }}>Hủy thẻ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell style={{ minWidth: '160px' }}>{getDate(row.created_date)}</TableCell>
                <TableCell align="center" style={{ minWidth: '100px' }}>
                  {row.status === 'USED' && createStatusTypo(row.status, row.code)}
                  {row.status === 'CREATED' &&
                    <>
                      {createStatusTypo(row.status, row.code.substr(0, 5) + '...')}
                      <IconButton
                        size='small'
                        style={{ color: 'green' }}
                        onClick={() => {
                          setOpenCardModal(true)
                          setViewCard({
                            ...row,
                            type: GIFT_CARD_CHOICES.find(choice => choice.price === row.ncredit)?.type
                          })
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </>
                  }
                </TableCell>
                <TableCell align="center" style={{ minWidth: '100px' }}>{createStatusTypo(row.status, numberWithCommas(row.ncredit))}</TableCell>
                <TableCell align="center" style={{ minWidth: '80px' }}>{createStatusTypo(row.status)}</TableCell>
                {row.status === 'CREATED' ?
                  <TableCell align="center" style={{ minWidth: '80px' }}>
                    <IconButton size='small' color='secondary' onClick={() => {
                      setOpenDeleteModal(true)
                      setDeleteCard(row)
                    }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                  :
                  <TableCell align="center" style={{ minWidth: '80px' }}>
                    <Box height='30px' />
                  </TableCell>
                }
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
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <Box
          boxSizing='border-box'
          width='300px'
        >
          <Typography variant="h5" style={{ paddingLeft: '16px', marginTop: '16px', fontWeight: '500' }}>
            Hủy thẻ
          </Typography>

          <Box width='100%' marginTop='12px' boxSizing='border-box' paddingX={2}>
            <Box
              display='flex'
              width='100%'
              boxSizing='border-box'
              padding={2}
              border='1px solid #00000055'
              borderRadius='4px'
            >
              <Typography variant='subtitle1'>
                Mã thẻ
                <br />
                Trị giá
              </Typography>
              <Box width='16px' />
              <Typography variant='subtitle1'>
                <span style={{ color: '#00000055' }}>|</span> &nbsp; {deleteCard?.code}
                <br />
                <span style={{ color: '#00000055' }}>|</span> &nbsp; {numberWithCommas(deleteCard?.ncredit)}đ
              </Typography>
            </Box>

          </Box>

          <Box display='flex' width='100%' marginTop={3} paddingX='16px'>
            <Button fullWidth color='primary' variant='contained' onClick={refund}>
              Đồng ý
            </Button>
            <Box width='20px' />
            <Button fullWidth variant='outlined' onClick={() => setOpenDeleteModal(false)}>
              Từ chối
            </Button>
          </Box>
          <Box marginTop='16px' />
        </Box>
      </Dialog>

      <CardTemplateModal
        open={openCardModal}
        onClose={() => setOpenCardModal(false)}
        code={viewCard?.code}
        oname={viewCard?.oname}
        ncredit={viewCard?.ncredit}
      />

      {!data.length && !loading && !error &&
        <Box marginTop={2} width='100%' display='flex' justifyContent='center'>
          <Typography variant="h5">Không có thông tin</Typography>
        </Box>
      }
      {!loading && error && <Typography>Lỗi tải dữ liệu</Typography>}
    </>
  )
}