import { Box, Divider, makeStyles, useMediaQuery } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BASE_API } from "../constants";
import ItemSlider from "../HomePage/Slider/ItemSlider";
import '../HomePage/Slider/ItemSlider.css';
import { setCatParentIds } from "../redux/rootReducer";
import { axiosGet } from '../ultils/axiosUtils';
import { convertBlockToLineRow } from "../ultils/useBookSearch";
import useScrollLock from "../ultils/useScrollLock";
import AllBuyOptions from "./AllBuyOptions/AllBuyOptions";
import BookDetails from "./BookDetails";
import BookImage from "./BookImage";
import BoughtTogether from "./BoughtTogether";
import PriceBox from "./PriceBox";
import ProductPageSkeleton from "./ProductPageSkeleton";
import BookDetailsSmall from "./SmallLayout/BookDetailsSmall";
import BookImageSmall from "./SmallLayout/BookImageSmall";
import BuyBar from "./SmallLayout/BuyBar";
import PriceBoxDrawer from "./SmallLayout/PriceBoxDrawer";
import { META_TAGS, addMetaTag, addProductScriptTag } from "../ultils/ScrollToTop";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white
  },
}))

export const PRICE_BOX_TYPE = {
  'ADD_TO_CART': 1,
  'BUY_NOW': 2,
  'BOTH': 3
}

