import { Box, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { BASE_FILE } from "../../constants";

const useStyles = makeStyles((theme) => ({
  bigImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    cursor: 'pointer',
  },
  smallImg: {
    width: '100%',
    // flexGrow: 1,
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    cursor: 'pointer',
  },
  footer: {
    color: '#3F51B5',
    cursor: 'pointer',
    '&:hover': {
      color: '#C7511F',
    }
  },
  pushLast: {
    display: (props) => {
      if (props.fullLayout || props.squareLayout) return 'flex'
      return 'none'
    }
  },
  bookLabel: {
    color: 'black',
    // cursor: 'pointer',
    '&:hover': {
      color: '#C7511F',
    }
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
}))

const BoxItem = ({ label, link, items, pushLast }) => {
  const fullLayout = useMediaQuery('(min-width:1239px)')
  const squareLayout = useMediaQuery('(max-width:904px)')
  const classes = useStyles({ squareLayout, fullLayout })
  const navigate = useNavigate()
  return (
    <Box
      position='relative'
      display="flex"
      flexDirection="column"
      flex={1}
      minWidth='274px'
      maxWidth='386px'
      height='420px'
      paddingTop='20px'
      paddingBottom='15px'
      boxSizing='border-box'
      zIndex={1}
      style={{ backgroundColor: '#fff' }}
      className={classNames({
        [classes.pushLast]: pushLast
      })}
    >
      {/**header */}
      <Box paddingX='20px' marginBottom='10px'>
        <Typography
          variant='h5'
          style={{ fontWeight: squareLayout ? '300' : '500', fontSize: '20px' }}
          component="div"
          className={classes.label}
        >
          {!!label && label}
        </Typography>
      </Box>


      <Box
        // border='1px dashed grey'
        boxSizing='border-box'
        paddingX='20px'
        marginBottom='44px'
        flexGrow={1}
        height='275px'
      >
        {items.length === 1 ?
          <Link to={`/${items[0].link}`}>
            <img
              src={`${BASE_FILE}/${items[0].img_url}`}
              className={classes.bigImg}
              onClick={() => { navigate(`/${items[0].link}`) }}
            />
          </Link>
          :
          <>
            <Box
              height='50%'
              boxSizing='border-box'
              marginBottom='8px'
              position='relative'
              display='flex'
              justifyContent='space-between'
            >
              {items.slice(0, 2).map((item, index) => (
                <Box
                  key={index}
                  height='100%'
                  paddingBottom='36px'
                  width='47.5%'
                  // display='inline-block'
                  boxSizing='border-box'
                // position={index === 0 ? 'relative' : 'absolute'}
                // right={0}
                >
                  <Link to={`/${item.link}`}>
                    <img
                      src={`${BASE_FILE}/${item.img_url}`}
                      className={classes.smallImg}
                      onClick={() => { navigate(`/${item.link}`) }}
                    />
                    <Box
                      width='100%'
                      boxSizing='border-box'
                      paddingRight={0.5}
                      display='inline-block'
                    >
                      <Typography
                        variant='caption'
                        noWrap
                        className={classes.bookLabel}
                        component='div'
                      // onClick={() => { navigate(`/${item.link}`) }}
                      >
                        {!!item.label && item.label}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
              ))}
            </Box>
            <Box
              height='50%'
              boxSizing='border-box'
              marginBottom='8px'
              position='relative'
              display='flex'
              justifyContent={items.length === 4 ? 'space-between' : 'center'}
            >
              {items.slice(2, 4).map((item, index) => (
                <Box
                  key={index}
                  height='100%'
                  paddingBottom='36px'
                  width='47.5%'
                  // display='inline-block'
                  boxSizing='border-box'
                // position={index === 0 ? 'relative' : 'absolute'}
                // right={0}
                >
                  <Link to={`/${item.link}`}>
                    <img
                      src={`${BASE_FILE}/${item.img_url}`}
                      className={classes.smallImg}
                      onClick={() => { navigate(`/${item.link}`) }}
                    />
                    <Box
                      width='100%'
                      boxSizing='border-box'
                      paddingRight={0.5}
                      display='inline-block'
                    >
                      <Typography
                        variant='caption'
                        noWrap
                        className={classes.bookLabel}
                        component='div'
                      // onClick={() => { navigate(`/${item.link}`) }}
                      >
                        {!!item.label && item.label}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
              ))}
            </Box>
          </>
        }
      </Box>


      <Box
        width='fit-content'
        paddingX='20px'
        marginBottom='20px'
        position='absolute'
        bottom={0}
      >
        <Link to={`/${link?.replace('books/', '')}`}>
          <Typography
            // onClick={() => { navigate(`/${link}`) }}
            className={classes.footer}
            variant='caption'
          >
            {!!link && 'Xem thêm'}
            {/* {'Xem thêm'} */}
          </Typography>
        </Link>
      </Box>

    </Box >
  )
}

BoxItem.defaultProps = {
  items: [],
  label: '',
  footer: 'Xem thêm'
}

export default BoxItem