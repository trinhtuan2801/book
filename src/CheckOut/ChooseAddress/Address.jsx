import { Box, Button, makeStyles, Typography } from "@material-ui/core"
import { useMemo } from "react"
import { CustomButton } from "../../CommonComponent/CustomButton"
import { numberWithCommas, phoneNumberWithSpace } from "../../ultils/NumberUtils"

const useStyles = makeStyles(theme => ({
  submitButton: {
    width: '100%',
    maxWidth: '300px'
  },
}))

const Address = (props) => {
  const classes = useStyles()

  const getAddress = () => {
    return {
      _id: props._id,
      name: props.name,
      mobile: props.mobile,
      province: props.province,
      district: props.district,
      ward: props.ward,
      street: props.street,
      is_office: props.is_office,
      ship_cost: props.ship_cost
    }
  }

  const shipFeeDetails = useMemo(() => {
    let result = []
    if (props.shops_transport) {
      const map = {}
      const shops_transport = props.shops_transport
      for (const shop_fee of shops_transport) {
        const cost = shop_fee.shop_cost
        if (!map[cost])
          map[cost] = 1
        else
          map[cost]++
      }
      for (const [cost, count] of Object.entries(map)) {
        result.push(`${count} kiện x${numberWithCommas(cost)}đ`)
      }
    }
    return result.join(', ')
  }, [props.shops_transport])

  return (
    <Box>
      <Typography variant="body1" style={{ fontWeight: 500 }}>{props.name}</Typography>
      <Typography variant="body2" component='div'>
        {props.street}&nbsp;
        <b>{props.is_office === true && '( Cơ quan )'}</b>
        <br />
        {props.ward},&nbsp;{props.district},&nbsp;{props.province}
        <br />
        Số điện thoại:&nbsp;
        <span style={{ fontWeight: 500 }}>
          {phoneNumberWithSpace(props.mobile)}
        </span>
        <br />
        Phí ship:&nbsp;
        <span style={{ fontWeight: 500, color: props.procedure === 'deposit' ? '#3f51b5' : 'orange' }}>
          {numberWithCommas(props.ship_cost)}đ
        </span>
        {!!props.shops_transport &&
          <>
            <br />
            ({shipFeeDetails})
          </>
        }
        {props.procedure === 'deposit' &&
          <>
            {props.ship_pcode_value > 0 &&
              <>
                <br />
                Khuyến mại: <span style={{ fontWeight: 500, color: 'purple' }}>-{numberWithCommas(props.ship_pcode_value)}đ</span>
              </>
            }
            <br />
            Tổng: <span style={{ fontWeight: 500, color: 'orange' }}>{numberWithCommas(props.ship_cost - props.ship_pcode_value)}đ</span>
          </>
        }
      </Typography>
      <Box marginTop={1} />
      {!!props.merror &&
        <>
          <Typography
            color="secondary"
            variant='body2'
            style={{ fontStyle: 'italic' }}
          >*{props.merror.split('-')[1].trim()}</Typography>
          <Box marginTop={1} />
        </>
      }
      <CustomButton
        size='small'
        className={classes.submitButton}
        backgroundColor="yellow"
        variant="contained"
        onClick={props.chooseAddress(getAddress())}
        disabled={!!props.merror}
      >
        {props.procedure === 'deposit' ? ' Nhận tại địa chỉ này' : 'Giao đến địa chỉ này'}
      </CustomButton>
      <Box display='flex' width='100%' maxWidth='300px' marginTop={1}>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={props.onClickUpdateAddress(getAddress())}
        >
          Sửa
        </Button>
        <Box marginLeft={1} />
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={props.deleteAddress(props._id)}
        >
          Xóa
        </Button>
      </Box>
    </Box>
  )
}

export default Address