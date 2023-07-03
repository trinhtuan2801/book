import { Box, Checkbox, Collapse, Divider, FormControlLabel, FormGroup, IconButton, Typography, makeStyles, useMediaQuery } from "@material-ui/core"
import FreeShipLevel from "../../FreeShipLevel"
import { Fragment, useEffect, useState } from "react"
import UploadImageButton from "../../UploadImageButton"
import TakePictureNote from "../../NapSach/TakePictureNote"
import { CheckCircle, ExpandLess, ExpandMore } from "@material-ui/icons"
import { useSnackbar } from "notistack"
import { axiosGet, axiosPost } from "../../../ultils/axiosUtils"
import { BASE_API } from "../../../constants"
import { CustomButton } from "../../../CommonComponent/CustomButton"
import { useSearchParams } from "react-router-dom"
import { getElementOffset } from "../../../ultils/ScrollToTop"

const pictures = [
  {
    name: 'Bìa trước',
    book_part: 'front-cover'
  },
  {
    name: 'Bìa sau',
    book_part: 'back-cover'
  },
  {
    name: 'Mặt trong bìa & trang đầu',
    book_part: 'first-page'
  }
]

const additional_pictures = [
  {
    name: '',
    book_part: 'addition'
  },
  {
    name: '',
    book_part: 'addition'
  },
  {
    name: '',
    book_part: 'addition'
  }
]

class BookCondition {
  code = ''
  name = ''
  needImage = false
  imageIndex = -1
  constructor(code, name, needImage = false, imageIndex = -1) {
    this.code = code
    this.name = name
    this.needImage = needImage
    this.imageIndex = imageIndex
  }
}

const book_conditions = [
  new BookCondition('cover_spine_wear', 'Bìa/gáy bị trầy, móp'),
  new BookCondition('page_few_lost', 'Thiếu trang'),
  new BookCondition('page_few_detach', 'Trang rời khỏi gáy'),
  new BookCondition('page_wear', 'Nhăn mép', true, 0),
  new BookCondition('page_water_damage', 'Trang có vết ố', true, 1),
  new BookCondition('page_noted', 'Trang có đánh dấu/ghi chú', true, 2),
]

const NapOther = ({
  refreshParent = () => { }
}) => {
  const [searchParams] = useSearchParams()
  const cat_id = searchParams.get('cat_id')
  const [bookPictures, setBookPictures] = useState([null, null, null])
  const [bookPicturesPlus, setBookPicturesPlus] = useState([null, null, null])
  const [expandPlusPicture, setExpandPlusPicture] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const resetState = () => {
    refreshParent()
    setBookPictures([null, null, null])
    setBookPicturesPlus([null, null, null])
  }

  const getRequiredUploadNumber = () => {
    return bookPictures.filter(pic => pic !== null).length
  }

  const addBookPicture = (index, setFunc, bookPart) => (obj) => {
    setFunc(prev => {
      let res = prev.slice()
      res[index] = {
        ...obj,
        bookPart
      }
      return res
    })
  }

  const deleteBookPicture = (index, setFunc) => () => {
    setFunc(prev => {
      let res = prev.slice()
      res[index] = null
      return res
    })
  }

  const addDepositBook = async () => {

    let missingPictureIndex = bookPictures.findIndex(pic => pic === null)
    if (missingPictureIndex !== -1) {
      enqueueSnackbar(<span>Chưa có đủ <b>Hình ảnh sản phẩm</b> ({getRequiredUploadNumber()}/{pictures.length})</span>, { variant: 'error', autoHideDuration: 2000 })
      scrollToElement('required-pictures')
      return
    }

    const book = {
      "title": '',
      "authors": [],
      "publisher": '',
      "original_price": 0,
      "ospecs": [
        ...book_conditions.map((cond) => ({
          code: cond.code,
          name: cond.name,
          value: false
        }))
      ],
      "images": [
        ...[...bookPictures, ...bookPicturesPlus].filter(pic => pic !== null),
      ],
      "book_id": null,
    }
    console.log('new deposit item', book)
    let response = await axiosPost(`${BASE_API}/deposit-cartitems/categories/${cat_id}`, book, true)
    if (!response || response.code !== 200) {
      enqueueSnackbar(response?.message || 'Lỗi khi thêm', { variant: 'error', autoHideDuration: 2000 })
    } else {
      enqueueSnackbar('Thêm sản phẩm thành công', { variant: 'success', autoHideDuration: 2000 })
      scrollToElement('top')
      resetState()
    }
  }

  const scrollToElement = (id) => {
    let element = document.getElementById(id)
    window.scrollTo({ behavior: 'smooth', top: getElementOffset(element) - 200 })
  }

  return (
    <>
      <Box
        width='fit-content'
        marginTop={2}
        id='top'
      >
        <Box marginTop={2} />

        <Box display='flex' alignItems='center' id='required-pictures'>
          <Typography style={{ fontWeight: 500 }}>Hình ảnh sản phẩm</Typography>

          <Box marginLeft={1} />
          <Typography style={{ color: getRequiredUploadNumber() === pictures.length ? 'green' : 'red' }}>({`${getRequiredUploadNumber()}/${pictures.length}`} ảnh)</Typography>
          <Box marginLeft={1} />
          {getRequiredUploadNumber() === pictures.length && <CheckCircle style={{ color: 'green' }} />}

        </Box>

        <Box
          display='flex'
          marginBottom={2}
          marginTop={1}
          flexWrap='wrap'
          gridRowGap={10}
        >
          {pictures.map((picture, index) => (
            <UploadImageButton
              key={index}
              title={''}
              onUpload={addBookPicture(index, setBookPictures, picture.book_part)}
              onDelete={deleteBookPicture(index, setBookPictures)}
            />
          ))}
        </Box>
        <Box
          onClick={() => setExpandPlusPicture(!expandPlusPicture)}
          display='flex'
          alignItems='center'
          style={{ cursor: 'pointer' }}
        >
          <Typography gutterBottom style={{ fontWeight: 500 }}>
            {'Hình ảnh khác (nếu cần)'}
          </Typography>
          <IconButton style={{ color: 'black', marginTop: '-5px' }} size='small'>
            {expandPlusPicture ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={expandPlusPicture}>
          <Box
            display='flex'
            marginBottom={2}
            marginTop={1}
            flexWrap='wrap'
            gridRowGap={10}
          >
            {additional_pictures.map((picture, index) => (
              <UploadImageButton
                key={index}
                title={''}
                onUpload={addBookPicture(index, setBookPicturesPlus, picture.book_part)}
                onDelete={deleteBookPicture(index, setBookPicturesPlus)}
              />
            ))}
          </Box>
        </Collapse>

        <Box
          my={2}
        >
          <Divider />
        </Box>

        <Box
          display='flex'
          alignItems='center'
        >
          <CustomButton
            onClick={addDepositBook}
            backgroundColor="yellow"
            variant="contained"
            width='300px'
            borderRadius='amazon'
          // disabled={getRequiredUploadNumber() < 4}
          >
            Thêm
          </CustomButton>
        </Box>
      </Box>
    </>
  )
}

export default NapOther