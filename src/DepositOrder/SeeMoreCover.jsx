import { Box, Collapse, Typography } from "@material-ui/core"
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import { useEffect } from "react"
import { useRef, useState } from "react"

const SeeMoreCover = ({
  children,
  hideHeight = 150,
  _defaultShowAll = false,
  expandMoreText = 'Mở rộng',
  expandLessText = 'Thu gọn',
  showExpandText = true
}) => {
  const [showAll, setShowAll] = useState(false)
  const scrollRef = useRef()

  useEffect(() => {
    setShowAll(_defaultShowAll)
  }, [_defaultShowAll])

  const onClickShowAll = () => {
    setShowAll(prev => !prev)
  }

  return (
    <>
      <Collapse
        in={showExpandText ? showAll : true}
        collapsedSize={showExpandText ? hideHeight : 0}
        style={{ position: 'relative' }}
        timeout='auto'
      >
        <div ref={scrollRef} />
        {children}
        {showExpandText &&
          <Box
            display={showAll ? 'none' : 'block'}
            height='50px'
            width='100%'
            style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0),#fff)' }}
            position='absolute'
            bottom='0px'
          />
        }
      </Collapse>
      {showExpandText &&
        <>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            onClick={onClickShowAll}
            style={{ cursor: 'pointer' }}
            marginTop={1}
          >
            {showAll ? <ExpandLess /> : <ExpandMore />}
            <Box marginLeft={1} />
            <Typography component='div' color='primary' variant="body2">{showAll ? expandLessText : expandMoreText}</Typography>
          </Box>
        </>
      }


    </>
  )
}

export default SeeMoreCover 