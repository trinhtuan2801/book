import { Box, Typography } from "@material-ui/core"
import { AlternateEmail, Email, Facebook, Home, Language, Phone } from "@material-ui/icons"
import { Fragment } from "react"
import { Link, useNavigate } from "react-router-dom"

const icon_labels = [
  {
    Icon: Home,
    label: '505 Minh Khai (TTTM V+)\nPhường Vĩnh Tuy, Quận Hai Bà Trưng\nHà Nội, Việt Nam',
  },
  {
    Icon: Email,
    label: 'thanhlct@gmail.com',
  },
  {
    Icon: Facebook,
    label: 'shop.mbooks',
    link: 'https://www.facebook.com/shop.mbooks'
  },
  {
    Icon: Phone,
    label: '+84 904 464 538',
  }
]

const ContactMbooks = () => {
  return (
    <>
      {/* <Typography variant='h6' >Liên hệ</Typography> */}
      <Box width='280px'>
        {icon_labels.slice(0, 1).map((item, index) =>
          <IconLabel {...item} key={index} lineHeight="24px"/>
        )}
      </Box>

      {/* <Box width='241.5px'>
        {icon_labels.slice(1).map((item, index) =>
          <IconLabel {...item} key={index} />
        )}
      </Box> */}
      <Box width='235px'>
        {icon_labels.slice(1).map((item, index) =>
          <IconLabel {...item} key={index} />
        )}
      </Box>
    </>
  )
}
export default ContactMbooks

const IconLabel = ({ Icon, label, link, lineHeight = '18px' }) => {
  return (
    <Box
      display='flex' mt={1}
      onClick={() => {
        if (link) window.open(link, '_blank')
      }}
      style={{ cursor: link ? 'pointer' : 'default' }}
    >
      <Icon fontSize='small' style={{ color: 'grey' }} />
      <Typography variant="body2" style={{
        whiteSpace: 'pre-wrap',
        marginLeft: '8px',
        lineHeight: lineHeight
      }}>{label}</Typography>
    </Box>
  )
}