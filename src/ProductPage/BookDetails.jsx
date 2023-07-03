import { Avatar, Box, Divider, makeStyles, Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import classNames from "classnames";
import isNumber from "is-number";
import Carousel from "react-multi-carousel";
import Ribbon from "../CommonComponent/Ribbon/Ribbon";
import { BASE_FILE } from "../constants";
import { numberWithCommas } from '../ultils/NumberUtils';
import InfoIcon from "./InfoIcon";
import ReadMoreBox from "./ReadMoreBox";
const useStyles = makeStyles((theme) => ({
  bigImage: {
    objectFit: 'fill',
    width: '95%',
    height: 'auto',
    boxShadow: '0px 0px 15px 0px grey',
    objectPosition: 'top'
  },
  smallImage: {
    objectFit: 'cover',
    width: '24%',
    height: '50px',
    objectPosition: 'top'
  },
  typeBoxActive: {
    border: '1px solid #e7a976',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fdf8f3',
    cursor: 'pointer'
  },
  typeBoxInactive: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    backgroundColor: theme.palette.common.white,
  },
  typeBoxWrapper: {
    padding: '5px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  typeBoxDisabled: {
    border: `1px dashed ${theme.palette.grey[400]}`,
    cursor: 'default',
    color: theme.palette.grey[400],
    backgroundColor: theme.palette.common.white,
  },
  author: {
    color: '#3f51b5',
    cursor: 'pointer',
    '&:hover': {
      color: '#C7511F',
    }
  },
}))

export const choices = {
  'NEW': 'Mới',
  'LIKE_NEW': 'Cũ như mới',
  'VERY_GOOD': 'Cũ nhưng rất tốt',
  'GOOD': 'Cũ nhưng tốt',
  'ACCEPTABLE': 'Cũ dùng được',
}


const responsive = {
  xl: {
    breakpoint: {
      max: 3000,
      min: 1561
    },
    items: 5,
    partialVisibilityGutter: 40,
    slidesToSlide: 5
  },
  lg: {
    breakpoint: {
      max: 1561,
      min: 1416
    },
    items: 4,
    partialVisibilityGutter: 30,
    slidesToSlide: 4
  },
  md: {
    breakpoint: {
      max: 1416,
      min: 1254
    },
    items: 3,
    partialVisibilityGutter: 20,
    slidesToSlide: 3
  },
  sm: {
    breakpoint: {
      max: 1254,
      min: 1090
    },
    items: 2,
    partialVisibilityGutter: 10,
    slidesToSlide: 2
  },
  xs: {
    breakpoint: {
      max: 1090,
      min: 0
    },
    items: 1,
    partialVisibilityGutter: 0,
    slidesToSlide: 1
  }
}

