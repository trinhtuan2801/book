import { Avatar, Box, Button, Divider, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { LocalShipping, Replay, Reply, SentimentVerySatisfied } from "@material-ui/icons"
import Logo from '../images/logo_big_res.png'
import ContactMbooks from "./ContactMbooks"
import { useSelector } from "react-redux"
import useMediaReturn from "../ultils/useMediaReturn"
import useWatchResize from "../ultils/useWatchSize"
import { useRef } from "react"
import { WEB_SHOP_URL } from "../constants"

const features = [
  {
    Icon: Replay,
    name: '3 ngày miễn phí đổi trả',
    desc: 'Đổi trả hàng miễn phí trong 3 ngày',
  },
  {
    Icon: SentimentVerySatisfied,
    name: 'Dịch vụ tốt nhất',
    desc: 'Chăm sóc khách hàng tận tình',
  },
  {
    Icon: LocalShipping,
    name: 'Miễn phí vận chuyển',
    desc: 'Giao hàng miễn phí toàn quốc',
  }
]

const Footer = () => {
  const theme = useTheme()
  const smallLayout = useMediaQuery('(max-width:840px)')
  const watch_ref = useRef()

  return (
    <>
      <Box flexGrow={1} />

      <div
        // mt={2}
        ref={watch_ref}
        style={{
          // position: 'absolute',
          // bottom: 0,
          width: '100%',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingBottom: smallLayout ? 64 : 16
        }}
      >
        <Box
          width='100%'
          display='flex'
          bgcolor='#3f51b5'
          height='4px'
        />

        <Box
          py={3}
          px={2}
          width='100%'
          height='fit-content'
          boxSizing='border-box'
          maxWidth='1480px'
          display='flex'
          justifyContent='space-between'
          flexWrap='wrap'
          gridGap={32}
          gridRowGap={20}
        >
          {features.map((feature, index) =>
            <Feature key={index} {...feature} />
          )}
        </Box>
        <Divider flexItem style={{ height: '1px' }} />
        <Box
          width='100%'
          height='fit-content'
          boxSizing='border-box'
          maxWidth='1480px'
          display='flex'
          justifyContent='space-between'
          mt={3}
          pb={3}
          px={2}
          flexWrap='wrap'
          gridGap={32}
          gridRowGap={20}
        >
          <Box >
            <img
              src={Logo}
              style={{
                width: '270.11px',
                objectFit: 'contain',
                // backgroundColor: '#3f51b5',
                // borderRadius: '50%'
              }}
            />
          </Box>

          <ContactMbooks />

        </Box>
        <Button variant="contained" color='primary'
          onClick={() => window.open(WEB_SHOP_URL, '_blank')}
        >Đăng ký shop</Button>
      </div>
    </>
  )
}

export default Footer

const Feature = ({ Icon, name, desc }) => {
  return (
    <Box display='flex'>
      <Avatar
        style={{ color: 'white', backgroundColor: '#3f51b5' }}
      >
        <Icon />
      </Avatar>
      <Box ml={1.5}>
        <Typography variant='body2' style={{ fontWeight: 600 }}>{name}</Typography>
        <Typography variant='body2' >{desc}</Typography>
      </Box>
    </Box>
  )
}