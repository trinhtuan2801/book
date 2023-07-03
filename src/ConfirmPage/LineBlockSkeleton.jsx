import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react"
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from "react-router-dom";
import BookSkeleton from "../BookPage/BookSkeleton";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(1),
    boxSizing: 'border-box',
    zIndex: 2,
  },
  header: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'baseline',
    paddingLeft: props => props.headerPadding ? theme.spacing(2.5) : theme.spacing(1),
    marginBottom: theme.spacing(0),
    paddingTop: theme.spacing(1),
    position: 'relative',
    boxSizing: 'border-box'
  },
  seeMore: {
    '&:hover': {
      color: '#C7511F',
    }
  }
}))

const list10 = new Array(10).fill(10)

const LineBlockSkeleton = ({
  label,
  link,
  maxWidth = '1480px',
  isMobile = false,
  headerPadding = false,
}) => {
  const classes = useStyles({ headerPadding })
  const navigate = useNavigate()
  return (
    <div className={classes.root} style={{ maxWidth: maxWidth }}>
      <div className={classes.header}>
        <Typography variant='h6' style={{ fontWeight: '500', fontSize: isMobile ? '14px' : '1.25rem' }}>
          {label}
        </Typography>
        {link && !isMobile &&
          <Typography
            variant="body2"
            color="primary"
            style={{ cursor: 'pointer' }}
            onClick={() => { navigate(`/${link}`) }}
            className={classes.seeMore}
          >
            Xem thêm {'>'}
          </Typography>
        }
      </div>
      {/* <Divider /> */}
      {/* <Box marginTop={2} /> */}

      <Box
        position='relative'
        width='100%'
        boxSizing='border-box'
        height='310px'
        paddingX={headerPadding ? 2.5 : 1}
      >
        <Box
          position='relative'
          width='100%'
          display='flex'
          height='100%'
          style={{overflow: 'hidden'}}
        >
          {list10.map((item, index) => (
            <BookSkeleton key={index} minWidth='180px' elevation={0}/>
          ))}
        </Box>
      </Box>

    </div>
  )
}

LineBlockSkeleton.defaultProps = {
  label: '',
  items: [],
  link: '',
}

export default LineBlockSkeleton