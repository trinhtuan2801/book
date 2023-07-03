import { Box, Dialog, IconButton, makeStyles, Typography } from "@material-ui/core"
import { Clear } from "@material-ui/icons"
import { useEffect, useState } from "react"
import { BASE_FILE } from "../constants"

const useStyles = makeStyles((theme) => ({
  halfImage: {
    objectFit: 'cover',
    width: '100%',
    height: '50px',
    objectPosition: 'top',
    cursor: 'pointer'
  },
  bigImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'top'
  },
  smallImage: {
    objectFit: 'cover',
    width: '60px',
    height: '60px',
    objectPosition: 'top',
    border: '1px solid grey',
    padding: '1px',
    cursor: 'pointer'
  },
  smallImageActive: {
    objectFit: 'cover',
    width: '60px',
    height: '60px',
    objectPosition: 'top',
    padding: '1px',
    cursor: 'pointer',
    border: '1px solid orange',
  },
  seeAllLabel: {
    cursor: 'pointer',
    '&:hover': {
      color: '#C7511F',
    }
  }

}))

export const SeeAllImageThumbnail = ({ smallImages, openDialog, hideLabel = false }) => {
  const classes = useStyles()

  return (
    <>
      <Box
        display='flex'
        width='100%'
        height='30px'
        justifyContent='flex-start'
        overflow='hidden'
        gridColumnGap={2}
      >
        {smallImages.slice(0, 4).map((img, index) => (
          <Box key={index} width='25%' boxSizing='border-box'>
            <img
              key={index}
              className={classes.halfImage}
              src={`${BASE_FILE}/${img}`}
              onClick={openDialog}
            />
          </Box>
        ))}
      </Box>
      {!hideLabel &&
        <Box
          alignSelf='flex-start'
          marginBottom={1}
        >
          <Typography
            color="primary"
            style={{ cursor: 'pointer' }}
            onClick={openDialog}
            variant='body2'
            className={classes.seeAllLabel}
          >
            Xem {smallImages.length} ảnh
          </Typography>
        </Box>
      }

    </>
  )
}


export const SeeAllImage = ({ bigImages = [], smallImages = [], open, onClose }) => {
  const classes = useStyles()
  const [imgIndex, setImgIndex] = useState(0)
  const [bigImg, setBigImg] = useState(null)

  useEffect(() => {
    setImgIndex(0)
    setBigImg(`${BASE_FILE}/${bigImages[0]}`)
  }, [bigImages])

  useEffect(() => {
    setBigImg(`${BASE_FILE}/${bigImages[imgIndex]}`)
  }, [imgIndex])

  const onClickImage = (index) => (e) => {
    setImgIndex(index)
  }


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='xl'>
        <Box
          width='fit-content'
          minWidth='820px'
          minHeight='500px'
        >
          <Box
            style={{ backgroundColor: '#EDEDED' }}
            height='50px'
            display='flex'
            alignItems='center'
            paddingLeft={2}
            paddingRight={1}
            justifyContent='space-between'
          >
            <Typography
              variant="caption"
              style={{ fontWeight: 500, fontSize: 15 }}
            >Ảnh ({smallImages.length})</Typography>

            <IconButton size="small" onClick={onClose}>
              <Clear fontSize="small" />
            </IconButton>
          </Box>
          <Box
            display='flex'
            padding={2}
            style={{ backgroundColor: 'fff' }}
            boxSizing='border-box'
            paddingLeft={10}
            paddingRight={5}
            width='100%'
            justifyContent='center'
          >
            <Box
              width='550px'
              height='550px'
              overflow='hidden'
              display='flex'
              justifyContent='center'
            >
              <img className={classes.bigImage} src={bigImg} />
            </Box>
            <Box marginLeft={6} />
            <Box
              id="4images"
              display='flex'
              height='fit-content'
              width='fit-content'
              maxWidth='300px'
              justifyContent='flex-start'
              flexWrap='wrap'
              gridColumnGap={5}
              gridRowGap={5}
            >
              {smallImages.map((img, index) => (
                <Box key={index} width='64px' height='64px' paddingLeft='5px' paddingBottom='5px'>
                  <img key={index} className={index === imgIndex ? classes.smallImageActive : classes.smallImage} src={`${BASE_FILE}/${img}`} onClick={onClickImage(index)} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}
