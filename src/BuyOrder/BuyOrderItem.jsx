import { Box, makeStyles, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import { BASE_FILE, OTYPE_VN } from "../constants"
import { numberWithCommas } from "../ultils/NumberUtils"

const useStyles = makeStyles((theme) => ({
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  }
}))

const BuyOrderItem = ({
  authors,
  otype,
  price,
  quantity,
  thumb_url,
  title,
  url_key,
  _id,
}) => {
  const classes = useStyles()

  return (
    <Box
      width='100%'
      display='flex'
      justifyContent='space-between'
      position='relative'
    >
      <Box display='flex'>
        <Box>
          <Link to={`/product/${encodeURIComponent(url_key.replace('books/', ''))}`}>
            <img
              src={`${BASE_FILE}/${thumb_url}`}
              style={{
                height: '80px',
                width: '80px',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </Link>
        </Box>
        <Box marginLeft={1} />
        <Box>
          <Link to={`/product/${encodeURIComponent(url_key.replace('books/', ''))}`}>
            <Typography
              style={{
                textDecoration: 'underline'
              }}
              className={classes.label}
            >{title}</Typography>
          </Link>
          <Typography>{authors}</Typography>
          <Typography style={{ color: 'orange', fontWeight: 'bold' }}>{OTYPE_VN[otype]}</Typography>
        </Box>
      </Box>
      <Box marginLeft={1}/>
      <Box display='flex' justifyContent='flex-end' >
        <Box
          display='flex'
          flexDirection='column'
          alignItems='flex-end'
        >
          <Typography variant='body2' style={{ textAlign: 'end', fontWeight: 'bold' }}>
            {numberWithCommas(price * quantity)}đ
          </Typography>
          <Typography variant='body2'>
            ({numberWithCommas(price)}đ x{quantity})
          </Typography>
        </Box>

      </Box>

    </Box>
  )
}

export default BuyOrderItem