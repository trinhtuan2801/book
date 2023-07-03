import { Box, Drawer, IconButton, Typography } from "@material-ui/core"
import { MonetizationOn, Payment } from "@material-ui/icons"
import { useMemo } from "react"
import { CustomButton } from "../../CommonComponent/CustomButton"

const CheckOutBar = ({ itemCount, subtotal, checkOut}) => {

  return (
    <>
      <Drawer
        variant="permanent"
        anchor='bottom'
        style={{ height: '50px', flexShrink: 0 }}
      >
        <Box
          width='100%'
          height='50px'
          overflow='hidden'
          display='flex'
          justifyContent='space-between'
        >
          <Box
            boxSizing='border-box'
            paddingLeft={1}
            paddingTop={1}
          >
            <Typography variant='body2'>Tổng ({itemCount} sản phẩm):</Typography>
            <Typography variant='body2' style={{ color: 'orange', fontWeight: 500 }}>{subtotal} đ</Typography>
          </Box>
          <Box height='100%'>
            <CustomButton
              borderRadius={0}
              backgroundColor='yellow'
              startIcon={<Payment />}
              onClick={checkOut}
              style={{ height: '100%' }}
            >
              Thanh toán
            </CustomButton>
          </Box>

        </Box>
      </Drawer>
    </>
  )
}

export default CheckOutBar