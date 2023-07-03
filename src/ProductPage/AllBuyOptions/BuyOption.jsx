import { Box, Divider, Typography, useMediaQuery } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AmountInput from "../../CommonComponent/AmountInput"
import { CustomButton } from "../../CommonComponent/CustomButton"
import { BASE_API, OTYPE_VN } from "../../constants"
import { axiosPost } from "../../ultils/axiosUtils"
import { numberWithCommas } from "../../ultils/NumberUtils"
import { ShopMinimalInfo } from "../BookDetails"
import { getCTVCodes } from "../PriceBox"
import { SeeAllImage, SeeAllImageThumbnail } from "../SeeAllImage"
import SeeAllImageSmall from "../SmallLayout/SeeAllImageSmall"
import { useSelector } from "react-redux"
import { signIn } from "../../ultils/SpecialRoute/SignedInRoute"

const BuyOption = ({ option }) => {

  const [openSeeAllImage, setOpenSeeAllImage] = useState(false)
  const [amount, setAmount] = useState(1)
  const { enqueueSnackbar } = useSnackbar()
  let { id: url_key } = useParams()
  const smallLayout = useMediaQuery('(max-width:904px)')
  const { signed_in } = useSelector(state => state.root)

  useEffect(() => {
    if (option.quantity === 0) setAmount(0)
  }, [option])

  const addToCart = async () => {
    if (!signed_in) signIn()

    let [rcode, ccode] = getCTVCodes(url_key)

    let response = await axiosPost(`${BASE_API}/cartitems`, {
      book_id: option.book_id,
      otype: option.otype,
      price: option.price,
      quantity: amount,
      ditem_id: option.ditem_id,
      rcode,
      ccode
    }, true)

    if (!response || response.code !== 200) {
      enqueueSnackbar(response.message || 'Đã xảy ra lỗi', { variant: 'error' })
      return
    }

    enqueueSnackbar('Đã thêm vào giỏ', { variant: 'success' })
  }

  return (
    <>
      <Box width='100%' paddingX={2}>
        <Box width='100%' display='flex' justifyContent='space-between'>
          <Box>
            <Typography style={{ color: 'orange', fontWeight: 600, fontSize: '18px', lineHeight: '20px' }} >{numberWithCommas(option.price)}đ</Typography>
            <Typography variant="body2" style={{ fontWeight: '600' }}>{OTYPE_VN[option.otype]}</Typography>
          </Box>
          <Box>
            {option.quantity === 0 ?
              <Typography color="secondary" style={{ fontWeight: 500 }}>Hết hàng</Typography>
              :
              <Box display='flex' alignItems='center'>
                <AmountInput
                  amount={amount}
                  setAmount={setAmount}
                  minAmount={0}
                  maxAmount={option.quantity}
                  hideLabel
                />
                <Box ml={1} />
                <CustomButton
                  backgroundColor='yellow'
                  borderRadius='normal'
                  variant="contained"
                  fullWidth
                  onClick={addToCart}
                  disabled={option.quantity === 0 || amount === 0}
                  size='small'
                  style={{ height: 'fit-content' }}
                >
                  Thêm
                </CustomButton>
              </Box>
            }
          </Box>
        </Box>
        <Box mt={1} />
        <Box
          border={`1px dashed #0000001f`}
          borderRadius='4px'
          padding={1.5}
        >
          <Info
            name='Shop'
            value={
              <ShopMinimalInfo
                {...option.shop}
                small
              />}
          />
          <Box mt={1} />
          <Info
            name='Ảnh'
            value={
              <Box width='200px'>
                <SeeAllImageThumbnail
                  openDialog={() => setOpenSeeAllImage(true)}
                  smallImages={option.images.map(image => image.thumb_url)}
                  hideLabel
                />
              </Box>
            }
          />
          <Box mt={1} />
          <Info
            name='Mô tả'
            value={option.odesc}
          />
        </Box>

        {smallLayout ?
          <SeeAllImageSmall open={openSeeAllImage} onClose={() => setOpenSeeAllImage(false)} bigImages={option.images.map(img => img.large_url)} />
          :
          <SeeAllImage
            open={openSeeAllImage}
            onClose={() => setOpenSeeAllImage(false)}
            bigImages={option.images.map(image => image.large_url)}
            smallImages={option.images.map(image => image.thumb_url)}
          />
        }
        {/* <Box paddingTop={0.5}><Divider /></Box>
            <Typography color="textPrimary" variant='body2'>{option.odesc}</Typography>
            <Box marginTop={1} />
            <Typography color="textPrimary" variant='body2'>{option.ditem_desc}</Typography> */}
      </Box>
    </>
  )
}

export default BuyOption

const Info = ({ name, value }) => {
  const smallLayout = useMediaQuery('(max-width:904px)')

  return (
    <Box width='100%' display='flex' justifyContent='space-between'>
      <Typography variant="caption" color="textSecondary" >{name}</Typography>
      {/* <Box ml={2} /> */}
      <Box width='75%' display='flex'>
        {typeof value === 'string' ?
          <Typography variant="caption" style={{ textAlign: 'start' }}>{value}</Typography>
          :
          <>
            {value}
          </>
        }
      </Box>

    </Box>
  )
}