const ProductPage = () => {
  const smallLayout = useMediaQuery('(max-width:1050px)')
  const classes = useStyles()
  const [data, setData] = useState(null)
  const [details, setDetails] = useState(null)
  const [buyOptionIndex, setBuyOptionIndex] = useState(0)
  const [similarBuy, setSimilarBuy] = useState(null)
  const [similarView, setSimilarView] = useState(null)
  const [loading, setLoading] = useState(false)
  let { id } = useParams()

  let [searchParams] = useSearchParams()
  let buy_option = searchParams.get('buy_option')
  let rcode = searchParams.get('rcode')
  let ccode = searchParams.get('ccode')
  // console.log('render')
  const [pagePaddingTop, setPagePaddingTop] = useState(64)
  const [openAllBuyOptions, setOpenAllBuyOptions] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!!rcode) {
      let rcodes = JSON.parse(localStorage.getItem('rcodes'))
      if (!rcodes) rcodes = {}
      rcodes = {
        ...rcodes,
        [id]: { code: rcode, date: new Date() },
      }
      localStorage.setItem('rcodes', JSON.stringify(rcodes))
    }

    if (!!ccode) {
      let ccodes = JSON.parse(localStorage.getItem('ccodes'))
      if (!ccodes) ccodes = {}
      ccodes = {
        ...ccodes,
        [id]: { code: ccode, date: new Date() },
      }
      localStorage.setItem('ccodes', JSON.stringify(ccodes))
    }
  }, [])

  useEffect(() => {
    const getBookDetails = async (id) => {
      setLoading(true)
      let rcode_param = rcode ? `rcode=${rcode}` : ''
      let ccode_param = ccode ? `ccode=${ccode}` : ''
      let ctv_param = [rcode_param, ccode_param].filter(code => code).join('&')
      let ctv_query = ctv_param ? `?${ctv_param}` : ''
      let response = await axiosGet(`${BASE_API}/pages/book/${id}/details${ctv_query}`)
      if (!response || response.code !== 200) {
        window.location.href = '/snot-found'
        return
      }
      console.log('book data:', response.data)
      // response.data.buy_options.forEach((option) => { option.quantity = option.quantity || 1 })
      const book_data = response.data
      addMetaTag(META_TAGS.DESCRIPTION, book_data.book.short_desc)
      addMetaTag(META_TAGS.KEYWORDS, book_data.book.keywords.join(' '))
      addProductScriptTag(book_data.book)
      setData(book_data)
      setDetails(book_data.book)
      setSimilarBuy(convertBlockToLineRow(book_data.similar_buy_block))
      setSimilarView(convertBlockToLineRow(book_data.similar_view_block))
      setLoading(false)

      let options = book_data.buy_options
      for (let i = 0; i < options.length; i++) {
        const option = options[i]
        if (option.quantity > 0) {
          setBuyOptionIndex(i)
          break
        }
      }

      if (!!buy_option) {
        console.log('buy option', buy_option)
        let index = parseInt(buy_option)
        if (options[index].quantity > 0) setBuyOptionIndex(index)
      }

      let cat_parent_ids = book_data.book.cat_parent_ids
      dispatch(setCatParentIds(cat_parent_ids))
      if (cat_parent_ids.length === 3) setPagePaddingTop(112)

    }
    getBookDetails(id)
  }, [id])

  const clickBuyOption = (index) => {
    setBuyOptionIndex(index)
    if (smallLayout) {
      setOpenPriceBoxDrawer(true)
    }
  }

  const [openPriceBoxDrawer, setOpenPriceBoxDrawer] = useState(false)
  const [priceBoxType, setPriceBoxType] = useState(0)
  // const hasCategoryBar = !!document.getElementById('category-bar')

  const { lockScroll, unlockScroll } = useScrollLock()

  useEffect(() => {
    if (openPriceBoxDrawer) lockScroll()
    else unlockScroll()
  }, [openPriceBoxDrawer])

  useEffect(() => {
    if (!details) return
    let page_title = `Mua ${details.title}`
    const buy_options = data?.buy_options
    const shop_name = buy_options?.[buyOptionIndex]?.shop?.name
    if (shop_name) {
      page_title += ` - ${shop_name} - Maxmin`
    }
    document.title = page_title
  }, [buyOptionIndex, details])

  return (
    <Box
      className={classes.root}
      width='100%'
      height='fit-content'
      minHeight='100vh'
      boxSizing='border-box'
      paddingTop={`${pagePaddingTop}px`}
    >
      {loading && !smallLayout && <ProductPageSkeleton />}

      {!loading &&
        <>
          {!!details && !smallLayout &&
            <>
              <Box
                width='100%'
                height='fit-content'
                display='flex'
                justifyContent='space-between'
                boxSizing='border-box'
                paddingTop={2.5}
                paddingX={2}
              >
                <BookImage
                  bigImages={details.images.map(image => image.large_url)}
                  smallImages={details.images.map(image => image.thumb_url)}
                />
                <Box marginLeft={2} />
                <BookDetails
                  authors={details.authors}
                  desc={details.desc}
                  // list_price={details.list_price}
                  // price={details.price}
                  quantity_sold={details.quantity_sold}
                  rating={details.rating}
                  review_count={details.review_count}
                  title={details.title}
                  specs={details.specs}
                  buyOptionIndex={buyOptionIndex}
                  clickBuyOption={clickBuyOption}
                  buyOptions={data.buy_options}
                //.filter(option => option.price)
                />
                <Box marginLeft={2} />
                <PriceBox
                  buyOptionIndex={buyOptionIndex}
                  buyOptions={data.buy_options}
                  // bigImages={details.images.map(image => image.large_url)}
                  // smallImages={details.images.map(image => image.thumb_url)}
                  // url_key={details.url_key.replace('books/', '')}
                  id={id}
                  bookStatus={details.status}
                  setOpenAllBuyOptions={setOpenAllBuyOptions}
                />

              </Box>
              <Box marginY={2}><Divider /></Box>
            </>
          }

          {!!data && !smallLayout &&
            <>
              <BoughtTogether _items={[data.book, ...data.bought_together]} />
              <Box marginTop={2}><Divider /></Box>
            </>
          }

          {!!details && smallLayout &&
            <>
              <Box
                width='100%'
                height='fit-content'
                display='flex'
                flexDirection='column'
              >
                <BookImageSmall bigImages={details.images.map(image => image.large_url)} arrowColor='white' />
                <BookDetailsSmall
                  authors={details.authors}
                  desc={details.desc}
                  // list_price={details.list_price}
                  // price={details.price}
                  quantity_sold={details.quantity_sold}
                  rating={details.rating}
                  review_count={details.review_count}
                  title={details.title}
                  specs={details.specs}
                  buyOptionIndex={buyOptionIndex}
                  clickBuyOption={clickBuyOption}
                  buyOptions={data.buy_options}
                  setPriceBoxType={setPriceBoxType}
                />

              </Box>
            </>
          }

          {!!similarView &&
            <Box width='100%'>
              <ItemSlider
                items={similarView.items}
                label={similarView.label}
                link={similarView.link}
                maxWidth='none'
                isMobile={smallLayout}
                showDots={true}
              />
              <Box><Divider /></Box>
            </Box>
          }

          {!!similarBuy &&
            <>
              <ItemSlider
                items={similarBuy.items}
                label={similarBuy.label}
                link={similarBuy.link}
                maxWidth='none'
                isMobile={smallLayout}
                showDots={true}
              />
              {/* <Box><Divider /></Box> */}
            </>
          }

          {!!details && smallLayout &&
            <>
              <BuyBar
                setPriceBoxType={setPriceBoxType}
                setOpenPriceBoxDrawer={setOpenPriceBoxDrawer}
              />
              <PriceBoxDrawer
                open={openPriceBoxDrawer}
                onClose={() => setOpenPriceBoxDrawer(false)}
                buyOptionIndex={buyOptionIndex}
                buyOptions={data.buy_options}
                // url_key={details.url_key.replace('books/', '')}
                id={id}
                bookStatus={details.status}
                clickBuyOption={clickBuyOption}
                priceBoxType={priceBoxType}
                bigImages={details.images.map(image => image.large_url)}
                setOpenAllBuyOptions={setOpenAllBuyOptions}
              />
            </>
          }

          <Box
            display='flex'
            marginTop={2}
          >
            {/* <CustomerRatings stars='4.8' votes='211,678' ratings={[86, 10, 3, 1, 1]} />
        <Box width='75%' marginLeft={4}>
          <Review />
          <Review />
          <Review />

          <Divider />
          <Box marginTop={1} />
          <Button color="primary" size='small'>Xem tất cả đánh giá &nbsp;{'>'}</Button>
          <Box marginTop={3} />

        </Box> */}
          </Box>

          <AllBuyOptions book_id={details?._id} open={openAllBuyOptions} onClose={() => setOpenAllBuyOptions(false)} />
        </>
      }

    </Box>
  )
}

export default ProductPage