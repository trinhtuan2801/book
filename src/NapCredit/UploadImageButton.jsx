import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import { AddAPhotoRounded, Clear } from "@material-ui/icons";
import { useRef } from "react";
import { useEffect, useState } from "react";
import LoadingCircle from "../CommonComponent/LoadingCircle";
import { BASE_API, BASE_FILE } from "../constants";
import useUploadImage from "../ultils/useUploadImage";

const useStyles = makeStyles(theme => ({
  pictureBox: {
    background: `linear-gradient(to top, ${theme.palette.grey[400]}, ${theme.palette.grey[100]})`,
    cursor: 'pointer'
  },
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'fill',
    objectPosition: 'center',
  }
}))


const UploadImageButton = ({
  onUpload = () => { },
  onDelete = () => { },
  title
}) => {
  const classes = useStyles()

  const [image, setImage] = useState(null)
  const { largeURL, thumbURL, progress, loading } = useUploadImage(`${BASE_API}/imagefiles`, image)
  const inputRef = useRef()

  const uploadPicture = async (e) => {
    if (!e.target.files[0]) return
    let blobFile = e.target.files[0]
    setImage(blobFile)
  }

  useEffect(() => {
    if (thumbURL) {
      onUpload({
        large_url: largeURL,
        thumb_url: thumbURL
      })
    }
  }, [thumbURL])

  const deletePicture = () => {
    onDelete()
    setImage(null)
    inputRef.current.value = null
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='fit-content'
      height='fit-content'
      position='relative'
    >
      {!!image &&
        <IconButton
          size='small'
          style={{ position: 'absolute', right: 5, top: 5, zIndex: 1, backgroundColor: 'white' }}
          onClick={deletePicture}
        ><Clear /></IconButton>
      }

      <input
        accept="image/*"
        type="file"
        hidden
        onChange={uploadPicture}
        ref={inputRef}
      />
      <Box
        className={classes.pictureBox}
        width={150}
        height={150}
        border={2}
        borderColor='grey.100'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        onClick={() => inputRef.current.click()}
      >

        {!!image && !!thumbURL && !loading &&
          <img src={`${BASE_FILE}/${thumbURL}`} className={classes.img} />
        }
        {!image && !thumbURL && !loading &&
          <>
            <AddAPhotoRounded />
            <Typography variant='caption' component='div'>Upload</Typography>
          </>
        }
        {loading &&
          <LoadingCircle progress={progress} />
        }

      </Box>

      {title &&
        <Typography variant='body2' component='div' style={{ maxWidth: '140px', textAlign: 'center', marginTop: '4px' }}>({title})</Typography>
      }
    </Box >
  )
}


export default UploadImageButton