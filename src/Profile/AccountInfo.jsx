import { Avatar, Box, Button, Divider, TextField, Typography, useMediaQuery } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useMemo } from "react"
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { CustomButton } from "../CommonComponent/CustomButton"
import { BASE_API, BASE_FILE } from "../constants"
import { refreshNavbar } from "../redux/rootReducer"
import { axiosGet, axiosPatch } from "../ultils/axiosUtils"
import useUploadImage from "../ultils/useUploadImage"

const AccountInfo = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [blob, setBlob] = useState(null)

  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const smallLayout = useMediaQuery('(max-width:615px)')
  const getUserInfo = async () => {
    setLoading(true)
    let response = await axiosGet(`${BASE_API}/users`, null, true)
    console.log('check login', response)
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
    setName(sanitized_data.name)
    setMobile(sanitized_data.mobile)
    setEmail(sanitized_data.email)
    setImage(sanitized_data.pimg?.large_url)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  const { largeURL, thumbURL, progress, loading: imageLoading } = useUploadImage(`${BASE_API}/imagefiles`, blob)

  useEffect(() => {
    if (!largeURL) return
    setImage(largeURL)
  }, [largeURL])

  const uploadPicture = (e) => {
    let blobFile = e.target.files[0]
    if (blobFile)
      setBlob(blobFile)
  }

  const update = async (e) => {
    e.preventDefault()

    if (largeURL && (largeURL !== data.pimg?.large_url)) {
      let response = await axiosPatch(`${BASE_API}/users/profile-image`, {
        "large_url": largeURL,
        "thumb_url": thumbURL
      }, true)

      if (!response || response.code !== 200) {
        openFeedBack(false, response?.message)
        return
      }
    }

    if (name !== data.name) {
      let response = await axiosPatch(`${BASE_API}/users`, {
        "field_name": "name",
        "value": name
      }, true)

      if (!response || response.code !== 200) {
        openFeedBack(false, response?.message)
        return
      }
    }

    if (mobile !== data.mobile) {
      let response = await axiosPatch(`${BASE_API}/users`, {
        "field_name": "mobile",
        "value": mobile
      }, true)

      if (!response || response.code !== 200) {
        openFeedBack(false, response?.message)
        return
      }
    }

    openFeedBack(true)
    dispatch(refreshNavbar())
    getUserInfo()
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
      name !== data?.name || mobile !== data?.mobile || image !== data?.pimg?.large_url
    )
  }, [name, mobile, image, data])
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
          Thông tin tài khoản
        </Typography>

      </Box>

      <Divider />
      <Box marginTop={2} />

      <Box width='100%' display='flex'>

        <Box flexGrow={1} >
          <form
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <TextField
                // required
                label="Email"
                fullWidth
                variant="outlined"
                // size="small"
                value={email}
                disabled
                size='small'
              />
              <Box marginTop={2} />

              <TextField
                required
                label="Tên"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                size='small'
              />
              <Box marginTop={2} />
              <TextField
                required
                label="Số điện thoại"
                fullWidth
                variant="outlined"
                type='number'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                size='small'
              />
              <Box marginTop={2} />
            </Box>

            <Box>
              {smallLayout &&
                <Box display='flex' flexDirection='column' marginBottom={2} alignItems='center'>
                  <Avatar src={`${BASE_FILE}/${image}`} style={{ width: 200, height: 200 }} />
                  <Box marginTop={2} />

                  <Button
                    variant='outlined'
                    component='label'
                    fullWidth
                  >
                    Tải ảnh
                    <input
                      accept="image/*"
                      type="file"
                      hidden
                      onChange={uploadPicture}
                    />
                  </Button>

                </Box>
              }

              <CustomButton
                type="submit"
                variant="contained"
                backgroundColor="yellow"
                // borderRadius='amazon'
                disabled={loading || imageLoading || !isFieldChanged}
                onClick={update}
                fullWidth
              >
                Cập nhật
              </CustomButton>
            </Box>

          </form>
        </Box>
        {!smallLayout &&
          <>
            <Box marginLeft={2} />
            <Divider orientation="vertical" flexItem />
            <Box marginLeft={2} />
            <Box display='flex' flexDirection='column' justifyContent='space-between'>
              <Avatar src={`${BASE_FILE}/${image}`} style={{ width: 200, height: 200 }} />
              <Box marginTop={2} />

              <Button variant='outlined' component='label'>
                Tải ảnh
                <input
                  accept="image/*"
                  type="file"
                  hidden
                  onChange={uploadPicture}
                />
              </Button>

            </Box>
          </>
        }

      </Box>



    </Box>
  )
}

export default AccountInfo