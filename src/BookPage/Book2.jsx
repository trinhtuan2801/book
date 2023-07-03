import { Box, Card, CardActionArea, CardMedia, LinearProgress, makeStyles, Typography, useTheme, withStyles } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_FILE } from "../constants";
import { numberWithCommas } from "../ultils/NumberUtils";
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    // width: 'calc(100% - 5px)',
    // width: '100%',
    // maxWidth: '190px',
    // paddingLeft: '10px'
    // minWidth: '150px',
    minWidth: props => props.minWidth ? props.minWidth : '150px',
    // maxWidth: '150px',
    // flexGrow: 1,
    position: 'relative'
  },
  media: {
    width: '100%',
    minHeight: '190px',
    maxHeight: '190px',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
    boxSizing: 'border-box'
  },
  img: {
    height: '190px',
    maxWidth: 'calc(100% - 20px)',
    objectFit: 'cover',
    objectPosition: 'top'
  },
  cardActionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    // height: '40px'
  }
}))

const Book2 = (props) => {
  const classes = useStyles({ minWidth: props.minWidth })
  const theme = useTheme()
  const dateToStr = (datestr) => {
    let date = new Date(datestr)

    if (date instanceof Date && !isNaN(date))
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    else return datestr
  }

  const SaleDate = ({ sale_start, sale_end, spercent }) => {
    const startDate = new Date(sale_start)
    const endDate = new Date(sale_end)
    const currentDate = new Date()
    let redstr = ''
    let timestr = ''
    let isPrevSale = false
    if (currentDate < startDate) {
      isPrevSale = true
      redstr = `-${spercent}%`
      let hour = startDate.getHours()
      let minute = startDate.getMinutes()
      timestr = `Từ ${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`
      let day_diff = startDate.getDate() - currentDate.getDate()
      let hour_diff = Math.floor((startDate - currentDate) / 1000 / 60 / 60)
      if ((day_diff === 1 && hour_diff >= 12) || day_diff > 1) {
        timestr = `Từ ${startDate.getDate()}/${startDate.getMonth() + 1}`
      }
    } else {
      // let percent_off = Math.floor((props.oprice - props.sprice) / props.oprice * 100)
      redstr = `-${props.spercent}%`
      let hour = endDate.getHours()
      let minute = endDate.getMinutes()
      timestr = `Đến ${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`
      let day_diff = endDate.getDate() - currentDate.getDate()
      let hour_diff = Math.floor((endDate - currentDate) / 1000 / 60 / 60)
      if ((day_diff === 1 && hour_diff >= 12) || day_diff > 1) {
        timestr = `Đến ${endDate.getDate()}/${endDate.getMonth() + 1}`
      }
    }

    return (
      <Box
        display='flex'
        alignItems='center'
        marginBottom={1}
        marginTop={0.5}
        height='31px'
      >
        {isPrevSale ?
          <>
            <Typography style={{ color: '#CC0B39', fontWeight: 600, lineHeight: 1, lineHeight: 1 }} variant="caption">{redstr}</Typography>

            <Box
              style={{
                backgroundColor: '#CC0B39',
                color: 'white',
                padding: theme.spacing(1),
                boxSizing: 'border-box',
                borderRadius: '5px',
                fontWeight: 600,
                marginLeft: theme.spacing(1),
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography style={{ lineHeight: 1 }} variant='caption'>{timestr}</Typography>
            </Box>
          </>
          :
          <>
            <Box
              style={{
                backgroundColor: '#CC0B39',
                color: 'white',
                padding: theme.spacing(1),
                boxSizing: 'border-box',
                borderRadius: '5px',
                fontWeight: 600,
                marginRight: theme.spacing(1),
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography style={{ lineHeight: 1 }} variant="caption">{redstr}</Typography>
            </Box>
            <Typography style={{ color: '#CC0B39', fontWeight: 600, lineHeight: 1 }} variant='caption'>{timestr}</Typography>
          </>
        }

      </Box>
    )
  }

  let isSaleTime = new Date(props.sale_start) < new Date()
  let sold_percent = Math.floor(props.ssold / props.squantity * 100)
  let remain_quantity = props.squantity - props.ssold
  return (
    <>

      <Card className={classes.root} elevation={props.elevation}>
        <Link to={`/product/${encodeURIComponent(props.link.replace('books/', ''))}`}>
          <CardActionArea className={classes.cardActionArea}>
            <CardMedia
              className={classes.media}
            >
              <img src={`${BASE_FILE}/${props.img_url}`} className={classes.img} />
            </CardMedia>
            <Box
              marginTop={1.5}
              paddingX={props.paddingX}
              paddingBottom={2}
              boxSizing='border-box'
              height='100%'
              width='100%'
            >
              {props.squantity &&
                <SaleDate
                  sale_start={props.sale_start}
                  sale_end={props.sale_end}
                  spercent={props.spercent}
                />
              }

              <Typography className={classes.label} color='primary' variant="body2" style={{ fontWeight: '400', color: '#007185' }}>
                {!!props.label && props.label}
              </Typography>
              {props.author &&
                <Typography variant="caption" color="textPrimary"> {'by '}
                  <Typography display="inline" variant="caption" component="h2" color="primary" style={{ textDecoration: 'underline' }}>
                    {props.author}
                  </Typography>
                </Typography>
              }

              <Box
                display='flex'
                alignItems='center'
                justifyContent='flex-start'
                marginY={0.2}
              >
                {!isNaN(props.rating) && props.rating > 0 &&
                  <>
                    <Rating
                      name="read-only"
                      precision={0.1}
                      value={Number(props.rating)}
                      readOnly
                      size="small"
                    />
                    {!isNaN(props.votes) && props.votes > 0 &&
                      <Box marginLeft={1}>
                        {props.votes + ' '}
                      </Box>
                    }
                  </>
                }
              </Box>

              {props.sprice ? (
                <>
                  <Typography variant="body1" component='div' style={{ fontWeight: '500' }}>
                    {numberWithCommas(props.sprice)}đ&nbsp;
                  </Typography>
                  {props.sprice !== props.oprice &&
                    <Typography variant="caption" display='inline' style={{ textDecoration: 'line-through', fontSize: '12px' }}>{numberWithCommas(props.oprice)}đ</Typography>
                  }
                </>

              ) : (
                props.oprice && <Typography variant="button">{numberWithCommas(props.oprice)}đ</Typography>
              )}

              {props.squantity &&
                <>
                  <Box height='32px' marginTop={0.4}></Box>
                  <Box position='absolute' bottom={10} width='calc(100% - 32px)'>
                    <CustomLinearProgress variant="determinate" value={sold_percent} />
                    <Box display='flex' justifyContent='space-between' marginTop={0.5}>
                      <Typography style={{ color: '#CC0B39', fontWeight: 600 }} variant='caption'>{sold_percent}%</Typography>
                      <Typography style={{ color: '#CC0B39', fontWeight: 600 }} variant='caption'>{remain_quantity === 0 ? 'Bán hết' : `Còn lại ${remain_quantity}`}</Typography>
                    </Box>
                  </Box>
                </>
              }

            </Box>
          </CardActionArea>
        </Link>

      </Card >
    </>
  )

}

Book2.defaultProps = {
  id: 1,
  link: '',
  label: '',
  sprice: '',
  oprice: 0,
  img_url: '',
  author: '',
  rating: 0,
  votes: 0,
  sale_start: '',
  sale_end: '',
  elevation: 1,
  paddingX: 2
}

export default React.memo(Book2)

export const CustomLinearProgress = withStyles((theme) => ({
  root: {
    height: 8,
    // borderRadius: 5,
    width: '100%',
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    // borderRadius: 5,
    backgroundColor: '#CC0B39',
  },
}))(LinearProgress);