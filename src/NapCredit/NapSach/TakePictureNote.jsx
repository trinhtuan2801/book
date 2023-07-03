import { Box, Collapse, IconButton, Typography } from "@material-ui/core"
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import { useState } from "react"
import DemoPictures from "./DemoPictures"
import pic1 from './NapSachPicture/1.jpg'
import pic2 from './NapSachPicture/2.jpg'
import pic3 from './NapSachPicture/3.jpg'
import pic4 from './NapSachPicture/4.jpg'
import pic5 from './NapSachPicture/5.jpg'
import pic6 from './NapSachPicture/6.jpg'
import pic7 from './NapSachPicture/7.jpg'
import pic8 from './NapSachPicture/8.jpg'


const TakePictureNote = ({ type = 1 }) => {
  const [openNote, setOpenNote] = useState(false)
  return (
    <>
      <Typography variant="body2" style={{ fontWeight: 400 }} color='textSecondary'>
        {type === 1 ? '*Lưu ý khi chụp ảnh' : 'Ảnh mẫu'}
        <IconButton onClick={() => setOpenNote(prev => !prev)} size='small'>
          {openNote ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Typography>
      <Collapse in={openNote} timeout="auto">
        <Box border='1px solid grey' borderRadius={5} padding={2} boxSizing='border-box' width='fit-content'>
          {type === 1 &&
            <>
              <Typography variant='body2'>
                - Cần chụp <b>rõ</b> và đủ tình trạng <b>xuống cấp</b> của sách
                <br />
                - Nên chụp với ánh sáng <b>trắng</b>, ánh sáng <b>tự nhiên</b>
                <br />
                - Nên chụp <b>điểm hấp dẫn</b> của sách như nội dung giới thiệu hay, hoặc in màu trình bày đẹp
              </Typography>
              <Box marginTop={1} />
              <Typography variant='body2' style={{ fontWeight: 500 }}>*Ảnh mẫu:</Typography>
              <Box marginTop={1} />
            </>
          }

          <DemoPictures
            pictures={ type === 1 ? [
              pic1,
              pic2,
              pic3,
            ] : [
              pic5,
              pic6,
              pic7,
              pic8,
            ]}
          />
        </Box>
      </Collapse>
    </>
  )
}

export default TakePictureNote