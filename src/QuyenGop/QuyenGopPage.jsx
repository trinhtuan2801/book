import { Box, Divider, makeStyles, TextField, Typography } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { CustomButton } from "../CommonComponent/CustomButton"
import { BASE_API } from "../constants"
import UploadImageButton from "../NapCredit/UploadImageButton"
import { axiosPost } from "../ultils/axiosUtils"

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100]
  },
  submitButton: {
    width: '300px',
  }
}))

const QuyenGopPage = () => {
  const classes = useStyles()
  const [resetKey, setResetKey] = useState(true)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [bookPictures, setBookPictures] = useState([null])
  const { enqueueSnackbar } = useSnackbar()

  const resetState = () => {
    setResetKey(prev => !prev)
    // setName('')
    // setMobile('')
    // setAddress('')
    setBookPictures([null])
  }

  const addBook = async (e) => {
    e.preventDefault()
    if (!!!bookPictures[0]) {
      // setFbOpen(true)
      // setFbMessage('Bạn chưa thêm ảnh')
      // setFbSeverity('error')
      enqueueSnackbar('Bạn chưa thêm ảnh', { variant: 'error' })
      return
    }
    let response = await axiosPost(`${BASE_API}/donations/books`, {
      "name": "string",
      "mobile": "string",
      "address": "string",
      "images": bookPictures
    }, true)

    if (!response || response.code !== 200) {
      // setFbOpen(true)
      // setFbMessage('Lỗi kết nối')
      // setFbSeverity('error')
      enqueueSnackbar('Lỗi kết nối', { variant: 'error' })
      return
    }

    // setFbOpen(true)
    // setFbMessage('Thêm sách thành công')
    enqueueSnackbar('Thêm sản phẩm thành công', { variant: 'success' })
    // setFbSeverity('success')
    resetState()
  }
  const addBookPicture = (index) => (obj) => {
    console.log('add book picture')
    setBookPictures(prev => {
      let res = prev.slice()
      res[index] = obj
      return res
    })
  }
  const deleteBookPicture = (index) => () => {
    setBookPictures(prev => {
      let res = prev.slice()
      res[index] = null
      return res
    })
  }

  // const [fbOpen, setFbOpen] = useState(false)
  // const [fbMessage, setFbMessage] = useState('')
  // const [fbSeverity, setFbSeverity] = useState('')
  return (
    <>
      <Box
        className={classes.root}
        width='100%'
        height='fit-content'
        boxSizing='border-box'
        paddingTop={8}
        display='flex'
        flexDirection='column'
        alignItems='center'
        paddingX={2}
      >
        <Box
          width='100%'
          height='fit-content'
          boxSizing='border-box'
          style={{ backgroundColor: '#fff' }}
          marginTop={2}
          maxWidth='1480px'
        >

          {/*Main area */}
          <Box
            width='100%'
            height='fit-content'
            padding={3}
            boxSizing='border-box'
            style={{ backgroundColor: '#fff' }}
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
                Quyên góp
              </Typography>
            </Box>

            <Divider />
            <form onSubmit={addBook}>
              <Box
                width='100%'
                maxWidth='600px'
                marginTop={1}
              >

                <Box marginTop={2} />
                <TextField
                  label="Họ và tên"
                  fullWidth
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  type='search'
                />
                <Box marginTop={2} />
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  variant="outlined"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  type='number'
                  required
                />
                <Box marginTop={2} />
                <TextField
                  label="Địa chỉ"
                  fullWidth
                  variant="outlined"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  type='search'
                />

                <Box marginTop={1} />

                <Typography variant="h6" style={{ fontWeight: 400 }}>{'Hình ảnh'}</Typography>
                <Typography variant="body2" gutterBottom style={{ fontWeight: 400 }}>{'Bao gồm tất cả đồ bạn quyên góp'}</Typography>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  marginBottom={2}
                  marginTop={2}
                  flexWrap='wrap'
                  gridRowGap={10}
                >
                  <UploadImageButton
                    key={'quyen-gop-sach' + resetKey}
                    title={''}
                    index={0}
                    addBookPicture={addBookPicture(0)}
                    deleteBookPicture={deleteBookPicture(0)}
                    isPlus={true}
                  />
                </Box>

                <Box
                  marginTop={2}
                  marginBottom={2}
                >
                  <Divider />
                </Box>

                <Box
                  display='flex'
                  alignItems='center'
                >
                  <CustomButton
                    backgroundColor="yellow"
                    variant="contained"
                    className={classes.submitButton}
                    borderRadius='amazon'
                    type="submit"
                  >
                    Thêm
                  </CustomButton>
                </Box>


              </Box>
            </form>


          </Box>
        </Box>

      </Box>
    </>
  )
}

export default QuyenGopPage