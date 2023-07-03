import { Box, IconButton, Typography } from "@material-ui/core"
import { CameraAlt, Clear } from "@material-ui/icons"
import { useEffect } from "react"
import { useRef, useState } from "react"
import { BASE_API, BASE_FILE } from "../../constants"
import { axiosPost } from "../../ultils/axiosUtils"
import useUploadImage from "../../ultils/useUploadImage"
import LoadingCircle from "../LoadingCircle"

const UploadImageSection = ({ images = [], setImages }) => {

  const inputRef = useRef()
  const [image, setImage] = useState(null)

  const { largeURL, thumbURL, progress, loading } = useUploadImage(`${BASE_API}/imagefiles`, image)

  const uploadImage = async (e) => {
    if (!e.target.files) {
      return
    }

    const blobFile = e.target.files[0]
    e.target.value = ''
    let reader = new FileReader()
    setImage(blobFile)
    reader.onload = (e) => {
      setImages(prev => ([...prev, { thumb_url: e.target.result }]))
    }
    reader.readAsDataURL(blobFile)
    // let formData = new FormData()
    // formData.append('fileToUpload', blobFile)
    // let response = await axiosPost(`${BASE_API}/imagefiles`, formData, true)
    // if (!response || response.code !== 200) return
  }

  useEffect(() => {
    if (thumbURL && largeURL && !loading) {
      let arr = images.slice()
      arr[arr.length - 1] = {
        thumb_url: `${BASE_FILE}/${thumbURL}`,
        large_url: `${BASE_FILE}/${largeURL}`
      }
      setImages(arr)
    }
  }, [loading])

  return (
    <Box display='flex' gridGap={10} flexWrap='wrap' >
      {images.map((image, index) =>
        <Box
          key={image.thumb_url}
          minWidth='80px'
          minHeight='80px'
          width='80px'
          height='80px'
          position='relative'
        >
          <img
            src={`${image.thumb_url}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              objectPosition: 'center'
            }}
          />
          {loading && (index === images.length - 1) &&
            <Box width='100%' height='100%' position='absolute' left='0' top='0' display='flex' justifyContent='center' alignItems='center'>
              <LoadingCircle progress={progress} size={70} textColor='white'/>
            </Box>
          }
          <Box
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              backgroundColor: '#00000044',
              height: '20px',
              width: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setImages(prev => prev.filter(img => img !== image))}
          >
            <Clear
              style={{ color: 'white', fontSize: '18px' }}
            />
          </Box>
        </Box>
      )}
      {images.length < 4 &&
        <Box
          minWidth='80px'
          minHeight='80px'
          width='80px'
          height='80px'
          position='relative'
          border='1px dashed grey'
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          onClick={() => {
            if (!loading) inputRef.current.click()
          }}
          style={{ cursor: loading ? 'default' : 'pointer' }}
        >
          <CameraAlt fontSize="large" color={loading ? "disabled" : "primary"} />
          <Typography variant='body2' color='textSecondary'>{images.length}/4</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            hidden
            ref={inputRef}
          />
        </Box>
      }

    </Box>
  )

}

export default UploadImageSection