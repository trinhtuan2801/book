import { Box, Typography } from "@material-ui/core"
import { FavoriteBorder } from "@material-ui/icons"
import { useMemo } from "react"
import { GIFT_CARD_TYPES } from "../../constants"
import Logo from '../../images/logo.png'
import { numberWithCommas } from '../../ultils/NumberUtils'
import DiamondImg from '../CardImage/diamond.png'
import GoldImg from '../CardImage/gold.png'
import PlatinumImg from '../CardImage/platinum.png'
import RubyImg from '../CardImage/ruby.png'
import SilverImg from '../CardImage/silver.png'
import './Word3D.css'

const CardTemplate = ({ type, code = '', oname = '', ncredit = 0 }) => {

  const CardInfo = useMemo(() => {
    const info = {
      url: '',
      color: 'white',
      name: ''
    }
    if (ncredit < 100000) {
      info.url = SilverImg
      info.name = 'SILVER'
    } else if (ncredit < 200000) {
      info.url = GoldImg
      info.color = '#ffffff'
      info.name = "GOLD"
    } else if (ncredit < 300000) {
      info.url = PlatinumImg
      info.name = "PLATINUM"
    } else if (ncredit < 500000) {
      info.url = RubyImg
      info.name = "RUBY"
    } else {
      info.url = DiamondImg
      info.name = "DIAMOND"
    }

    return info
  }, [type, ncredit])

  let full_name_arr = oname?.split(' ')
  let full_name_length = full_name_arr.length
  let first_name = full_name_arr[0]
  let last_name = full_name_length > 1 ? full_name_arr[full_name_arr.length - 1] : ''
  let short_name = first_name + ' ' + last_name
  return (
    <>
      <Box
        maxWidth='320px'
        width='100%'
        height='200px'
        position='relative'
      >
        <img
          width='100%'
          height='100%'
          style={{
            objectFit: 'contain',
          }}
          src={CardInfo.url}
        >
        </img>
        <Box
          position='absolute'
          top='20px'
          left='20px'
          display='flex'
        >
          <img src={Logo} width='50px' height='50px' />
          <Box marginLeft={2}>
            <Typography
              style={{
                color: CardInfo.color,
                fontSize: '18px',
                fontWeight: 600
              }}
              className='word-3d'
            >MAXMIN</Typography>
            <Typography
              style={{
                color: CardInfo.color,
                fontSize: '10px',
              }}
              // variant='caption'
              className='word-3d'
            >{CardInfo.name} GIFT CARD</Typography>
            {/* <Box display='flex' alignItems='center'>
              <Typography
                style={{
                  color: CardInfo.color,
                  fontSize: '10px',
                  // textAlign: 'end'
                }}
                className='word-3d'
              >
                Nguyễn Trần Minh Nghi
              </Typography>
            </Box> */}
          </Box>
        </Box>
        <Box
          position='absolute'
          top='95px'
          left='20px'
          display='flex'
        >
          <Typography
            style={{ color: CardInfo.color, fontStyle: 'italic' }}
            variant='caption'
            className='word-3d'
          >
            Đổi sách đổi tương lai
            <br />
            Mua sách cũ, đổi sách mới giá cao toàn quốc
          </Typography>
        </Box>
        <Typography
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            color: CardInfo.color,
            fontSize: '16px'
          }}
          className='word-3d'
        >{code.replaceAll('-', ' - ')}</Typography>
        <Typography
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            color: CardInfo.color,
            fontSize: '16px'
          }}
          className='word-3d'
        >{numberWithCommas(ncredit)}đ</Typography>

        <Typography
          style={{
            position: 'absolute',
            top: '22px',
            right: '20px',
            color: CardInfo.color,
            fontSize: '12px',
            textAlign: 'center'
          }}
          className='word-3d'
        >
          {!!oname &&
            <>
              {short_name}
              <br />
            </>
          }

          <FavoriteBorder 
            fontSize="small" 
          />
        </Typography>
      </Box>
    </>
  )
}

export default CardTemplate