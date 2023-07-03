import { Box, Collapse, IconButton, Typography } from "@material-ui/core"
import { ExpandLess, ExpandMore, SentimentVerySatisfied } from "@material-ui/icons"
import { useState } from "react"

const FreeReturn = () => {
  const [open, setOpen] = useState(false)
  return (
    <Box
      marginTop={1.5}
      marginBottom={1.5}
    >
      <Box display='flex' justifyContent='space-between' onClick={() => setOpen(prev => !prev)} style={{ cursor: 'pointer' }}>
        <Typography style={{ fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', color: 'purple' }} >
          <SentimentVerySatisfied style={{ marginRight: '8px' }} />
          Đổi trả hàng miễn phí
        </Typography>
        <IconButton size='small'>
          {open ?
            <ExpandLess /> :
            <ExpandMore />
          }
        </IconButton>
      </Box>
      <Collapse in={open} timeout='auto'>
        <Box
          marginTop={2}
          width='100%'
          maxWidth='100%'
          height='fit-content'
          paddingX={1}
          boxSizing='border-box'
        >
          <Typography
            style={{ fontSize: '14px' }}
          >
            Nếu sản phẩm có vấn đề sai khác, bạn có thể đổi trả trong 3 ngày với hiện trạng không đổi. Bạn vui lòng chụp ảnh chi tiết và tạo yêu cầu đổi trả tối đa sau 6 giờ từ thời điểm nhận hàng.
          </Typography>
        </Box>
      </Collapse>
    </Box >
  )
}

export default FreeReturn