const BookDetails = ({ authors, desc, quantity_sold, rating, review_count, title, specs, buyOptionIndex, clickBuyOption, buyOptions }) => {
  const classes = useStyles()

  const current_option = buyOptions[buyOptionIndex]
  const current_shop = current_option?.shop

  return (
    <Box
      name="book-details"
      width='calc(100% - 300px - 320px - 16px)'
      style={{ backgroundColor: '#fff' }}
      paddingX={2}
      boxSizing='border-box'
    >
      <Typography component="div" variant="h5" >{title}</Typography>
      {!!authors &&
        <Typography component="div">bởi&nbsp;
          <Typography
            className={classes.author}
            display="inline"
            onClick={() => { window.open(`/search?terms=${encodeURIComponent(authors.join(', '))}`, '_blank') }}
          >{authors.join(', ')}</Typography>
        </Typography>
      }
      <Box
        id="rating-box"
        display='flex'
        alignItems='center'
        justifyContent='flex-start'
        mt={0.2}
      >
        <Rating
          name="read-only"
          precision={0.1}
          value={rating ? rating : 0}
          readOnly>
        </Rating>
        <Box marginLeft={2} />
        <Box
          display='flex'
          alignItems='center'
        >
          {!!rating &&
            <>
              <Typography style={{ color: 'orange' }}>{rating}</Typography>
              <Box marginLeft={2} />
              <Divider flexItem orientation="vertical" />
              <Box marginLeft={2} />
            </>
          }
          {!!review_count &&
            <>
              <Typography component="div" color='textPrimary' style={{ textDecoration: 'underline' }}>
                {numberWithCommas(review_count)}
              </Typography>
              <Box marginLeft={1} />
              <Typography variant="body2" color='textSecondary'>Đánh giá</Typography>
              <Box marginLeft={2} />
              <Divider flexItem orientation="vertical" />
              <Box marginLeft={2} />
            </>
          }
          {!!quantity_sold &&
            <>
              <Typography component="div" color='textPrimary' style={{ display: 'flex', alignItems: 'center' }}>
                {numberWithCommas(quantity_sold)}
              </Typography>
              <Box marginLeft={1} />
              <Typography variant="body2" color='textSecondary'>Đã bán</Typography>
            </>
          }
        </Box>
      </Box>
      {current_shop &&
        <>
          <Box mt={1} />
          <ShopMinimalInfo name={current_shop.name} pimg={current_shop.pimg} />
        </>
      }
      <Box marginTop={2} />
      <Divider />
      <Box marginTop={3} />

      <Box
        display='flex'
        justifyContent='flex-start'
        flexWrap='wrap'
      >
        {buyOptions.map((option, index) => (
          <Box
            key={index}
            onClick={option.quantity ? (() => clickBuyOption(index)) : null}
            // className={buyOptionIndex === index ? classes.typeBoxActive : classes.typeBoxInactive}
            className={classNames({
              [classes.typeBoxActive]: buyOptionIndex === index,
              [classes.typeBoxInactive]: buyOptionIndex !== index,
              [classes.typeBoxDisabled]: option.quantity === 0
            })}
            height='70px'
            boxSizing='border-box'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            padding={1.5}
            paddingX={2}
            flexGrow={1}
            maxWidth='150px'
            minWidth='150px'
            marginLeft={1}
            marginBottom={1}
            position='relative'
          >
            <Typography
              component='div'
              style={{
                fontWeight: (buyOptionIndex === index && option.quantity !== 0) ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              {choices[option.otype]}
            </Typography>
            <Typography
              component='div'
              style={{
                fontWeight: (buyOptionIndex === index && option.quantity !== 0) ? 'bold' : 'normal',
                color: (buyOptionIndex === index && option.quantity !== 0) ? '#a3331a' : 'inherit',
                fontSize: '14px'
              }}
            >
              {numberWithCommas(option.price) || '- '}đ
            </Typography>

            {option.sales?.length > 0 &&
              <Ribbon>-{option.sales[0].psale}%</Ribbon>
            }
          </Box>
        ))}
      </Box>

      <Box marginTop={2} />

      {/* <Typography component='div' variant="body1">
        <div dangerouslySetInnerHTML={{ __html: desc }}></div>
      </Typography> */}
      <ReadMoreBox content={desc} />

      <Box marginTop={2} />
      <Divider />
      <Box marginTop={2} />

      <Box
        height='fit-content'
        width='100%'
        position='relative'
        paddingX={3}
        boxSizing='border-box'
      >
        <Carousel
          additionalTransfrom={0}
          autoPlay={false}
          shouldResetAutoplay={false}
          autoPlaySpeed={0}
          centerMode={false}
          draggable
          focusOnSelect={false}
          infinite={false}
          minimumTouchDrag={0}
          responsive={responsive}
          showDots={false}
          slidesToSlide={3}
          swipeable
          renderDotsOutside
          className="slider"
        >
          {specs[0].attributes.filter(attr => attr.value).map((attr, index) => (
            <InfoIcon
              key={index}
              name={attr.name}
              code={attr.code}
              value={attr.value}
            />

          ))}
        </Carousel>
      </Box>
    </Box>
  )
}

export default BookDetails

export const ShopMinimalInfo = ({ name, pimg, small }) => {
  return (
    <Box display='flex'>
      <Avatar
        src={`${BASE_FILE}/${pimg}`}
        alt={name}
        style={{ width: small ? 18 : 24, height: small ? 18 : 24 }}
      />
      <Box ml={1} />
      <Typography style={{ fontWeight: 600 }} variant={small ? 'body2' : 'body1'}>{name}</Typography>
    </Box>
  )
}