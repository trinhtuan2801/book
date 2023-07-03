import { Box, makeStyles, Typography } from "@material-ui/core"
import { Clear } from "@material-ui/icons"
import { useSnackbar } from "notistack"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { BASE_API } from "../../constants"
import { axiosDelete } from "../../ultils/axiosUtils"
import { numberWithCommas } from "../../ultils/NumberUtils"

const useStyles = makeStyles(theme => ({
  pgift: {
    borderColor: 'purple',
    color: 'purple'
  },
  pvalue: {
    borderColor: 'purple',
    color: 'purple'
  },
  pship: {
    borderColor: 'purple',
    color: 'purple',
  },
  rainbow: {
    // backgroundColor: '#302244',
    border: '2px solid transparent',
    borderImage: 'linear-gradient(to bottom right, purple 0%, purple 25%, #2c90fc 75%, #2c90fc 75%, #2c90fc 100%)',
    borderImageSlice: 1,
  }
}))

const ActivePcode = ({ pcode, variant, value, updateParent = () => { } }) => {
  const classes = useStyles()
  let [searchParams] = useSearchParams()
  let cart_id = searchParams.get('id')
  const { enqueueSnackbar } = useSnackbar()

  const label = useMemo(() => {
    switch (variant) {
      case 'pgift': return `Quà tặng`
      case 'pvalue': return `Giảm ${numberWithCommas(value)}đ`
      case 'pship': return `Freeship ${numberWithCommas(value)}đ`
    }
  })

  const removeCode = async () => {
    console.log('remove code', pcode)
    const response = await axiosDelete(`${BASE_API}/carts/${cart_id}/pcodes`, {
      pcode: pcode
    }, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Lỗi khi bỏ mã', { variant: 'error' })
      return
    }
    updateParent()
  }

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='fit-content'
      border='2px solid'
      borderRadius='8px'
      className={classes[variant]}
      p={0.5}
    >
      <Typography variant='subtitle2'>
        {label}
      </Typography>
      <Clear
        style={{ fontSize: '16px', marginLeft: '8px', cursor: 'pointer' }}
        onClick={removeCode}
      />
    </Box >
  )
}

export default ActivePcode