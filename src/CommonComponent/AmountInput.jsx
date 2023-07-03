import { Box, IconButton, TextField, Typography } from "@material-ui/core"
import { AddBox, IndeterminateCheckBox } from "@material-ui/icons"
import is_number from "is-number"

const AmountInput = ({
  amount,
  setAmount,
  minAmount,
  maxAmount,
  hideLabel = false,
  textFieldStyle = {}
}) => {

  const handleClickAmount = (isAdd) => (event) => {
    if (isAdd) setAmount(amount + 1)
    else if (amount > minAmount) setAmount(amount - 1)
  }

  const onChangeAmount = (event) => {
    let value = event.target.value
    setAmount(value)
  }

  const onBlur = (event) => {
    let value = Number(event.target.value)
    let isValid = is_number(value) && value >= minAmount
    if (isValid) {
      if (value > maxAmount)
        setAmount(maxAmount)
      else
        setAmount(Math.floor(value))
    }
    else setAmount(0)
  }

  return (
    <Box
      display='flex'
      alignItems='center'
    >
      {!hideLabel &&
        <Typography variant='body2'>Số lượng:</Typography>
      }
      <IconButton
        disabled={amount >= maxAmount}
        onClick={handleClickAmount(true)}
        size='small'
      >
        <AddBox />
      </IconButton>
      <Box ml={1} />
      <TextField
        type='number'
        value={amount}
        onChange={onChangeAmount}
        style={{ width: '50px', textAlign: 'center', ...textFieldStyle }}
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
      <Box ml={1} />
      <IconButton
        disabled={amount === minAmount}
        onClick={handleClickAmount(false)}
        size='small'
      >
        <IndeterminateCheckBox />
      </IconButton>
    </Box>
  )
}

export default AmountInput