import { Box, Drawer } from "@material-ui/core"
import { AddShoppingCart, Payment } from "@material-ui/icons"
import { CustomButton } from "../../CommonComponent/CustomButton"
import { PRICE_BOX_TYPE } from "../ProductPage"

const BuyBar = ({setPriceBoxType, setOpenPriceBoxDrawer}) => {
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
        >
          <CustomButton 
            fullWidth 
            borderRadius={0} 
            backgroundColor='yellow'
            startIcon={<AddShoppingCart/>}
            onClick={()=>{
              setOpenPriceBoxDrawer(true)
              setPriceBoxType(PRICE_BOX_TYPE.ADD_TO_CART)
            }}
          >
            Thêm giỏ
          </CustomButton>
          <CustomButton 
            fullWidth 
            borderRadius={0} 
            backgroundColor='orange'
            startIcon={<Payment/>}
            onClick={()=>{
              setOpenPriceBoxDrawer(true)
              setPriceBoxType(PRICE_BOX_TYPE.BUY_NOW)
            }}
          >
            Mua ngay
          </CustomButton>
          {/* <Box flexGrow={1} display='flex' justifyContent='center' alignItems='center'>
          </Box>
          <Divider orientation="vertical" />
          <Box flexGrow={1} display='flex' justifyContent='center' alignItems='center'>
            Mua ngay
          </Box> */}
        </Box>
      </Drawer>
    </>
  )
}

export default BuyBar