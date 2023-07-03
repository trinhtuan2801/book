import { Box, makeStyles, Typography } from "@material-ui/core"
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import { useRef } from "react"
import { useEffect, useState } from "react"
import { getElementOffset } from "../ultils/ScrollToTop"
import useIsFirstRender from '../ultils/useIsFirstRender'
const useStyles = makeStyles((theme) => ({
  readmore: {
    height: props => props.isMobile ? '100px' : '200px',
    overflow: 'hidden',
    paddingTop: theme.spacing(1),
  },
  readless: {
    height: 'fit-content',
    paddingTop: theme.spacing(1),
  }
}))

const ReadMoreBox = ({ content, isMobile }) => {
  const classes = useStyles({ isMobile })
  const [readmore, setReadmore] = useState(false)
  const scrollRef = useRef()

  const onClickReadmore = () => {
    if (readmore) {
      setTimeout(() => {
        window.scrollTo({ behavior: 'smooth', top: getElementOffset(scrollRef.current) - 100 })
      }, 0)
    }

    setReadmore(prev => !prev)
  }

  return (
    <Box
      position='relative'
      width='100%'
      style={{ overflowX: 'scroll' }}
      className={isMobile ? '' : 'custom-scroll-bar'}
    >
      <div ref={scrollRef} />
      <Box
        className={readmore ? classes.readless : classes.readmore}
      >
        <Typography component='div' variant="body1" style={{ fontSize: '14px' }}>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </Typography>
      </Box>

      <Box
        display={readmore ? 'none' : 'block'}
        position='absolute'
        top='150px'
        height='50px'
        width='100%'
        style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0),#fff)' }}
      />

      <Box
        display='flex'
        alignItems='center'
        onClick={onClickReadmore}
        style={{ cursor: 'pointer' }}
      >
        {readmore ? <ExpandLess /> : <ExpandMore />}
        <Box marginLeft={1} />
        <Typography component='div' color='primary' variant="body2">{readmore ? 'Thu gọn' : 'Đọc thêm'}</Typography>
      </Box>
    </Box>
  )
}

export default ReadMoreBox