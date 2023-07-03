import { Box, IconButton, Typography, useMediaQuery } from "@material-ui/core";
import { FileCopyOutlined } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import CopyToClipboard from "react-copy-to-clipboard";

const ChuyenKhoan = ({ email }) => {
  const smallLayout = useMediaQuery('(max-width:560px)')
  // const [fbOpen, setFbOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

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
        >Lưu ý:</Typography> Sẽ mất khoảng 30 phút để cập nhật thông tin thanh toán sau khi người dùng thanh toán thành công.</i>
      </Typography>

      <Box
        marginTop={2}
      >
        <Typography variant="body1">Thông tin chủ tài khoản</Typography>
        {smallLayout ?
          <Box
            marginLeft={2}
            marginTop={2}
          >

            <Typography variant='body2' style={{ fontWeight: '600' }}>Số tài khoản</Typography>
            <Box marginTop={1} />
            <Typography variant='body2'>0320-1013-801-199</Typography>
            <Box marginTop={1} />
            <Typography variant='body2' style={{ fontWeight: '600' }}>Ngân hàng</Typography>
            <Box marginTop={1} />
            <Typography variant='body2'>MSB - Ngân hàng TMCP Hàng Hải Việt Nam</Typography>
            <Box marginTop={1} />
            <Typography variant='body2' style={{ fontWeight: '600' }}>Chủ sở hữu</Typography>
            <Box marginTop={1} />
            <Typography variant='body2'>LE CONG THANH</Typography>
            <Box marginTop={1} />
            <Typography variant='body2' style={{ fontWeight: '600' }}>Nội dung</Typography>
            <Box marginTop={1} />

            <Box display='flex'>
              <Typography variant='body2'>
                {`MAXMIN ${email?.replace('@', ' ')}`}
              </Typography>
              <Box marginLeft={1} />
              <CopyToClipboard text={`Maxmin ${email?.replace('@', ' ')}`} onCopy={() => enqueueSnackbar('Đã copy nội dung', { variant: 'success' })}>
                <IconButton size="small">
                  <FileCopyOutlined fontSize="10px" />
                </IconButton>
              </CopyToClipboard>

            </Box>

          </Box>
          :
          <Box
            display='flex'
            marginLeft={2}
            marginTop={2}
          >
            <Box>
              <Typography variant='body2'>Số tài khoản</Typography>
              <Box marginTop={1} />
              <Typography variant='body2'>Ngân hàng</Typography>
              <Box marginTop={1} />
              <Typography variant='body2'>Chủ sở hữu</Typography>
              <Box marginTop={1} />
              <Typography variant='body2'>Nội dung</Typography>
            </Box>
            <Box marginLeft={3} />
            <Box>
              <Typography variant='body2'>0320-1013-801-199</Typography>
              <Box marginTop={1} />
              <Typography variant='body2'>MSB - Ngân hàng TMCP Hàng Hải Việt Nam</Typography>
              <Box marginTop={1} />
              <Typography variant='body2'>LE CONG THANH</Typography>
              <Box marginTop={1} />
              <Box display='flex'>
                <Typography variant='body2'>
                  {`MAXMIN ${email?.replace('@', ' ')}`}
                </Typography>
                <Box marginLeft={1} />
                <CopyToClipboard text={`MBOOKS ${email?.replace('@', ' ')}`} onCopy={() => enqueueSnackbar('Đã copy nội dung', { variant: 'success' })}>
                  <IconButton size="small">
                    <FileCopyOutlined fontSize="10px" />
                  </IconButton>
                </CopyToClipboard>
              </Box>

            </Box>
          </Box>
        }
      </Box>
    </Box>
  )
}


export default ChuyenKhoan