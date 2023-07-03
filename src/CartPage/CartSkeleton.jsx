import { Box, Divider, makeStyles, Typography } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import { CustomButton } from "../CommonComponent/CustomButton"

const useStyles = makeStyles((theme) => ({
  whiteBackground: {
    backgroundColor: theme.palette.common.white
  }
}))

const CartSkeleton = () => {
  const classes = useStyles()
  return (
    <>
      <Box className={classes.whiteBackground} height='fit-content' padding={2} boxSizing='border-box' width='fit-content' flex={1}>
        <Box display='flex' justifyContent='space-between' alignItems='flex-end' paddingRight={2} >
          <Typography variant="h5" gutterBottom>Giỏ hàng</Typography>
          <Typography variant="body1" gutterBottom style={{ fontWeight: 400 }}>Giá tiền</Typography>
        </Box>
        <Divider />
        {/**Items */}
        <CartItemSkeleton />
        <CartItemSkeleton />
        <CartItemSkeleton />

        <Box display='flex' justifyContent='flex-end' alignItems='center' marginTop={2} paddingRight={2}>
          <Typography variant="h6" style={{ fontWeight: 400 }}>{`Tổng sản phẩm:`} </Typography>
          <Box marginLeft={1.5} />
          <Skeleton variant='rect' height='20px' width='120px' />
        </Box>
      </Box>

      <Box marginRight={2} />
      <Box maxWidth='348px' >
        <Box className={classes.whiteBackground} width='300px' flexDirection='column' justifyContent='space-between' padding={3}>
          {/**subtotal */}
          <Box display='flex' alignItems='center'>
            <Typography variant="body1" style={{ fontWeight: 400 }}>{`Tổng sản phẩm:`} </Typography>
            <Box marginLeft={1.5} />
            <Skeleton variant='rect' height='15px' style={{ flexGrow: 1 }} />
          </Box>
          {/* <Skeleton height='30px' /> */}
          <Box boxSizing='border-box' width="100%" marginTop={2.5}>
            <CustomButton fullWidth variant="contained" backgroundColor='yellow' disabled >Thanh toán</CustomButton>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default CartSkeleton

const CartItemSkeleton = () => {
  return (
    <div>
      <Box
        display='flex'
        padding={2}
        boxSizing='border-box'
        justifyContent='space-between'
        height='fit-content'
      >
        <Box display='flex'>
          <Skeleton variant='rect' width='100px' height='140px' />
          <Box marginLeft={2} />
          <Box
            boxSizing='border-box'
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            style={{ gap: '10px' }}
          >
            <Box>
              <Skeleton variant='rect' width='400px' height='15px' />
              <Box marginTop={1.5} />
              <Skeleton variant='rect' width='100px' height='10px' />
              <Box marginTop={1.5} />
              <Skeleton variant='rect' width='50px' height='10px' />
              <Box marginTop={1.5} />
              <Skeleton variant='rect' width='80px' height='10px' />
              <Box marginTop={1.5} />

            </Box>
          </Box>
          <Box marginLeft={2} />
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          alignItems='flex-end'
          flexGrow={1}
        >

          <Skeleton variant='rect' width='80px' height='10px' />
          {/* <CustomButton variant="contained" backgroundColor='white' size="small" width='80px' disabled>Xóa</CustomButton> */}
        </Box>
      </Box>
      <Divider />
    </div>
  )
}