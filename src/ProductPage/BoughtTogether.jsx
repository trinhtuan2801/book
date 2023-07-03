import { Box, Checkbox, makeStyles, Typography } from "@material-ui/core";
import { ErrorOutlined } from "@material-ui/icons";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../CommonComponent/CustomButton";
import { BASE_API, BASE_FILE } from "../constants";
import { refreshNavbar } from "../redux/rootReducer";
import { axiosGet, axiosPost } from "../ultils/axiosUtils";
import { openNewTab } from "../ultils/linkUtils";
import { numberWithCommas } from "../ultils/NumberUtils";
import { signIn } from "../ultils/SpecialRoute/SignedInRoute";

const useStyles = makeStyles((theme) => ({
  image: {
    objectFit: 'cover',
    width: '80px',
    height: '120px',
    objectPosition: 'top'
  },
  link: {
    color: '#3f51b5',
    cursor: 'pointer',
    '&:hover': {
      color: '#C7511F',
    }
  },
}))

const _0items = [
  {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: '1',
    shipping: '30.98',
    src: 'https://i2-prod.walesonline.co.uk/incoming/article6890072.ece/ALTERNATES/s615b/hp1.jpg',
    url_key: 'giao-tiep-hieu-qua-trong-kinh-doanh'
  },
]

const BoughtTogether = ({ _items = [] }) => {
  const classes = useStyles()
  const [items, setItems] = useState([])
  const [checkList, setCheckList] = useState(new Array(_items.length).fill(true))

  useEffect(() => {
    setItems(_items.map((item) => (
      {
        title: item.title,
        author: item.authors,
        price: item.price,
        src: `${BASE_FILE}/${item.images[0]?.thumb_url}`,
        url_key: item.url_key.replace('books/', '')
      }
    )))
  }, [_items])

  const countChecked = useCallback(() => {
    return checkList.reduce((prev, curr) => prev += curr, 0)
  }, [checkList])

  const getTotalPrice = useCallback(() => {
    const result = items.reduce((prev, curr, index) =>
      prev + checkList[index] * Number(curr.price), 0)
    return result
  }, [checkList, items])

  const onCheck = (index) => (event) => {
    let checkListClone = checkList.slice()
    checkListClone[index] = event.target.checked
    setCheckList(checkListClone)
  }

  const getButtonLabel = useCallback(() => {
    const count = countChecked()
    if (count === checkList.length) return 'Thêm tất cả vào giỏ'
    return `Thêm ${count} sản phẩm vào giỏ`
  }, [checkList])

  const dispatch = useDispatch()
  const { signed_in } = useSelector(state => state.root)
  const navigate = useNavigate()
  const addToCart = async () => {
    if (!signed_in) {
      signIn()
      return
    }

    for (let i = 0; i < _items.length; i++) {
      const item = _items[i]
      if (!checkList[i]) continue
      let response = await axiosGet(`${BASE_API}/books/${item._id}/buy-options`)
      if (!response || response.code !== 200) return
      let data = response.data[0]
      response = await axiosPost(`${BASE_API}/cartitems`, {
        book_id: item._id,
        otype: data.otype,
        price: data.price,
        quantity: 1,
        ditem_id: data.ditem_id
      }, true)
      if (!response || response.code !== 200) return
    }

    dispatch(refreshNavbar())
    navigate(`/confirm?from=product-page&id=${_items.filter((item, index) => checkList[index]).map(item => item._id).join(',')}`)
  }

  return (
    <Box
      // style={{ backgroundColor: 'yellow' }}
      name="bought-together"
      height='fit-content'
      width='100%'
      boxSizing='border-box'
      paddingX={1}
    >
      <Typography variant="h5" >Thường mua cùng nhau</Typography>

      <Box
        display='flex'
        alignItems='center'
        marginTop={2}
        boxSizing='border-box'
        paddingLeft={4}
      >
        {items.filter((item, index) => checkList[index]).map((item, index) => (
          <Fragment key={index}>
            {index !== 0 && (
              <Box marginX={4}>
                <Typography variant="h5" color="textSecondary">+</Typography>
              </Box>
            )}
            <img className={classes.image} src={item.src} alt="" />
          </Fragment>
        ))}

        <Box
          marginLeft={8}
        >
          {countChecked() > 0 ?
            <>
              <Typography component='div' style={{ color: '#565959' }}>Tổng tiền:
                <Typography
                  display="inline"
                  color="secondary"
                >
                  &nbsp;{numberWithCommas(getTotalPrice())}đ
                </Typography>
              </Typography>
              <Box marginTop={2} />
              <CustomButton
                variant="contained"
                backgroundColor='yellow'
                onClick={addToCart}
              >
                {getButtonLabel()}
              </CustomButton>
            </>
            :
            <Box display='flex' alignItems='center' marginY={6}>
              <ErrorOutlined color='primary' />
              <Box marginLeft={1} />
              <Typography variant='body2'>Bạn cần chọn ít nhất 1 sản phẩm</Typography>
            </Box>
          }
        </Box>
      </Box>

      <Box marginTop={2.5} />

      {items.map((item, index) => (
        <Box
          key={index}
          display='flex'
          alignItems='center'
        >
          <Checkbox
            color="primary"
            onChange={onCheck(index)}
            size='small'
            style={{ fontSize: 10, width: 10, height: 10 }}
            checked={checkList[index]}
          />
          <Box marginLeft={0.5} />
          <Box
            display='flex'
            alignItems='center'
            style={{ opacity: checkList[index] ? 1 : 0.5 }}
          >
            {index === 0 ?
              <>
                <Typography style={{ fontWeight: '600' }} variant='body2'>Sản phẩm đang xem:&nbsp;</Typography>
                <Typography variant='body2'>{item.title}</Typography>
              </>
              :
              <Typography
                variant='body2'
                className={classes.link}
                onClick={() => openNewTab(`/product/${encodeURIComponent(item.url_key)}`)}
              >
                {item.title}
              </Typography>
            }
            <Typography variant="caption">&nbsp;bởi</Typography>
            <Typography
              variant='body2'
              onClick={() => openNewTab(`/search?terms=${encodeURIComponent(item.author.join(', '))}`)}
              className={classes.link}
            >
              &nbsp;{item.author.join(', ')}
            </Typography>
            <Typography color="secondary">&nbsp;{numberWithCommas(item.price)}đ</Typography>
            <Typography style={{
              fontWeight: 'bold',
              color: 'indigo'
            }}>&nbsp;(MỚI)</Typography>
          </Box>


        </Box>
      ))}
    </Box>
  )
}

export default BoughtTogether