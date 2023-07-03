import { Box, Typography } from "@material-ui/core"
import { useState } from "react"
import Carousel from "react-multi-carousel"
import { BASE_FILE } from "../../constants"

const responsive = {
  xl: {
    breakpoint: {
      max: 3000,
      min: 0
    },
    items: 1,
    partialVisibilityGutter: 0,
    slidesToSlide: 1
  },
}

const BookImageSmall = ({ bigImages=[], arrowColor }) => {

  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <>
      <Box
        width='100%'
        height='300px'
        position='relative'
      >
        <Carousel
          additionalTransfrom={0}
          autoPlay={false}
          shouldResetAutoplay={false}
          autoPlaySpeed={0}
          centerMode={false}
          draggable
          focusOnSelect={false}
          infinite={false}
          minimumTouchDrag={0}
          responsive={responsive}
          // showDots={true}
          // slidesToSlide={1}
          swipeable
          // renderDotsOutside={false}
          className={`slider arrow--invisible ${arrowColor}`}
          arrows={true}
          afterChange={(previousSlide, { currentSlide, onMove }) => {
            setCurrentSlide(currentSlide)
          }}
        >
          {bigImages.map(img =>
            <Box
              key={img}
              height='300px'
              width='100%'
              display='flex'
              justifyContent='center'
            >
              <img
                src={`${BASE_FILE}/${img}`}
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>
          )}

        </Carousel>
        <Box
          position='absolute'
          right='10px'
          bottom='10px'
          borderRadius='50px'
          width='fit-content'
          // height='20px'
          style={{background: 'rgba(255, 255, 255, 0.5)'}}
          // boxSizing='border-box'
          paddingY={0.2}
          paddingX={1.5}
        >
          <Typography>{currentSlide + 1}/{bigImages?.length}</Typography>
        </Box>
      </Box>
    </>
  )
}

export default BookImageSmall