import { Box, Dialog, IconButton, Slide } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import React, { useState } from "react";
import BookImageSmall from "./BookImageSmall";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

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

const SeeAllImageSmall = ({ open, onClose, bigImages }) => {

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        TransitionComponent={Transition}
        variant="persistent"
        anchor='bottom'
      >
        <Box
          width='100vw'
          height='100%'
          style={{ backgroundColor: 'black' }}
          display='flex'
          flexDirection='column'
          position='relative'
        >
          <IconButton
            onClick={onClose}
            style={{ position: 'absolute', right: 0, top: 0 }}
          ><Clear fontSize='large' style={{ color: 'white' }} /></IconButton>
          <Box
            flexGrow={1}
            display='flex'
            alignItems='center'
          >
            <BookImageSmall bigImages={bigImages} arrowColor='white'/>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

export default SeeAllImageSmall