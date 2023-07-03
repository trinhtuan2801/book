import { Box, Button, Checkbox, Divider, IconButton, makeStyles, TextField, Typography } from "@material-ui/core";
import { AddBox, Delete, IndeterminateCheckBox } from "@material-ui/icons";
import isNumber from "is-number";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_FILE } from "../constants";
import { CustomButton } from "../CommonComponent/CustomButton";
import { choices } from "../ProductPage/BookDetails";
import { numberWithCommas } from "../ultils/NumberUtils";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  img: {
    width: '100px',
    height: '140px',
    objectFit: 'cover',
    objectPosition: 'top',
    cursor: 'pointer'
  },
  title: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 1,
    "-webkit-box-orient": "vertical",
  },
  author: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 1,
    "-webkit-box-orient": "vertical",
  },
  amountButton: {
    height: 'fit-content',
    width: 'fit-content'
  }
}))

const CartItem = (props) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const [amount, setAmount] = useState(0)
  const isChangeAmount = useRef(false) //detect change from user, not from prop
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    if (!isChangeAmount.current) return
    isChangeAmount.current = false
    props.updateItem(props._id, {
      field_name: 'quantity',
      value: amount
    })
  }, [amount])

  useEffect(() => {
    if (props.quantity) setAmount(props.quantity)
  }, [props.quantity])

  const goToProductPage = () => {
    navigate(`/product/${encodeURIComponent(props.url_key)}`)
  }

  const onChangeAmount = (event) => {
    let value = event.target.value
    setAmount(value)
  }

  const handleClickAmount = (isAdd) => (event) => {
    isChangeAmount.current = true
    if (isAdd) setAmount(amount + 1)
    else if (amount > 0) setAmount(amount - 1)
  }

  const onBlur = (event) => {
    isChangeAmount.current = true
    let value = Number(event.target.value)
    let isValid = isNumber(value) && value >= 0
    if (isValid) setAmount(Math.floor(value))
    else setAmount(0)
  }

  const informPriceChange = () => {
    enqueueSnackbar(
      <span>Sản phẩm trở về <strong>giá trị ban đầu</strong> do đã <strong>hết</strong> thời gian <strong>khuyến mại</strong></span>,
      {
        variant: 'warning',
        autoHideDuration: 5000
      })
  }

  const onCheck = (e) => {
    props.updateItem(props._id, {
      field_name: 'selected',
      value: e.target.checked
    })
  }

  return (
    <Box
      pr={2}
      width='100%'
      boxSizing='border-box'
      height='fit-content'
    >
      <Box display='flex' width='100%'>
        <Box display='flex' alignItems='center'>
          <Checkbox className={classes.amountButton} color='primary' checked={props.selected} onChange={onCheck} />
        </Box>
        {/**Image */}
        <Box width='100px' maxWidth='100px'>
          <img
            className={classes.img}
            src={`${BASE_FILE}/${props.src}`}
            onClick={goToProductPage}
          />

        </Box>
        <Box marginLeft={2} />

        <Box
          width='100%'
          boxSizing='border-box'
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
        >
          <Box
            width='100%'
            display='flex'
            justifyContent='space-between'
          >
            <Box>
              <Typography
                variant='body2'
                className={classes.title}
                onClick={goToProductPage}
              >{props.title}</Typography>
              <Typography
                variant='body2'
                style={{ fontWeight: 500 }}
                onClick={() => { window.open(`/search?terms=${encodeURIComponent(props.authors.join(', '))}`, '_blank') }}
                className={classes.author}
              >{`${props.authors.join(', ')}`}</Typography>
              <Typography
                variant='body2'
                style={{ color: 'orange', fontWeight: 500 }}
              >{choices[props.otype]}
              </Typography>
              <Typography
                variant='body2'
                color='textPrimary'
              >
                {`${numberWithCommas(props.price)}đ `}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={informPriceChange}
                >
                  {props.changed && '⚠️'}
                </span>
              </Typography>
            </Box>
            {!props.smallLayout &&
              <Typography style={{ fontWeight: 600 }}>{numberWithCommas(props.price * props.quantity)}đ</Typography>
            }
          </Box>
          {!props.smallLayout &&
            <AmountBox
              handleClickAmount={handleClickAmount}
              classes={classes}
              props={props}
              onChangeAmount={onChangeAmount}
              onBlur={onBlur}
              amount={amount}
            />
          }
        </Box>
      </Box>
      {props.smallLayout &&
        <Box mt={1} ml={5}>
          <AmountBox
            handleClickAmount={handleClickAmount}
            classes={classes}
            props={props}
            onChangeAmount={onChangeAmount}
            onBlur={onBlur}
            amount={amount}
          />
        </Box>
      }
    </Box>

  )
}


export default CartItem

const AmountBox = ({ handleClickAmount, classes, props, onChangeAmount, onBlur, amount }) => {
  return (
    <Box
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
    >
      <Box display='flex' alignItems='center'>
        <IconButton onClick={handleClickAmount(true)} size='small' className={classes.amountButton}>
          <AddBox />
        </IconButton>
        <Box ml={0.5} />
        <TextField
          type='number'
          value={props.quantity}
          onChange={onChangeAmount}
          style={{ width: '50px', textAlign: 'center' }}
          inputProps={{ style: { textAlign: 'center' } }}
          onBlur={onBlur}
          variant='outlined'
          size="small"
          InputProps={{
            style: {
              height: '30.75px'
            }
          }}
        />
        <Box ml={0.5} />
        <IconButton disabled={amount === 0} onClick={handleClickAmount(false)} size='small' className={classes.amountButton}>
          <IndeterminateCheckBox />
        </IconButton>
      </Box>

      <CustomButton variant="contained" backgroundColor='white' size="small" onClick={props.deleteItem(props._id)}>Xóa</CustomButton>
    </Box>
  )
}