import { Box, makeStyles } from "@material-ui/core";
import { useState } from "react";
import { BASE_FILE } from "../constants";
import { SeeAllImage, SeeAllImageThumbnail } from "./SeeAllImage";

const useStyles = makeStyles((theme) => ({
  bigImage: {
    objectFit: 'cover',
    width: 'auto',
    height: '100%',
    objectPosition: 'top',
    cursor: 'pointer'
  }
}))

// const smallimages = new Array(4).fill(smallimage)

const BookImage = ({ bigImages, smallImages }) => {
  const classes = useStyles()
  const [openSeeAllImage, setOpenSeeAllImage] = useState(false)

  return (
    <Box
      name="book-image"
      width='300px'
      height='fit-content'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignItems='center'
    >
      <Box
        width='300px'
        height='440px'
        boxShadow='0px 0px 15px 0px grey'
        display='flex'
        justifyContent='center'
        overflow='hidden'
      >
        <img
          className={classes.bigImage}
          src={`${BASE_FILE}/${bigImages[0]}`}
          onClick={() => setOpenSeeAllImage(true)}
        />
      </Box>
      <Box mt={2} />
      <SeeAllImageThumbnail
        openDialog={() => setOpenSeeAllImage(true)}
        smallImages={smallImages}
      />
      <SeeAllImage
        open={openSeeAllImage}
        onClose={() => setOpenSeeAllImage(false)}
        bigImages={bigImages}
        smallImages={smallImages}
      />
    </Box>
  )
}

export default BookImage
{/* <Box
  id="4images"
  display='flex'
  width='100%'
  height='60px'
  marginTop={2}
  justifyContent='space-between'
>
  {smallimages.map((img, index) => (
    <img key={index} className={classes.smallImage} src={img.src} />
  ))}
</Box>
<Box alignSelf='flex-start' marginBottom={1}>
  <Typography color="primary" style={{ cursor: 'pointer' }}>See all 4 images</Typography>
</Box> */}