import { Box, Divider, makeStyles, Typography } from "@material-ui/core";
import { Done, SentimentVerySatisfied } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import classNames from "classnames";
import isNumber from "is-number";
import Ribbon from "../../CommonComponent/Ribbon/Ribbon";
import { numberWithCommas } from "../../ultils/NumberUtils";
import { ShopMinimalInfo, choices } from "../BookDetails";
import FreeReturn from "../FreeReturn";
import InfoIcon from "../InfoIcon";
import { PRICE_BOX_TYPE } from "../ProductPage";
import ReadMoreSmall from "./ReadMoreSmall";

const useStyles = makeStyles((theme) => ({
  typeBoxActive: {
    border: '1px solid #e7a976',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fdf8f3',
    cursor: 'pointer'
  },
  typeBoxInactive: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    cursor: 'pointer'
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
  },
}))

const BookDetailsSmall = ({
  authors, desc, quantity_sold, rating, review_count, title, specs, buyOptionIndex, clickBuyOption, buyOptions, setPriceBoxType
}) => {

  const classes = useStyles()
  const onClickBuyOption = (index) => {
    clickBuyOption(index)
    setPriceBoxType(PRICE_BOX_TYPE.BOTH)
  }

  const current_option = buyOptions[buyOptionIndex]
  const current_shop = current_option?.shop


  return (
    <>
      <Box
        width='100%'
        boxSizing='border-box'
        padding={1}
      >
        <Typography
          // variant="h6"
          style={{ fontWeight: 'bold', fontSize: '14px' }}
        >
          {title}
        </Typography>
        {authors?.length > 0 &&
          <Typography
            variant='body2'
            onClick={() => { window.open(`/search?terms=${encodeURIComponent(authors.join(', '))}`, '_blank') }}
            className={classes.author}
            component='div'
            style={{ width: 'fit-content' }}
          >
            {authors?.join(', ') + ' >'}
          </Typography>
        }

        <Box
          id="rating-box"
          display='flex'
          alignItems='base-line'
          justifyContent='flex-start'
          marginTop={0.2}
          marginBottom={1.5}
        >
          <Rating
            name="read-only"
            precision={0.1}
            value={rating ? rating : 0}
            readOnly
            size="small"
          >
          </Rating>
          <Box marginLeft={1} />
          <Box
            display='flex'
            alignItems='center'
          >
            {!!rating &&
              <>
                <Typography style={{ color: 'orange' }} variant='caption'>{rating}</Typography>
                <Box marginLeft={1} />
                <Divider flexItem orientation="vertical" />
                <Box marginLeft={1} />
              </>
            }
            {!!review_count &&
              <>
                <Typography
                  component="div"
                  color='textPrimary'
                  style={{ textDecoration: 'underline' }}
                  variant='caption'
                >
                  {numberWithCommas(review_count)}
                </Typography>
                <Box marginLeft={1} />
                <Typography
                  // variant="body2" 
                  color='textSecondary'
                  variant='caption'
                >Đánh giá</Typography>
                <Box marginLeft={1} />
                <Divider flexItem orientation="vertical" />
                <Box marginLeft={1} />
              </>
            }
            {!!quantity_sold &&
              <>
                <Typography
                  component="div"
                  color='textPrimary'
                  style={{ display: 'flex', alignItems: 'center' }}
                  variant='caption'
                >
                  {numberWithCommas(quantity_sold)}
                </Typography>
                <Box marginLeft={1} />
                <Typography variant='caption' color='textSecondary'>Đã bán</Typography>
              </>
            }
          </Box>
        </Box>
        <Box marginTop={1} />
        <Divider />
        {current_shop &&
          <>
            <Box mt={1} />
            <ShopMinimalInfo name={current_shop.name} pimg={current_shop.pimg} small />
          </>
        }
        <Box marginTop={1} />

        <Divider />
        <Box
          display='flex'
          width='100%'
          flexWrap='wrap'
          marginTop={1}
          justifyContent='center'
          gridColumnGap={8}
        >
          {buyOptions.map((option, index) => (
            <Box
              key={index}
              onClick={option.quantity ? (() => onClickBuyOption(index)) : null}
              className={classNames({
                [classes.typeBoxActive]: buyOptionIndex === index,
                [classes.typeBoxInactive]: buyOptionIndex !== index,
                [classes.typeBoxDisabled]: option.quantity === 0
              })}
              height='50px'
              boxSizing='border-box'
              display='flex'
              flexDirection='column'
              justifyContent='center'
              padding={1.5}
              paddingX={1}
              flexGrow={1}
              maxWidth='110px'
              minWidth='110px'
              marginBottom={1}
              position='relative'
            >
              <Typography
                component='div'
                style={{
                  fontWeight: (buyOptionIndex === index && option.quantity !== 0) ? 'bold' : 'normal',
                  fontSize: '12px'
                }}
              >
                {choices[option.otype]}
              </Typography>
              <Typography
                component='div'
                style={{
                  fontWeight: (buyOptionIndex === index && option.quantity !== 0) ? 'bold' : 'normal',
                  color: (buyOptionIndex === index && option.quantity !== 0) ? '#a3331a' : 'inherit',
                  fontSize: '12px'
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
        <Divider />
        {/*Mô tả */}
        <FreeReturn />
        <Divider />
        <Box
          marginTop={1.5}
          marginBottom={1.5}
        >
          <Typography style={{ fontWeight: '500', fontSize: '14px' }}>Mô tả</Typography>
          <Box marginTop={2} />
          <ReadMoreSmall content={desc} />
        </Box>
        <Divider />
        {/*Thông số */}
        <Box
          marginTop={1.5}
          marginBottom={1}
          height='fit-content'
        >
          <Typography style={{ fontWeight: '500', fontSize: '14px' }}>Thông số</Typography>
          <Box
            width='100%'
            position='relative'
            paddingX={3}
            boxSizing='border-box'
            style={{ overflowX: 'scroll' }}
            display='flex'
            marginTop={2}
            paddingBottom={2}
          >
            {specs[0].attributes.filter(attr => attr.value).map((attr, index) => (
              <Box
                key={index}
                minWidth='fit-content'
                display='flex'
                justifyContent='center'
                marginRight={2}
              >
                <InfoIcon
                  name={attr.name}
                  code={attr.code}
                  value={attr.value}
                />
              </Box>
            ))}
          </Box>

        </Box>
        <Divider />
      </Box>
    </>
  )
}

export default BookDetailsSmall