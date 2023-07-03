import { Box, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@material-ui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_API } from "../../constants";
import { axiosGet } from "../../ultils/axiosUtils";
import { numberWithCommas } from "../../ultils/NumberUtils";
import useGetBalanceChange from "./useGetBalanceChange";

const BienDongSoDu = () => {

  const [userInfo, setUserInfo] = useState(null)
  const smallLayout = useMediaQuery('(max-width:615px)')

  useEffect(() => {
    const getUserInfo = async () => {
      let response = await axiosGet(`${BASE_API}/users`, null, true)
      if (!response) return
      setUserInfo(response.data)
    }
    getUserInfo()
  }, [])

  return (
    <Box
      width='100%'
      height='fit-content'
      padding={3}
      boxSizing='border-box'
      style={{ backgroundColor: '#fff' }}
      marginTop={2}
      maxWidth='1480px'
      id="bang-so-du"
    >
      <Box
        display={smallLayout ? 'block' : 'flex'}
        alignItems='center'
        justifyContent='space-between'
        marginBottom={1}
      >
        <Typography
          variant={smallLayout ? "h6" : 'h5'}
          style={{ fontWeight: '500' }}
          gutterBottom
        >
          Thông tin biến động số dư
        </Typography>
        <Typography>
          Số dư: <b>{numberWithCommas(userInfo?.credit)}đ</b>
        </Typography>
      </Box>

      <Divider />
      <Box marginTop={2} />

      <InfoTable />

    </Box>
  )
}

export default BienDongSoDu

function createUpDownTypo(value) {
  const str = value.toString()
  const isDown = str.includes('-')
  const sign = isDown ? '' : '+'
  return (
    <Typography style={{ color: isDown ? "red" : "green" }}>{sign}{numberWithCommas(value)}</Typography>
  )
}

const InfoTable = () => {

  const [offset, setOffset] = useState(0)
  const { loading, error, hasMore, data } = useGetBalanceChange(offset)

  const observer = useRef()

  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + 1)
        console.log('visible')
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  const getDate = (raw) => {
    let date = new Date(raw)
    let time = date.toLocaleString().split(',')[1]
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${time}`
  }

  return (
    <>
      <TableContainer component={Paper} style={{ maxHeight: '350px' }}>
        <Table size="small" aria-label="a dense table" stickyHeader >
          <TableHead>
            <TableRow>
              <TableCell>Thời gian</TableCell>
              <TableCell align="center">Nội dung</TableCell>
              <TableCell align="center">{'Số credit (vnđ)'}</TableCell>
              <TableCell align="center">{'Số dư sau (vnđ)'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{getDate(row.tchange)}</TableCell>
                <TableCell align="center">{row.content}</TableCell>
                <TableCell align="center">{createUpDownTypo(row.ncredit)}</TableCell>
                <TableCell align="center">{numberWithCommas(row.total_after_tran)}</TableCell>
              </TableRow>
            ))}
            {hasMore &&
              <TableRow innerRef={lastElementRef}>
                <TableCell>...</TableCell>
                <TableCell align="center">...</TableCell>
                <TableCell align="center">...</TableCell>
                <TableCell align="center">...</TableCell>
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
      {error && <Typography>Lỗi tải dữ liệu</Typography>}
    </>
  );
}