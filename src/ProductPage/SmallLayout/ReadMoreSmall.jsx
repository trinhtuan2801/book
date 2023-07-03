import { Box, makeStyles, Typography } from "@material-ui/core"
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import { useEffect, useRef, useState } from "react"
import { getElementOffset } from "../../ultils/ScrollToTop"
import useIsFirstRender from "../../ultils/useIsFirstRender"

const useStyles = makeStyles((theme) => ({
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    visibility: 'visible',
  },
  boxHide: {
    height: '100px',
    overflow: 'hidden'
  },
  boxShow: {
    height: 'fit-content',
    overflowX: 'scroll'
  }
}))

const ReadMoreSmall = ({ content }) => {
  const classes = useStyles()
  const [readmore, setReadmore] = useState(false)
  const scrollRef = useRef()

  const onClickReadmore = () => {
    if (readmore) {
      setTimeout(() => {
        window.scrollTo({ behavior: 'smooth', top: getElementOffset(scrollRef.current) - 200 })
      }, 0)
    }

    setReadmore(prev => !prev)
  }


  return (
    <>
      <Box
        width='100%'
      >
        <div ref={scrollRef} />
        <Box
          width='100%'
          maxWidth='100%'
          height='fit-content'
          style={{ overflowX: 'scroll' }}
          paddingX={1}
          boxSizing='border-box'
          className={readmore ? classes.boxShow : classes.boxHide}
        >
          <Typography
            component='div'
            style={{ fontSize: '14px' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />

        </Box>
        <Box
          display='flex'
          alignItems='center'
          onClick={onClickReadmore}
          justifyContent='center'
          style={{ fontSize: '14px', color: 'orange' }}
          marginTop={1}
          position='relative'
        >
          <Typography component='div' variant="body2" >{readmore ? 'Thu gọn' : 'Đọc thêm'}</Typography>
          <Box marginLeft={1} />
          {readmore ? <ExpandLess /> : <ExpandMore />}
          <Box
            display={readmore ? 'none' : 'block'}
            position='absolute'
            top='-45px'
            height='40px'
            width='100%'
            style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0),#fff)' }}
          />
        </Box>
      </Box>
    </>
  )
}

export default ReadMoreSmall