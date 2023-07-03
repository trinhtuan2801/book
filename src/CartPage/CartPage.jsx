import { makeStyles, Box, useMediaQuery } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { useSelector } from "react-redux";
import { convertBlockToLineRow } from "../ultils/useBookSearch";
import { axiosGet } from "../ultils/axiosUtils";
import { BASE_API } from "../constants";
import LineBlockSkeleton from "../ConfirmPage/LineBlockSkeleton";
import ItemSlider from "../HomePage/Slider/ItemSlider";
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(8),
    backgroundColor: theme.palette.grey[100],
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center'
  },
}))

const CartPage = () => {
  const classes = useStyles()
  const smallLayout = useMediaQuery('(max-width:1050px)')

  const [items, setItems] = useState([])
  const [similarBuy, setSimilarBuy] = useState(null)
  const [similarView, setSimilarView] = useState(null)
  const [loading, setLoading] = useState(false)
  const getSimilarBooks = async () => {
    setLoading(true)
    let response = await axiosGet(`${BASE_API}/carts/active`, null, true)
    if (!response) {
      setLoading(false)
      return
    }
    const items = response.data.items
    setItems(items)
    if (!items.length) {
      setLoading(false)
      return
    }
    const url_key = items[0].url_key
    response = await axiosGet(`${BASE_API}/pages/book/${encodeURIComponent(url_key.replace('books/', ''))}/details`)
    setLoading(false)
    if (!response) return
    setSimilarBuy(convertBlockToLineRow(response.data.similar_buy_block))
    setSimilarView(convertBlockToLineRow(response.data.similar_view_block))
  }
  useEffect(() => {
    getSimilarBooks()
    document.title = 'Giỏ hàng'
  }, [])
  return (
    <div className={classes.root}>
      <Cart />

      <Box
        width='100%'
        paddingX={2}
        boxSizing='border-box'
        marginTop={2}
        maxWidth='1480px'
      >
        {!loading && similarView &&
          <ItemSlider
            items={similarView.items}
            label={'Hàng cùng thể loại thường được xem'}
            link={similarView.link}
            // maxWidth='none'
            isMobile={smallLayout}
            showDots={true}
            headerPadding
          />
        }
        {loading &&
          <LineBlockSkeleton
            label={'Hàng cùng thể loại thường được xem'}
            // maxWidth='none'
            isMobile={smallLayout}
            showDots={true}
            headerPadding
          />
        }
      </Box>
      <Box
        width='100%'
        paddingX={2}
        boxSizing='border-box'
        marginTop={2}
        maxWidth='1480px'
      >
        {!loading && similarBuy &&
          <ItemSlider
            items={similarBuy.items}
            label={'Hàng cùng thể loại thường được mua'}
            link={similarBuy.link}
            // maxWidth='none'
            isMobile={smallLayout}
            showDots={true}
            headerPadding
          />
        }
        {loading &&
          <LineBlockSkeleton
            label={'Hàng cùng thể loại thường được mua'}
            // maxWidth='none'
            isMobile={smallLayout}
            showDots={true}
            headerPadding
          />
        }
      </Box>
      <Box marginBottom={smallLayout ? 8 : 2} />
    </div>
  )
}

export default CartPage