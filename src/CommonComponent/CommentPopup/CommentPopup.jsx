import { Box, Button, Dialog, IconButton, makeStyles, TextField, Typography, useMediaQuery, useTheme, withStyles } from "@material-ui/core"
import { Close } from '@material-ui/icons'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import { Rating } from "@material-ui/lab"
import { useEffect, useState } from "react"
import UploadImageSection from "./UploadImageSection"
import { BASE_API, BASE_FILE } from "../../constants"
import useScrollLock from "../../ultils/useScrollLock"
import { axiosPost } from "../../ultils/axiosUtils"
import { useSnackbar } from "notistack"

const useStyles = makeStyles((theme) => ({
  ellipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  },
}))

const ratings_vn = {
  shop: 'Chăm sóc khách hàng',
  ship: 'Vận chuyển đóng gói',
  product: 'Chất lượng sản phẩm'
}

const COMMENT_TYPES = {
  CART_COMMENT: 0,
  DCART_COMMENT: 1,
  PRODUCT_COMMENT: 2
}

const CommentPopup = ({ open, onClose, ctype, oid, thumb_url, title }) => {
  const classes = useStyles()
  const [ratings, setRatings] = useState({
    shop: 5,
    ship: 5,
    product: 5,
  })
  const [text, setText] = useState('')
  const onSetRating = (name) => (value) => {
    setRatings(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const smallLayout = useMediaQuery('(max-width:904px)')
  const [images, setImages] = useState([])
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setRatings({
          shop: 5,
          ship: 5,
          product: 5,
        })
        setImages([])
      }, 1000)
    }
  }, [open])

  const submit = async () => {
    const response = await axiosPost(`${BASE_API}/comments`, {
      ctype,
      oid,
      title: '',
      text,
      prate: ratings.product,
      trate: ratings.ship,
      csrate: ratings.shop,
      images
    })
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Có lỗi khi gửi đánh giá', { variant: 'error' })
      return
    }
    enqueueSnackbar('Cảm ơn bạn đã gửi đánh giá', { variant: 'success' })
  }

  return (
    <Dialog open={open} onClose={onClose} style={{ overscrollBehavior: 'contain' }} fullScreen={smallLayout}>
      <CustomDialogTitle onClose={onClose}>
        Đánh giá {ctype === COMMENT_TYPES.PRODUCT_COMMENT ? 'sản phẩm' : 'đơn hàng'}
      </CustomDialogTitle>
      <CustomDialogContent dividers>
        <Box display='flex' flexDirection='column' style={{ width: smallLayout ? '100%' : '354.2px' }}>
          <Box display='flex'>
            <img
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'fill',
                border: '1px solid black',
                boxSizing: 'border-box'
              }}
              src={`${BASE_FILE}/${thumb_url}`}
            />
            <Box marginLeft={1} />
            <Typography className={classes.ellipsis} >{title}</Typography>
          </Box>
          <Box marginTop={1} />
          <RatingField
            name={ratings_vn['product']}
            value={ratings['product']}
            setValue={onSetRating('product')}
          />
          <Box marginTop={1} />
          <UploadImageSection images={images} setImages={setImages} />
          <Box marginTop={2} />
          <TextField
            multiline
            minRows={5}
            maxRows={5}
            variant='outlined'
            placeholder="Hãy chia sẻ nhận xét cho đơn hàng này bạn nhé!"
            InputProps={{
              style: {
                fontSize: '16px', background: "#f4f4f4"
              }
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Box marginTop={2} />
          <RatingField
            name={ratings_vn['shop']}
            value={ratings['shop']}
            setValue={onSetRating('shop')}
          />
          <RatingField
            name={ratings_vn['ship']}
            value={ratings['ship']}
            setValue={onSetRating('ship')}
          />
        </Box>

      </CustomDialogContent>
      <CustomDialogActions>
        <Button onClick={() => {
          submit()
          onClose()
        }} color="primary">
          Gửi đánh giá
        </Button>
      </CustomDialogActions>
    </Dialog >
  )
}

export default CommentPopup

const RatingField = ({ name, value, setValue, rating_vn = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'] }) => {
  const theme = useTheme()
  return (
    <Box height='48px' display='flex' alignItems='center' width='100%' justifyContent='space-between'>
      <Typography variant='body2' style={{ fontWeight: '500' }}>{name}: </Typography>
      <Box display='flex' alignItems='center'>
        <Rating
          value={value}
          onChange={(event, newValue) => {
            if (newValue)
              setValue(newValue)
          }}
          style={{ marginLeft: theme.spacing(2) }}

        />
        <Typography
          variant='body2'
          style={{
            width: '65px', textAlign: 'start', marginLeft: theme.spacing(1), color: '#ffb400'
          }}
        >{rating_vn[value - 1]}</Typography>
      </Box>


    </Box>
  )
}

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.grey[500],
  },
});

export const CustomDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ fontWeight: 'bold' }}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} size='small'>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export const CustomDialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1.5),
  },
}))(MuiDialogContent);

export const CustomDialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);