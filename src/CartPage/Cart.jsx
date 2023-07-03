import { Avatar, Box, Checkbox, Divider, makeStyles, Typography, useMediaQuery } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_API, BASE_FILE } from "../constants";
import { CustomButton } from "../CommonComponent/CustomButton";
import { axiosGet, axiosDelete, axiosPatch } from "../ultils/axiosUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import CartItem from "./CartItem";
import RecommendItem from "./RecommendItem";
import { useDispatch } from "react-redux";
import { refreshNavbar } from '../redux/rootReducer'
import CartSkeleton from "./CartSkeleton";
import CheckOutBar from "./SmallLayout/CheckOutBar";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import Pcode from "../CheckOut/ChooseAddress/Pcode";
import ChoosePcodePopup from "../CheckOut/ChooseAddress/ChoosePcodePopup";
import Header from "./Header";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'grey',
    padding: theme.spacing(2),
    paddingBottom: 0,
    boxSizing: 'border-box',
    maxWidth: '1480px'
  },
  youMayLike: {
    backgroundColor: theme.palette.common.white,
    width: 348,
    height: 'fit-content',
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: 5,
    boxSizing: 'border-box'
  },
  whiteBackground: {
    backgroundColor: theme.palette.common.white
  }
}))

const Cart = () => {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const navigate = useNavigate()
  const smallLayout = useMediaQuery('(max-width:840px)')

  const [cartInfo, setCartInfo] = useState(null)
  const [items, setItems] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(false)
  const [pcodes, setPcodes] = useState([])
  const [openPcodePopup, setOpenPcodePopup] = useState(false)
  const dispatch = useDispatch()

  const getCartItems = async () => {
    setLoading(true)
    let response = await axiosGet(`${BASE_API}/carts/active`, null, true)
    if (!response) return
    console.log('cart', response.data)
    setCartInfo(response.data)
    setItems(response.data.items)
    setShops(response.data.shops_items)
    setLoading(false)
  }

  const getPcodes = async () => {
    const response = await axiosGet(`${BASE_API}/carts/active/pcodes`, null, true)
    if (!response || response.code !== 200) {
      return
    }
    console.log('pcodes', response)
    setPcodes(response.data)
  }

  useEffect(() => {
    getCartItems()
    getPcodes()
  }, [])

  const deleteItem = (id) => async (event) => {
    let response = await axiosDelete(`${BASE_API}/cartitems/${id}`, null, true)
    if (!response) return
    getCartItems()
    getPcodes()
    dispatch(refreshNavbar())
  }

  const updateItem = async (id, obj) => {
    let response = await axiosPatch(`${BASE_API}/cartitems/${id}`, obj, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response.message || 'Lỗi khi cập nhật', { variant: 'error' })
      return
    }
    getCartItems()
    getPcodes()
  }

  const checkOut = () => {
    navigate(`/chon-dia-chi?procedure=buy&id=${cartInfo._id}`)
  }

  const selectedCount = items.filter(item => item.quantity > 0 && item.selected).length

  const onCheckShop = (shop) => (e) => {
    const isCheck = e.target.checked
    for (const item of shop.items) {
      updateItem(item._id, {
        field_name: 'selected',
        value: isCheck
      })
    }
  }

  const onCheckAll = (e) => {
    const isCheck = e.target.checked
    for (const item of items) {
      updateItem(item._id, {
        field_name: 'selected',
        value: isCheck
      })
    }
  }

  return (
    <Box
      className={classes.root}
      display='flex'
    >
      {loading && !items.length && <CartSkeleton />}

      {/*Giỏ trống */}
      {items.length === 0 && !loading && !!cartInfo &&
        <Box className={classes.whiteBackground} height='fit-content' padding={2} boxSizing='border-box' width='100%'>
          <Box display='flex' justifyContent='space-between' alignItems='flex-end' paddingRight={2} >
            <Typography variant="h5" gutterBottom>Giỏ hàng</Typography>
          </Box>
          <Divider />

          <Box display='flex' flexDirection='column' alignItems='center' marginTop={4} paddingBottom={4}>
            <Typography
              variant="h5"
              style={{ textAlign: 'center' }}
            >Bạn chưa có gì trong giỏ hàng</Typography>
            <Box marginTop={3} />
            <Link to='/'>
              <CustomButton variant="contained" backgroundColor='yellow'>Quay lại trang chủ</CustomButton>
            </Link>
          </Box>
        </Box>
      }

      {/*Giỏ hàng */}
      {items.length > 0 && shops.length > 0 &&
        <Box flexGrow={1} display='flex' flexDirection='column' gridRowGap={16}>
          <Header checked={selectedCount === items.length} onChange={onCheckAll} />
          {shops?.map((shop) => {

            const selectedCount = shop.items.filter(item => item.selected).length
            const isCheck = selectedCount === shop.items.length

            return (
              <Box
                key={shop._id}
                className={classes.whiteBackground}
                height='fit-content' boxSizing='border-box' width='100%'
                pt={2}
              >
                <Box display='flex' justifyContent='space-between' alignItems='center' mb={1.5} pr={2}>
                  <Box display='flex' alignItems='center'>
                    <Checkbox color='primary' style={{ width: 'fit-content', height: 'fit-content' }} checked={isCheck} onChange={onCheckShop(shop)} />
                    <Avatar src={`${BASE_FILE}/${shop.pimg}`} alt={shop.name} style={{ width: '24px', height: '24px' }} />
                    <Box ml={1} />
                    <Typography style={{ fontWeight: 600 }} >{shop.name}</Typography>
                  </Box>
                  {smallLayout &&
                    <>
                      <CustomButton
                        variant="contained"
                        size='small'
                        backgroundColor='purple'
                        color='white'
                        onClick={() => setOpenPcodePopup(true)}
                        style={{ marginBottom: '7px' }}
                      >Xem khuyến mại</CustomButton>
                      <ChoosePcodePopup
                        id='active'
                        pcodes={pcodes}
                        open={openPcodePopup}
                        onClose={() => setOpenPcodePopup(false)}
                        procedure='buy'
                        readonly
                      />
                    </>
                  }
                </Box>
                <Divider />
                <Box mt={2} />
                {shop.items.map((item, index) => (
                  <Fragment
                    key={item._id}
                  >
                    <CartItem
                      _id={item._id}
                      authors={item.authors}
                      otype={item.otype}
                      price={item.price}
                      quantity={item.quantity}
                      src={item.thumb_url}
                      title={item.title}
                      deleteItem={deleteItem}
                      updateItem={updateItem}
                      url_key={item.url_key.replace('books/', '')}
                      smallLayout={smallLayout}
                      changed={item.changed}
                      selected={item.selected}
                    />
                    <Box mt={2} />
                    {index !== shop.items.length - 1 &&
                      <>
                        <Divider />
                        <Box mt={2} />
                      </>
                    }
                  </Fragment>
                ))}
              </Box>
            )
          }


          )}
        </Box>
      }

      {/*Mã khuyến mại */}
      {items.length > 0 && !smallLayout &&
        <>
          <Box ml={2} minWidth='350px'>
            <Box className={classes.whiteBackground} width='100%' flexDirection='column' justifyContent='space-between' padding={2}>
              <Typography >{`Tổng (${selectedCount} sản phẩm):`} <b>{numberWithCommas(cartInfo.subtotal)}đ</b></Typography>
              <Box boxSizing='border-box' width="100%" marginTop={2}>
                <CustomButton fullWidth variant="contained" backgroundColor='yellow' onClick={checkOut} disabled={!selectedCount}>Thanh toán</CustomButton>
              </Box>
            </Box>
            <Box
              marginTop={2}
              className={classes.whiteBackground}
              width='100%'
              padding={2}
            >
              <Typography style={{ fontWeight: 500, color: 'purple' }}>
                Khuyến mại
              </Typography>
              <Typography variant='caption'>(Chọn tại bước chọn địa chỉ)</Typography>
              <Box marginTop={1} />
              <Divider />
              <Box
                marginTop={2}
                display='flex'
                flexDirection='column'
                gridRowGap={10}
                maxWidth='348px'
                maxHeight='370px'
                style={{ overflowY: 'scroll' }}
                className='custom-scroll-bar'
                paddingBottom={2}
                px={1}
              >
                {pcodes.map((pcode, index) =>
                  <Pcode key={index} data={pcode} compact readonly />
                )}
              </Box>

            </Box>
          </Box>
        </>
      }

      {items.length > 0 && smallLayout &&
        <CheckOutBar
          itemCount={selectedCount}
          subtotal={numberWithCommas(cartInfo.subtotal)}
          checkOut={checkOut}
          pcodes={pcodes}
        />
      }
    </Box>
  )
}

export default Cart