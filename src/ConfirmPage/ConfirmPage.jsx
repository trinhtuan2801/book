import { Box, makeStyles, Typography, useMediaQuery } from "@material-ui/core"
import { CheckCircleRounded } from "@material-ui/icons"
import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { BASE_API, BASE_FILE } from "../constants"
import { CustomButton } from "../CommonComponent/CustomButton"
import { axiosGet } from "../ultils/axiosUtils"
import { numberWithCommas } from "../ultils/NumberUtils"
import { convertBlockToLineRow } from "../ultils/useBookSearch"
import ItemSlider from "../HomePage/Slider/ItemSlider"
import LineBlockSkeleton from "./LineBlockSkeleton"
const useStyles = makeStyles((theme) => ({
  img: {
    height: '150px',
    width: '100px',
    objectFit: 'cover',
    objectPosition: 'center',
    backgroundColor: 'transparent',
  },
  img1: {
    position: 'absolute',
    left: '15px',
    top: '-75px'
  },
  img2: {
    position: 'absolute',

  },
  img3: {
    position: 'absolute',
    left: '-15px',
    top: '-40px'
  }
}))

const ConfirmPage = () => {
  const classes = useStyles()

  const [bookImages, setBookImages] = useState([])
  const [cartInfo, setCartInfo] = useState(null)
  const [similarBuy, setSimilarBuy] = useState(null)
  const [similarView, setSimilarView] = useState(null)

  const smallLayout = useMediaQuery('(max-width:1050px)')

  let [searchParams] = useSearchParams()
  let from = searchParams.get('from')

  const navigate = useNavigate()
  const goToCart = () => {
    navigate('/cart')
  }
  const checkOut = () => {
    navigate(`/chon-dia-chi?procedure=buy&id=${cartInfo._id}`)
  }
  const getBookInfo = async () => {
    setBookImages([])
    const ids = searchParams.get('id').split(',')
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      let response = await axiosGet(`${BASE_API}/books/${id}`)
      if (!response) return
      let img = response.data.images[0].thumb_url
      setBookImages(prev => [...prev, img])
    }

  }
  const getCartInfo = async () => {
    let response = await axiosGet(`${BASE_API}/carts/active`, null, true)
    if (!response) return
    setCartInfo(response.data)
  }
  const getSimilarBooks = async () => {
    const id = searchParams.get('id').split(',')[0]
    let response = await axiosGet(`${BASE_API}/pages/book/${id}/details`)
    if (!response) return
    setSimilarBuy(convertBlockToLineRow(response.data.similar_buy_block))
    setSimilarView(convertBlockToLineRow(response.data.similar_view_block))
  }
  useEffect(() => {
    if (from === 'product-page') {
      getBookInfo()
      getCartInfo()
      getSimilarBooks()
    } else if (from === 'nap-credit-bank') {
      getCartInfo()
    }

  }, [])

  return (
    <Box
      height='fit-content'
      width='100%'
      boxSizing='border-box'
      paddingTop={8}
      paddingBottom={2}
      // paddingX={2}
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Box
        height='fit-content'
        width='100%'
        boxSizing='border-box'
        display='flex'
        paddingX={2}
        maxWidth='1480px'
      >
        <Box
          flex={1}
          height='250px'
          padding={3}
          boxSizing='border-box'
          style={{ backgroundColor: '#fff' }}
          marginTop={2}
          marginRight={2}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >

          {from === 'product-page' && bookImages.length > 0 &&
            <Box
              display='flex'
              alignItems='center'
              position='relative'
            >
              {bookImages.map((image, index) =>
                <Fragment key={index}>
                  {index !== 0 && (
                    <Box marginX={4}>
                      <Typography variant="h5" color="textSecondary">+</Typography>
                    </Box>
                  )}
                  <img
                    src={`${BASE_FILE}/${image}`}
                    alt='book image'
                    className={classes.img}
                  />
                </Fragment>
              )}
              <Box marginLeft={8} />
              <CheckCircleRounded fontSize="large" style={{ color: 'green' }} />
              <Box marginLeft={1} />
              <Typography style={{ fontWeight: 'bold' }}>Đã thêm vào giỏ</Typography>
            </Box>
          }
          {from === 'thanh-toan' &&
            <Box>
              <Box
                display='flex'
                alignItems='center'
              >
                <CheckCircleRounded fontSize="large" style={{ color: 'green' }} />
                <Box marginLeft={1} />
                <Typography style={{ fontWeight: 'bold' }}>Đặt hàng thành công</Typography>
              </Box>
              <Box marginTop={2} paddingLeft={3.5}>
                <Link to='/'>
                  <CustomButton variant="contained" backgroundColor='yellow'>Quay lại trang chủ</CustomButton>
                </Link>
              </Box>

            </Box>
          }
          {from === 'nap-credit-bank' &&
            <Box>
              <Box
                display='flex'
                alignItems='center'
              >
                <CheckCircleRounded fontSize="large" style={{ color: 'green' }} />
                <Box marginLeft={1} />
                <Typography style={{ fontWeight: 'bold' }}>Bạn đã nạp thành công <span style={{ color: 'green' }}>{numberWithCommas(searchParams.get('amount'))}đ</span> !</Typography>
              </Box>
              <Box marginTop={2} paddingLeft={3.5}>
                <Link to='/'>
                  <CustomButton variant="contained" backgroundColor='yellow'>Quay lại trang chủ</CustomButton>
                </Link>
              </Box>

            </Box>
          }

        </Box>

        {['product-page', 'nap-credit-bank'].includes(from) &&
          <Box
            width='350px'
            height='250px'
            padding={3}
            boxSizing='border-box'
            style={{ backgroundColor: '#fff' }}
            marginTop={2}
          >
            <Box
              display='flex'
              alignItems='center'
            >
              <Typography>Tổng ({`${cartInfo?.items.length || '-'}`} sản phẩm):</Typography>
              <Box marginLeft={1} />
              <Typography style={{ fontWeight: 'bold' }}>{`${numberWithCommas(cartInfo?.subtotal) || '-'}đ`}</Typography>
            </Box>
            <Box marginTop={4} />
            <CustomButton fullWidth variant="contained" onClick={checkOut} backgroundColor='yellow' borderRadius='8px' disabled={!cartInfo}>Thanh toán</CustomButton>
            <Box marginTop={2} />
            <CustomButton fullWidth variant="contained" onClick={goToCart} backgroundColor='white' borderRadius='8px' disabled={!cartInfo}>đến giỏ hàng</CustomButton>

          </Box>
        }

      </Box>



      {from === 'product-page' &&
        <Box
          width='100%'
          paddingX={2}
          boxSizing='border-box'
          marginTop={2}
          maxWidth='1480px'
        >
          {similarView ?
            <ItemSlider
              items={similarView.items}
              label={'Hàng cùng thể loại thường được xem'}
              link={similarView.link}
              // maxWidth='none'
              isMobile={smallLayout}
              showDots={true}
              headerPadding
            />
            :
            <LineBlockSkeleton
              label={'Hàng cùng thể loại thường được xem'}
              // maxWidth='none'
              isMobile={smallLayout}
              showDots={true}
              headerPadding
            />
          }


        </Box>
      }
      {from === 'product-page' &&
        <Box
          width='100%'
          paddingX={2}
          boxSizing='border-box'
          marginTop={2}
          maxWidth='1480px'
        >
          {similarBuy ?
            <ItemSlider
              items={similarBuy.items}
              label={'Hàng cùng thể loại thường được mua'}
              link={similarBuy.link}
              // maxWidth='none'
              isMobile={smallLayout}
              showDots={true}
              headerPadding
            />
            :
            <LineBlockSkeleton
              label={'Hàng cùng thể loại thường được mua'}
              // maxWidth='none'
              isMobile={smallLayout}
              showDots={true}
              headerPadding
            />
          }

        </Box>
      }
    </Box>
  )

}

ConfirmPage.defaultProps = {
  total_price: 10000,
  item_count: 5
}

export default ConfirmPage