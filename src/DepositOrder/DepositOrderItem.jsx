import { Box, Checkbox, FormControlLabel, IconButton, makeStyles, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Lock } from "@material-ui/icons"
import isNumber from 'is-number'
import { useSnackbar } from "notistack"
import { BASE_FILE } from "../constants"
import { numberWithCommas } from "../ultils/NumberUtils"

const useStyles = makeStyles((theme) => ({
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
}))

const DepositOrderItem = ({
  authors,
  buy_price,
  obuy_price,
  original_price,
  credit_status,
  images,
  title,
  otype,
  _id,
  url_key,
  changeApprove,
  orderStatus,
  status,
  _approve = false,
  changed,
  ...props
}) => {
  const theme = useTheme()
  const smallLayout = useMediaQuery('(max-width:480px)')
  const showOriginalPriceColumn = useMediaQuery('(min-width:904px)')
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const showSuspendedMessage = () => {
    enqueueSnackbar(
      'Sản phẩm bị treo credit do khó bán, credit sẽ được cộng và thông báo ngay khi có người mua sản phẩm này!',
      {
        variant: 'warning',
        autoHideDuration: 10000,
      },
    )
  }

  return (
    <Box>
      <Box
        width='100%'
        display='flex'
        justifyContent='space-between'
      >
        <Box display='flex'>
          <Box>
            <img
              src={`${BASE_FILE}/${images[0].thumb_url}`}
              style={{
                height: '80px',
                width: '80px',
                objectFit: 'contain',
                objectPosition: 'center',
                cursor: 'pointer'
              }}
              onClick={() => { if (url_key) window.open(`https://books.monsters.vn/product/${encodeURIComponent(url_key.replace('books/', ''))}`) }}
            />
          </Box>
          <Box marginLeft={1} />
          <Box display='flex' alignItems='center' width='fit-content' >
            {!smallLayout &&
              <Box marginRight={2}>
                <Typography
                  component='div'
                  variant='body2'
                  style={{ fontWeight: 500 }}
                  className={classes.label}
                >{title}</Typography>
                <Typography
                  component='div'
                  variant='caption'
                  className={classes.label}
                >{authors}</Typography>
              </Box>
            }
          </Box>
        </Box>
        <Box display='flex' justifyContent='flex-end' alignItems='center' position='relative'>
          <Box
            display='flex'
            justifyContent='flex-end'
            alignItems='center'
            position='absolute'
            right={80}
            width={150}
          >
            <Box
              display='flex'
              alignItems='flex-end'
              flexDirection='column'
            >
              {credit_status !== 'REJECTED' &&
                <Typography style={{ fontWeight: 'bold', textAlign: 'end' }}>
                  {credit_status === 'SUSPENDED' &&
                    <IconButton size='small' style={{ marginRight: '5px' }} onClick={showSuspendedMessage}>
                      <Lock style={{ color: 'orange' }} />
                    </IconButton>
                  }
                  {!!buy_price && status!='USER_REJECTED' && status!='REQUEST_RETURN' && `${numberWithCommas(buy_price)}đ`}
                  {!!buy_price && (status=='USER_REJECTED' || status=='REQUEST_RETURN') && (<del>{numberWithCommas(buy_price)}đ</del>)}
                  {!!obuy_price &&
                    <>
                      <br />
                      <span style={{ fontWeight: 'normal', fontSize: '12px' }}>Giá cũ: {numberWithCommas(obuy_price)}đ</span>
                    </>
                  }
                  {/* <br />
              <span style={{ fontWeight: 'normal', fontSize: '12px' }}>Giá bìa: {numberWithCommas(original_price)}đ</span> */}
                </Typography>
              }
              {credit_status === 'REJECTED' &&
                <Typography
                  style={{ color: 'grey', textAlign: 'end' }}
                  variant={smallLayout ? "body2" : "body1"}
                >Shop không mua</Typography>
              }
              {status === 'REQUEST_RETURN' && orderStatus === 'COMPLETED' &&
                <Typography
                  style={{ color: 'grey', textAlign: 'end' }}
                  variant='caption'
                  component='span'
                >(Đang hoàn trả)</Typography>
              }
              {status === 'USER_REJECTED' &&
                <Typography
                  style={{ color: 'grey', textAlign: 'end' }}
                  variant='caption'
                >Bạn không duyệt</Typography>
              }

            </Box>

          </Box>

          {(orderStatus !== 'USER_RE_APPROVAL') &&
            <FormControlLabel
              labelPlacement="start"
              control={<Checkbox color='primary' checked={_approve} onChange={() => changeApprove(_id, !_approve)} />}
              disabled={orderStatus !== 'USER_APPROVAL' || credit_status === 'REJECTED'}
              style={{
                position: 'absolute',
                right: 15
              }}
            />
          }
          {(orderStatus === 'USER_RE_APPROVAL' && changed) &&
            <FormControlLabel
              labelPlacement="start"
              control={<Checkbox color='primary' checked={_approve} onChange={() => changeApprove(_id, !_approve)} />}
              // disabled={credit_status === 'REJECTED'}
              style={{
                position: 'absolute',
                right: 15
              }}
            />
          }
          <Box marginLeft={2} />
        </Box>

      </Box>
      {changed && props.change_comment &&
        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}><span style={{ fontWeight: 500 }}>Lý do:</span> {props.change_comment}</Typography>
      }
    </Box>

  )
}

export default DepositOrderItem
