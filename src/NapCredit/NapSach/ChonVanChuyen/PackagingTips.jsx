import { Box, Collapse, IconButton, Typography } from "@material-ui/core"
import { Check, Clear, ExpandLess, ExpandMore } from "@material-ui/icons"
import { useState } from "react"
import DoImage from './DemoImages/do.png'
import DontImage from './DemoImages/dont.png'

const PackagingTips = () => {
  const [showTip, setShowTip] = useState(false)

  return (
    <>
      <Typography
        variant='body2'
        style={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
        onClick={() => setShowTip(prev => !prev)}
      >*Cách gói hàng
        <IconButton size='small' style={{ color: 'black' }}>
          {showTip ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Typography>

      <Collapse in={showTip}>
        <Box border='1px solid grey' borderRadius={5} padding={2} boxSizing='border-box' width='fit-content'>
          <>
            <Typography variant='body2' style={{ display: 'flex', alignItems: 'center' }}>
              <Check style={{ color: 'green' }} />
              <Box marginLeft={1}/>
              <span><b>Nên</b> dùng <b>hộp giấy</b> hoặc <b>bìa cát-tông</b> để bọc</span>
            </Typography>
            <Box marginTop={1}/>
            <Image url={DoImage} />
            <Typography variant='body2' style={{ display: 'flex', alignItems: 'center' }}>
              <Clear style={{ color: 'red' }} />
              <Box marginLeft={1}/>
              <span><b>Tránh</b> dùng <b>nilon</b>, <b>giấy mỏng</b> khi vận chuyển sẽ dễ bị rách, móp, ảnh hưởng đến định giá</span>
            </Typography>
            <Box marginTop={1}/>
            <Image url={DontImage} />
          </>
        </Box>
      </Collapse>
    </>
  )
}

export default PackagingTips

const Image = ({ url }) => {
  return (
    <img
      src={url}
      style={{ width: '100px', height: '100px' }}
    />
  )
}